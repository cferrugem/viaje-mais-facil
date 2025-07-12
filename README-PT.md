# 🚌 BusTickets - Sistema de Reserva de Passagens de Ônibus

## 📖 Sobre o Projeto

O **BusTickets** é uma plataforma completa para reserva de passagens de ônibus no Brasil. Nossa aplicação oferece uma experiência moderna e intuitiva para viajantes que buscam conforto, economia e praticidade.

## ✨ Principais Recursos

- 🔍 **Busca Inteligente**: Encontre rotas e horários facilmente
- 🛡️ **Seguro e Confiável**: Todas as viagens são monitoradas para sua segurança
- 💳 **Pagamento Fácil**: Integração com sistema de pagamentos seguro
- 📱 **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- 🕒 **Suporte 24/7**: Atendimento ao cliente sempre disponível

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado

### Backend
- **Node.js** com Express
- **TypeScript** para tipagem
- **PostgreSQL** como banco de dados
- **Prisma** como ORM
- **Stripe** para processamento de pagamentos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- PostgreSQL

### Instalação

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd onibus
   ```

2. **Configure o Backend**
   ```bash
   cd backend
   npm install
   # Configure as variáveis de ambiente no arquivo .env
   npm run dev
   ```

3. **Configure o Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

## 🌍 Idioma

A aplicação foi completamente traduzida para o **Português Brasileiro**, incluindo:
- Interface do usuário
- Mensagens de erro
- Metadados HTML
- Documentação

## 📱 Funcionalidades Principais

### Para Passageiros
- ✅ Busca de passagens por origem, destino e data
- ✅ Visualização de rotas populares
- ✅ Sistema de autenticação seguro
- ✅ Painel do usuário personalizado
- 🔄 Reserva e pagamento de passagens (em desenvolvimento)
- 🔄 Histórico de viagens (em desenvolvimento)

### Para Administradores
- ✅ Painel administrativo
- 🔄 Gerenciamento de rotas (em desenvolvimento)
- 🔄 Controle de ônibus e horários (em desenvolvimento)
- 🔄 Relatórios e analytics (em desenvolvimento)

## 🎨 Design

O design da aplicação segue as melhores práticas de UX/UI, com:
- Interface limpa e moderna
- Cores inspiradas em tons de azul para transmitir confiança
- Layout responsivo para todos os dispositivos
- Elementos visuais intuitivos

## 🔐 Segurança

- Autenticação JWT
- Criptografia de senhas
- Validação de dados no frontend e backend
- Headers de segurança configurados
- Integração segura com gateway de pagamento

## 📞 Contato e Suporte

- 📞 **Telefone**: 0800-ONIBUS-1
- ✉️ **Email**: suporte@bustickets.com.br
- 🕒 **Horário**: Atendimento 24 horas, 7 dias por semana

## 🤝 Contribuição

Contribuições são bem-vindas! Se você encontrar problemas ou tiver sugestões de melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📊 Status do Projeto

🟢 **Em Desenvolvimento Ativo**

- [x] Interface básica traduzida
- [x] Sistema de autenticação
- [x] Estrutura do projeto
- [x] Configuração de segurança
- [ ] Sistema de reservas completo
- [ ] Integração de pagamentos
- [ ] Testes automatizados
- [ ] Deploy em produção

---

**© 2025 BusTickets. Todos os direitos reservados.**

*Viaje com conforto e economia para qualquer destino no Brasil!* 🇧🇷
