# ✅ Checklist de Deploy - Viaje Mais Fácil

## Antes do Deploy
- [ ] ✅ Código funcionando localmente
- [ ] ✅ Backend rodando (porta 5000)
- [ ] ✅ Frontend rodando (porta 3001)
- [ ] ✅ Banco Supabase configurado
- [ ] ✅ Registro de usuários funcionando
- [ ] ✅ Branding "Viaje Mais Fácil" aplicado

## GitHub Setup
- [ ] Criar conta no GitHub (se não tiver)
- [ ] Criar repositório `viaje-mais-facil`
- [ ] Executar `prepare-deploy.bat` ou comandos git manualmente
- [ ] Fazer push do código

## Deploy Backend (Railway)
- [ ] Criar conta no Railway
- [ ] Conectar com GitHub
- [ ] Importar repositório
- [ ] Selecionar pasta `backend`
- [ ] Configurar variáveis de ambiente:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `DATABASE_URL` (copiar do .env atual)
  - [ ] `DIRECT_URL` (copiar do .env atual)
  - [ ] `JWT_SECRET=viaje-mais-facil-super-secret-key-2025`
  - [ ] `FRONTEND_URL` (será adicionado depois)
- [ ] Aguardar deploy
- [ ] Anotar URL do backend

## Deploy Frontend (Vercel)
- [ ] Criar conta no Vercel
- [ ] Conectar com GitHub
- [ ] Importar repositório
- [ ] Configurar:
  - [ ] Framework: Create React App
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Configurar variável:
  - [ ] `REACT_APP_API_URL=https://SEU_BACKEND/api`
- [ ] Fazer deploy
- [ ] Anotar URL do frontend

## Conectar Frontend e Backend
- [ ] Voltar ao Railway
- [ ] Atualizar `FRONTEND_URL` com URL do Vercel
- [ ] Aguardar redeploy automático

## Testes Finais
- [ ] Abrir site no Vercel
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Verificar branding
- [ ] Testar navegação

## Para o Cliente
- [ ] Enviar URL do site
- [ ] Explicar funcionalidades
- [ ] Fornecer credenciais de teste (se necessário)

## URLs de Referência
- **GitHub**: https://github.com
- **Railway**: https://railway.app
- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com

## Dicas
- 💡 Guarde as URLs finais
- 💡 Os serviços gratuitos podem dormir após inatividade
- 💡 Primeiro acesso pode ser lento
- 💡 Logs estão disponíveis nos dashboards
- 💡 Redesploy automático a cada push no GitHub

## Suporte
Se algo der errado:
1. Verifique os logs no Railway/Vercel
2. Confirme as variáveis de ambiente
3. Teste as URLs individualmente
4. Redesploy se necessário
