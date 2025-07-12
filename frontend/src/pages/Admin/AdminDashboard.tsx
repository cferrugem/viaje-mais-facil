import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeRoutes: number;
  activeBuses: number;
  todayTrips: number;
  pendingBookings: number;
}

interface RecentBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  route: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface RevenueData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface RouteStats {
  route: string;
  bookings: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const { state } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeRoutes: 0,
    activeBuses: 0,
    todayTrips: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'routes' | 'buses'>('overview');
  const [revenueData, setRevenueData] = useState<RevenueData>({
    labels: [],
    datasets: []
  });
  const [routeStats, setRouteStats] = useState<RouteStats[]>([]);
  const [showLiveUpdates, setShowLiveUpdates] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      
      // Mock data - replace with real API calls
      const mockStats: DashboardStats = {
        totalBookings: 1247,
        totalRevenue: 89340.50,
        activeRoutes: 15,
        activeBuses: 28,
        todayTrips: 42,
        pendingBookings: 8
      };

      const mockRecentBookings: RecentBooking[] = [
        {
          id: '1',
          bookingCode: 'BT12345678',
          customerName: 'João Silva',
          route: 'São Paulo → Rio de Janeiro',
          amount: 89.90,
          status: 'CONFIRMED',
          createdAt: '2025-07-12T10:30:00'
        },
        {
          id: '2',
          bookingCode: 'BT23456789',
          customerName: 'Maria Santos',
          route: 'Belo Horizonte → Brasília',
          amount: 120.00,
          status: 'PENDING',
          createdAt: '2025-07-12T09:15:00'
        },
        {
          id: '3',
          bookingCode: 'BT34567890',
          customerName: 'Pedro Costa',
          route: 'Salvador → Recife',
          amount: 95.50,
          status: 'CONFIRMED',
          createdAt: '2025-07-12T08:45:00'
        }
      ];

      const mockRevenueData: RevenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Receita Mensal',
            data: [5000, 7000, 8000, 6000, 9000, 12000],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }
        ]
      };

      const mockRouteStats: RouteStats[] = [
        { route: 'São Paulo → Rio de Janeiro', bookings: 300, revenue: 26700 },
        { route: 'Belo Horizonte → Brasília', bookings: 200, revenue: 24000 },
        { route: 'Salvador → Recife', bookings: 150, revenue: 14325 }
      ];

      setStats(mockStats);
      setRecentBookings(mockRecentBookings);
      setRevenueData(mockRevenueData);
      setRouteStats(mockRouteStats);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CONFIRMED: { color: 'bg-green-100 text-green-800', text: 'Confirmada' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Bem-vindo, {state.user?.firstName}! Gerencie toda a operação da Viaje Mais Fácil
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Visão Geral', icon: '📊' },
            { key: 'bookings', label: 'Reservas', icon: '🎫' },
            { key: 'routes', label: 'Rotas', icon: '🗺️' },
            { key: 'buses', label: 'Frota', icon: '🚌' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">🗺️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRoutes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">🚌</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ônibus Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBuses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">📅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Viagens Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayTrips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">⏳</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reservas Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        {booking.bookingCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Receita Mensal</h2>
            </div>
            <div className="mt-4">
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Receita por Mês',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Route Stats Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Estatísticas por Rota</h2>
            </div>
            <div className="mt-4">
              <Bar
                data={{
                  labels: routeStats.map(stat => stat.route),
                  datasets: [
                    {
                      label: 'Reservas',
                      data: routeStats.map(stat => stat.bookings),
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                      borderColor: 'rgb(75, 192, 192)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Receita',
                      data: routeStats.map(stat => stat.revenue),
                      backgroundColor: 'rgba(153, 102, 255, 0.5)',
                      borderColor: 'rgb(153, 102, 255)',
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Estatísticas por Rota',
                    },
                  },
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'overview' && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">
            {activeTab === 'bookings' && '🎫'}
            {activeTab === 'routes' && '🗺️'}
            {activeTab === 'buses' && '🚌'}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'bookings' && 'Gerenciar Reservas'}
            {activeTab === 'routes' && 'Gerenciar Rotas'}
            {activeTab === 'buses' && 'Gerenciar Frota'}
          </h2>
          <p className="text-gray-600 mb-4">
            Esta seção estará disponível em breve com funcionalidades completas de gerenciamento.
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md">
            Em Desenvolvimento
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
