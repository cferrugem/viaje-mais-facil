import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

interface Seat {
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
  type: 'window' | 'aisle';
}

const BookingDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { state: authState } = useAuth();
  const { state: bookingState, setCurrentBooking } = useBooking();
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerInfo, setPassengerInfo] = useState({
    fullName: `${authState.user?.firstName || ''} ${authState.user?.lastName || ''}`.trim(),
    document: '',
    birthDate: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  const currentTrip = bookingState.currentBooking?.trip;

  useEffect(() => {
    if (!authState.user) {
      navigate('/login');
      return;
    }

    if (!currentTrip) {
      navigate('/');
      return;
    }

    // Generate mock seat layout
    const generateSeats = (): Seat[] => {
      const totalSeats = (currentTrip?.bus?.capacity as number) || 42; // Default capacity
      const availableSeats = currentTrip?.availableSeats || 0;
      const occupiedSeats = totalSeats - availableSeats;
      const seats: Seat[] = [];
      
      for (let i = 1; i <= totalSeats; i++) {
        // Randomly assign some seats as occupied for demo
        const isOccupied = i <= occupiedSeats;
        const isWindow = i % 4 === 1 || i % 4 === 0;
        
        seats.push({
          number: i,
          isAvailable: !isOccupied,
          isSelected: false,
          type: isWindow ? 'window' : 'aisle'
        });
      }
      
      return seats;
    };

    setSeats(generateSeats());
    setLoading(false);
  }, [authState.user, currentTrip, navigate]);

  const handleSeatClick = (seatNumber: number) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (!seat || !seat.isAvailable) return;

    setSeats(prevSeats => 
      prevSeats.map(s => 
        s.number === seatNumber 
          ? { ...s, isSelected: !s.isSelected }
          : s
      )
    );

    setSelectedSeats(prev => 
      prev.includes(seatNumber)
        ? prev.filter(n => n !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassengerInfo({
      ...passengerInfo,
      [e.target.name]: e.target.value
    });
  };

  const formatDocument = (value: string) => {
    // Format CPF: 000.000.000-00
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    setPassengerInfo({
      ...passengerInfo,
      document: formatted
    });
  };

  const calculateTotal = () => {
    return selectedSeats.length * (currentTrip?.price || 0);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Selecione pelo menos um assento');
      return;
    }

    if (!passengerInfo.fullName || !passengerInfo.document) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const booking = {
      tripId: tripId!,
      trip: currentTrip!,
      seatNumbers: selectedSeats,
      totalAmount: calculateTotal(),
      passengerInfo
    };

    setCurrentBooking(booking);
    navigate('/payment');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes da viagem...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Viagem não encontrada</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trip Details & Seat Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Detalhes da Viagem</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Rota</h3>
                <p className="text-lg">{currentTrip.route.originCity} → {currentTrip.route.destinationCity}</p>
                <p className="text-sm text-gray-600">{formatDate(currentTrip.departureTime)}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Horários</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-lg font-semibold">{formatTime(currentTrip.departureTime)}</p>
                    <p className="text-sm text-gray-600">Partida</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div>
                    <p className="text-lg font-semibold">{formatTime(currentTrip.arrivalTime)}</p>
                    <p className="text-sm text-gray-600">Chegada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Ônibus</h3>
              <p className="text-lg mb-2">{currentTrip.bus.model}</p>
              <div className="flex flex-wrap gap-2">
                {currentTrip.bus.amenities.map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seleção de Assentos</h2>
            
            {/* Legend */}
            <div className="flex items-center space-x-6 mb-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-600 border-2 border-primary-700 rounded"></div>
                <span>Selecionado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
                <span>Ocupado</span>
              </div>
            </div>

            {/* Bus Layout */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4 text-sm text-gray-600">🚗 Motorista</div>
              
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {seats.map((seat) => (
                  <button
                    key={seat.number}
                    onClick={() => handleSeatClick(seat.number)}
                    disabled={!seat.isAvailable}
                    className={`
                      w-8 h-8 text-xs font-semibold rounded border-2 transition-colors
                      ${seat.isSelected 
                        ? 'bg-primary-600 border-primary-700 text-white' 
                        : seat.isAvailable 
                          ? 'bg-green-200 border-green-400 text-green-800 hover:bg-green-300' 
                          : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                      }
                      ${seat.number % 4 === 3 ? 'mr-4' : ''}
                    `}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedSeats.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Assentos selecionados: {selectedSeats.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Passenger Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações do Passageiro</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={passengerInfo.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  id="document"
                  name="document"
                  value={passengerInfo.document}
                  onChange={handleDocumentChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={passengerInfo.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={passengerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo da Compra</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Rota:</span>
                <span className="font-medium">{currentTrip.route.originCity} → {currentTrip.route.destinationCity}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{formatDate(currentTrip.departureTime)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Horário:</span>
                <span className="font-medium">{formatTime(currentTrip.departureTime)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Assentos:</span>
                <span className="font-medium">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum selecionado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade:</span>
                <span className="font-medium">{selectedSeats.length} passageiro(s)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Preço unitário:</span>
                <span className="font-medium">R$ {currentTrip.price.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  R$ {calculateTotal().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                selectedSeats.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              Prosseguir para Pagamento
            </button>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Pagamento seguro com criptografia SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
