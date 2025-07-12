import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              {/* Footer Logo */}
              <img 
                src="/logo-viaje-mais-facil-white.png" 
                alt="Viaje Mais Fácil" 
                className="h-8 w-auto mr-3"
                onError={(e) => {
                  // Fallback to text if image not found
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                }}
              />
              <h3 className="text-lg font-semibold hidden">🚌 Viaje Mais Fácil</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Seu parceiro confiável para viagens de ônibus confortáveis e econômicas.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Comprar Passagens</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Rastrear Ônibus</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Cancelar/Alterar</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Ajuda</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Atendimento ao Cliente</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Perguntas Frequentes</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Termos & Condições</button></li>
              <li><button type="button" className="text-gray-300 hover:text-white text-left">Política de Privacidade</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 0800-ONIBUS-1</p>
              <p>✉️ suporte@viajemaisfacil.com.br</p>
              <p>🕒 Atendimento 24/7</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Viaje Mais Fácil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
