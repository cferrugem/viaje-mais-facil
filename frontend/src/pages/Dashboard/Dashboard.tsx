import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface Booking {
  id: string;
  bookingCode: string;
  trip: {
    route: {
      originCity: string;
      destinationCity: string;
    };
    departureTime: string;
    arrivalTime: string;
    bus: {
      model: string;
    };
  };
  seatNumbers: number[];
  totalAmount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

interface BookingStats {
  totalSpent: number;
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
}

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [showCancelModal, setCancelModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration - replace with actual API call
        const mockBookings: Booking[] = [
          {
            id: '1',
            bookingCode: 'BT12345678',
            trip: {
              route: {
                originCity: 'São Paulo',
                destinationCity: 'Rio de Janeiro'
              },
              departureTime: '2025-07-15T08:00:00',
              arrivalTime: '2025-07-15T14:00:00',
              bus: {
                model: 'Mercedes-Benz O500RS'
              }
            },
            seatNumbers: [12, 13],
            totalAmount: 179.80,
            status: 'CONFIRMED',
            createdAt: '2025-07-10T10:30:00'
          },
          {
            id: '2',
            bookingCode: 'BT87654321',
            trip: {
              route: {
                originCity: 'Rio de Janeiro',
                destinationCity: 'Belo Horizonte'
              },
              departureTime: '2025-07-08T15:30:00',
              arrivalTime: '2025-07-08T21:30:00',
              bus: {
                model: 'Volvo 9700'
              }
            },
            seatNumbers: [8],
            totalAmount: 95.50,
            status: 'CONFIRMED',
            createdAt: '2025-07-05T14:20:00'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          new Date(booking.trip.departureTime) > now
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.trip.departureTime) <= now
        );
      default:
        return bookings;
    }
  };

  const calculateStats = (bookings: Booking[]): BookingStats => {
    const now = new Date();
    return {
      totalSpent: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
      totalTrips: bookings.length,
      upcomingTrips: bookings.filter(b => new Date(b.trip.departureTime) > now && b.status === 'CONFIRMED').length,
      completedTrips: bookings.filter(b => new Date(b.trip.departureTime) <= now && b.status === 'CONFIRMED').length
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // In a real app, this would be an API call
      console.log('Cancelling booking:', bookingId);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' as const }
          : booking
      ));
      
      setCancelModal(null);
      alert('Reserva cancelada com sucesso!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Erro ao cancelar reserva. Tente novamente.');
    }
  };

  const exportBooking = (booking: Booking) => {
    const bookingData = {
      codigo: booking.bookingCode,
      passageiro: state.user?.firstName + ' ' + state.user?.lastName,
      origem: booking.trip.route.originCity,
      destino: booking.trip.route.destinationCity,
      data: formatDate(booking.trip.departureTime),
      horario: formatTime(booking.trip.departureTime),
      assentos: booking.seatNumbers.join(', '),
      valor: `R$ ${booking.totalAmount.toFixed(2).replace('.', ',')}`
    };
    
    const dataStr = JSON.stringify(bookingData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `reserva-${booking.bookingCode}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredBookings = filterBookings(bookings);
  const stats = calculateStats(filteredBookings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {state.user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Gerencie suas reservas e encontre novas viagens
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white p-6 rounded-lg text-center transition-colors"
        >
          <div className="text-3xl mb-2">🎫</div>
          <h3 className="text-lg font-semibold mb-1">Nova Reserva</h3>
          <p className="text-sm opacity-90">Encontre e reserve suas viagens</p>
        </Link>

        <div className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-colors cursor-pointer">
          <div className="text-3xl mb-2">📍</div>
          <h3 className="text-lg font-semibold mb-1">Rastrear Viagem</h3>
          <p className="text-sm opacity-90">Acompanhe sua viagem em tempo real</p>
        </div>

        <div className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors cursor-pointer">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="text-lg font-semibold mb-1">Suporte</h3>
          <p className="text-sm opacity-90">Central de ajuda 24/7</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              🎫
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Viagens</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              ✅
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              🚌
            </div>
            <div>
              <p className="text-sm text-gray-600">Próximas</p>
              <p className="text-2xl font-bold text-gray-900">
                {filterBookings(bookings).filter(b => 
                  new Date(b.trip.departureTime) > new Date()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gasto</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
              Minhas Reservas
            </h2>
            
            <div className="flex space-x-2">
              {[
                { key: 'upcoming', label: 'Próximas' },
                { key: 'past', label: 'Passadas' },
                { key: 'all', label: 'Todas' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando reservas...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma reserva encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' 
                  ? 'Você não tem viagens agendadas.'
                  : activeTab === 'past'
                  ? 'Você não tem viagens passadas.'
                  : 'Você ainda não fez nenhuma reserva.'
                }
              </p>
              <Link
                to="/"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md inline-block"
              >
                Fazer Primeira Reserva
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {booking.bookingCode}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Rota</h4>
                          <p className="text-sm text-gray-600">
                            {booking.trip.route.originCity} → {booking.trip.route.destinationCity}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Data & Horário</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(booking.trip.departureTime)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(booking.trip.departureTime)} - {formatTime(booking.trip.arrivalTime)}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Detalhes</h4>
                          <p className="text-sm text-gray-600">
                            Assentos: {booking.seatNumbers.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.trip.bus.model}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                      <p className="text-2xl font-bold text-primary-600 mb-2">
                        R$ {booking.totalAmount.toFixed(2).replace('.', ',')}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                          <button className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md">
                            Ver Detalhes
                          </button>
                          
                          <button 
                            onClick={() => setShowQRCode(booking.id)}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          >
                            QR Code
                          </button>
                          
                          <button 
                            onClick={() => exportBooking(booking)}
                            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                          >
                            Exportar
                          </button>
                        </div>
                        
                        {booking.status === 'CONFIRMED' && new Date(booking.trip.departureTime) > new Date() && (
                          <button 
                            onClick={() => setCancelModal(booking.id)} 
                            className="w-full px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                          >
                            Cancelar Reserva
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* QR Code Modal */}
                  {showQRCode && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            QR Code da Reserva
                          </h3>
                          <button 
                            onClick={() => setShowQRCode(null)} 
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-white p-4 rounded-lg border mb-4 flex justify-center">
                            <QRCodeSVG 
                              value={`ViajeMaisFacil:${showQRCode}`} 
                              size={200}
                              bgColor="#ffffff"
                              fgColor="#000000"
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Apresente este QR code na hora do embarque
                          </p>
                          <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                            {showQRCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Booking Modal */}
                  {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Cancelar Reserva
                            </h3>
                            <p className="text-sm text-gray-600">
                              Esta ação não pode ser desfeita.
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                          Tem certeza que deseja cancelar esta reserva? Dependendo da política de cancelamento, 
                          taxas podem ser aplicadas.
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => setCancelModal(null)} 
                            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                          >
                            Não, manter reserva
                          </button>
                          <button 
                            onClick={() => handleCancelBooking(showCancelModal)} 
                            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                          >
                            Sim, cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Informações Pessoais</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Nome:</span> {state.user?.firstName} {state.user?.lastName}</p>
              <p><span className="text-gray-600">Email:</span> {state.user?.email}</p>
              <p><span className="text-gray-600">Tipo de conta:</span> {state.user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Ações</h3>
            <div className="space-y-2">
              <button className="block w-full text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
                Editar Perfil
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
                Alterar Senha
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
                Preferências de Notificação
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                QR Code da Reserva
              </h3>
              <button 
                onClick={() => setShowQRCode(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border mb-4 flex justify-center">
                <QRCodeSVG 
                  value={`ViajeMaisFacil:${showQRCode}`} 
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Apresente este QR code na hora do embarque
              </p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                {showQRCode}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancelar Reserva
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja cancelar esta reserva? Dependendo da política de cancelamento, 
              taxas podem ser aplicadas.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setCancelModal(null)} 
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                Não, manter reserva
              </button>
              <button 
                onClick={() => handleCancelBooking(showCancelModal)} 
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
