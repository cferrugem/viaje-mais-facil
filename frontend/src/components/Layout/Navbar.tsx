import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Company Logo */}
              <img 
                src="/logo192.png" 
                alt="Viaje Mais Fácil" 
                className="h-16 w-auto mr-3"
                onError={(e) => {
                  // Fallback to text and logo icon if image not found
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallbackDiv = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallbackDiv) {
                    fallbackDiv.classList.remove('hidden');
                  }
                }}
              />
              <div className="hidden items-center" id="fallback-logo">
                <div className="flex items-center">
                  <div className="bg-primary-600 text-white rounded-lg p-2 mr-3">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-primary-600">Viaje Mais Fácil</span>
                    <span className="text-xs text-gray-500">Sua jornada começa aqui</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {state.user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Painel
                </Link>
                {state.user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Administração
                  </Link>
                )}
                <span className="text-gray-700 text-sm">
                  Olá, {state.user.firstName}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
