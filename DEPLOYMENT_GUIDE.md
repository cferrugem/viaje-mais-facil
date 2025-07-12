# 🚀 Guia de Deploy Gratuito - Viaje Mais Fácil

## 📋 Visão Geral
Este guia mostra como hospedar sua aplicação gratuitamente usando:
- **Frontend**: Vercel (grátis)
- **Backend**: Railway (grátis) 
- **Banco de Dados**: Supabase (já configurado)

## 🔧 Pré-requisitos
1. Conta no GitHub (para versionar o código)
2. Conta no Vercel (para frontend)
3. Conta no Railway (para backend)

---

## 📤 Passo 1: Subir o Código para o GitHub

### 1.1 Criar Repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `viaje-mais-facil`
4. Marque como "Public"
5. Clique "Create repository"

### 1.2 Subir o Código
```bash
# No terminal, dentro da pasta do projeto:
cd "c:\Users\cleit\OneDrive\Área de Trabalho\onibus"
git init
git add .
git commit -m "Initial commit - Viaje Mais Fácil"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/viaje-mais-facil.git
git push -u origin main
```

---

## 🖥️ Passo 2: Deploy do Backend (Railway)

### 2.1 Configurar Railway
1. Acesse [railway.app](https://railway.app)
2. Clique "Login" → "Login with GitHub"
3. Autorize o Railway
4. Clique "New Project"
5. Selecione "Deploy from GitHub repo"
6. Escolha seu repositório `viaje-mais-facil`
7. Selecione a pasta `backend`

### 2.2 Configurar Variáveis de Ambiente
Na aba "Variables" do Railway, adicione:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=viaje-mais-facil-super-secret-key-2025
FRONTEND_URL=https://SEU_FRONTEND.vercel.app
```

### 2.3 Deploy
- O Railway fará o deploy automaticamente
- Anote a URL do backend (algo como: `https://backend-production-xxxx.up.railway.app`)

---

## 🌐 Passo 3: Deploy do Frontend (Vercel)

### 3.1 Configurar Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique "Sign up" → "Continue with GitHub"
3. Autorize o Vercel
4. Clique "Import Project"
5. Selecione seu repositório `viaje-mais-facil`

### 3.2 Configurar Build
- **Framework Preset**: Create React App
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 3.3 Configurar Variáveis de Ambiente
Na seção "Environment Variables":
```
REACT_APP_API_URL=https://SEU_BACKEND.up.railway.app/api
```
(Substitua pela URL real do seu backend Railway)

### 3.4 Deploy
- Clique "Deploy"
- Aguarde o build finalizar
- Anote a URL do frontend (algo como: `https://viaje-mais-facil-xxxx.vercel.app`)

---

## 🔄 Passo 4: Conectar Frontend e Backend

### 4.1 Atualizar Backend com URL do Frontend
1. Volte ao Railway
2. Na aba "Variables", atualize:
   ```
   FRONTEND_URL=https://viaje-mais-facil-xxxx.vercel.app
   ```
3. O Railway fará redeploy automaticamente

### 4.2 Testar a Aplicação
1. Acesse a URL do Vercel
2. Teste o registro de usuário
3. Teste o login
4. Verifique se as funcionalidades funcionam

---

## ✅ URLs Finais para o Cliente

Após o deploy, você terá:
- **Site**: `https://viaje-mais-facil-xxxx.vercel.app`
- **API**: `https://backend-production-xxxx.up.railway.app`

---

## 🆘 Solução de Problemas

### Erro de CORS
- Certifique-se que a `FRONTEND_URL` no Railway está correta
- Redeploy o backend após alterar variáveis

### Build Error no Frontend
- Verifique se a `REACT_APP_API_URL` está correta
- Certifique-se que aponta para `/api` no final

### Banco de Dados
- O Supabase já está configurado
- Não precisa alterar as configurações do banco

---

## 📞 Próximos Passos

1. **Domínio Personalizado** (opcional): Você pode configurar um domínio próprio no Vercel
2. **Logo**: Adicione seu logo em `frontend/public/logo-viaje-mais-facil.png`
3. **Monitoramento**: Use os dashboards do Railway e Vercel para monitorar

**🎉 Parabéns! Sua aplicação "Viaje Mais Fácil" está no ar!**
