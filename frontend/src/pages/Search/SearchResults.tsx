import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

interface Trip {
  id: string;
  route: {
    id: string;
    originCity: string;
    destinationCity: string;
    distance: number;
    estimatedDuration: number;
  };
  bus: {
    id: string;
    model: string;
    capacity: number;
    amenities: string[];
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  status: string;
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('departure');
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { setCurrentBooking } = useBooking();

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for demonstration - replace with actual API call
        const mockTrips: Trip[] = [
          {
            id: '1',
            route: {
              id: 'route-1',
              originCity: origin || 'São Paulo',
              destinationCity: destination || 'Rio de Janeiro',
              distance: 430,
              estimatedDuration: 360
            },
            bus: {
              id: 'bus-1',
              model: 'Mercedes-Benz O500RS',
              capacity: 42,
              amenities: ['Wi-Fi', 'Ar-condicionado', 'Poltronas reclináveis', 'Banheiro']
            },
            departureTime: `${date}T08:00:00`,
            arrivalTime: `${date}T14:00:00`,
            price: 89.90,
            availableSeats: 15,
            status: 'SCHEDULED'
          },
          {
            id: '2',
            route: {
              id: 'route-1',
              originCity: origin || 'São Paulo',
              destinationCity: destination || 'Rio de Janeiro',
              distance: 430,
              estimatedDuration: 360
            },
            bus: {
              id: 'bus-2',
              model: 'Volvo 9700',
              capacity: 38,
              amenities: ['Wi-Fi', 'Ar-condicionado', 'Poltronas reclináveis', 'Banheiro', 'Tomadas USB']
            },
            departureTime: `${date}T14:30:00`,
            arrivalTime: `${date}T20:30:00`,
            price: 95.50,
            availableSeats: 8,
            status: 'SCHEDULED'
          },
          {
            id: '3',
            route: {
              id: 'route-1',
              originCity: origin || 'São Paulo',
              destinationCity: destination || 'Rio de Janeiro',
              distance: 430,
              estimatedDuration: 390
            },
            bus: {
              id: 'bus-3',
              model: 'Scania Marcopolo',
              capacity: 44,
              amenities: ['Wi-Fi', 'Ar-condicionado', 'Poltronas semi-leito', 'Banheiro', 'Lanche']
            },
            departureTime: `${date}T22:00:00`,
            arrivalTime: `${date}T04:30:00`,
            price: 110.00,
            availableSeats: 22,
            status: 'SCHEDULED'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrips(mockTrips);
      } catch (err) {
        setError('Erro ao buscar viagens. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && date) {
      fetchTrips();
    } else {
      setLoading(false);
      setError('Parâmetros de busca inválidos');
    }
  }, [origin, destination, date]);

  const sortedTrips = React.useMemo(() => {
    return [...trips].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'departure':
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        case 'duration':
          return a.route.estimatedDuration - b.route.estimatedDuration;
        default:
          return 0;
      }
    });
  }, [trips, sortBy]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const handleSelectTrip = (trip: Trip) => {
    if (!authState.user) {
      navigate('/login');
      return;
    }

    const booking = {
      tripId: trip.id,
      trip: trip,
      seatNumbers: [],
      totalAmount: trip.price
    };

    setCurrentBooking(booking);
    navigate(`/booking/${trip.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando viagens disponíveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {origin} → {destination}
            </h1>
            <p className="text-gray-600">
              {new Date(date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              {trips.length} viagem(ns) encontrada(s)
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          <div className="flex space-x-2">
            {[
              { key: 'departure', label: 'Horário' },
              { key: 'price', label: 'Preço' },
              { key: 'duration', label: 'Duração' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key as any)}
                className={`px-3 py-1 text-sm rounded-md ${
                  sortBy === option.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trip Results */}
      <div className="space-y-4">
        {sortedTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Time & Route */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatTime(trip.departureTime)}
                      </div>
                      <div className="text-sm text-gray-500">{trip.route.originCity}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center">
                      <div className="w-full border-t-2 border-gray-300 relative">
                        <div className="absolute inset-x-0 -top-2 text-center">
                          <span className="bg-white px-2 text-xs text-gray-500">
                            {formatDuration(trip.route.estimatedDuration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatTime(trip.arrivalTime)}
                      </div>
                      <div className="text-sm text-gray-500">{trip.route.destinationCity}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{trip.bus.model}</p>
                    <p>{trip.bus.amenities.slice(0, 3).join(' • ')}</p>
                  </div>
                </div>

                {/* Price & Availability */}
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    R$ {trip.price.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {trip.availableSeats} assento(s) disponível(is)
                  </div>
                </div>

                {/* Select Button */}
                <div className="text-center">
                  <button
                    onClick={() => handleSelectTrip(trip)}
                    disabled={trip.availableSeats === 0}
                    className={`w-full px-6 py-3 rounded-md font-medium ${
                      trip.availableSeats === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {trip.availableSeats === 0 ? 'Esgotado' : 'Selecionar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {trips.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma viagem encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            Não encontramos viagens para esta rota na data selecionada.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
          >
            Tentar nova busca
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
