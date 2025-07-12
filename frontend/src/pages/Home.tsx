import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchData);
    navigate(`/search?${queryParams.toString()}`);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Viaje Mais Fácil
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100">
              Reserve suas passagens de ônibus com conforto e economia para qualquer destino no Brasil
            </p>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                    Origem
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={searchData.origin}
                    onChange={handleInputChange}
                    placeholder="Cidade de origem"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={searchData.destination}
                    onChange={handleInputChange}
                    placeholder="Cidade de destino"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleInputChange}
                    min={minDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                  >
                    Buscar Ônibus
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que Escolher a Viaje Mais Fácil?
            </h2>
            <p className="text-lg text-gray-600">
              Experimente o melhor em viagem de ônibus com nossos serviços premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
              <p className="text-gray-600">
                Sua segurança é nossa prioridade. Todos os ônibus são mantidos regularmente e motoristas são experientes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reserva Fácil</h3>
              <p className="text-gray-600">
                Reserve suas passagens em apenas alguns cliques com nossa interface amigável e pagamento seguro.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-gray-600">
                Obtenha ajuda sempre que precisar com nossa equipe de atendimento ao cliente 24 horas por dia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rotas Populares
            </h2>
            <p className="text-lg text-gray-600">
              Descubra nossos destinos mais procurados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">São Paulo ↔ Rio de Janeiro</h3>
                <p className="text-gray-600 mb-4">A partir de R$ 89</p>
                <p className="text-sm text-gray-500">6 horas de viagem</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Belo Horizonte ↔ Brasília</h3>
                <p className="text-gray-600 mb-4">A partir de R$ 120</p>
                <p className="text-sm text-gray-500">8 horas de viagem</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Salvador ↔ Recife</h3>
                <p className="text-gray-600 mb-4">A partir de R$ 95</p>
                <p className="text-sm text-gray-500">7 horas de viagem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
