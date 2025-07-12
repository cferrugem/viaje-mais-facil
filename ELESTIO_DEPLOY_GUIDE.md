# 🚀 Deploy Backend no Elestio - Viaje Mais Fácil

## 📋 Visão Geral
Elestio oferece hosting com créditos gratuitos e é uma excelente alternativa ao Railway.

**Vantagens do Elestio:**
- ✅ $10 em créditos grátis (suficiente para 1-2 meses)
- ✅ Deploy automático via Git
- ✅ Suporte completo ao Docker
- ✅ SSL automático
- ✅ Interface simples

---

## 🔧 Pré-requisitos
1. ✅ Conta no GitHub (seu código já está lá)
2. 🆕 Conta no Elestio (criar em [elest.io](https://elest.io))

---

## 📤 Passo 1: Preparar e Subir o Código

### 1.1 Commit das Mudanças Recentes
```bash
cd "c:\Users\cleit\OneDrive\Área de Trabalho\onibus"
git add .
git commit -m "Add Dockerfile and deployment configs for Elestio"
git push origin main
```

### 1.2 Verificar Estrutura do Projeto
Seu projeto já tem:
- ✅ `backend/Dockerfile` - Container Docker otimizado
- ✅ `backend/.dockerignore` - Arquivos ignorados no build
- ✅ `backend/package.json` - Scripts de build e start
- ✅ Health check endpoint em `/health`

---

## 🚀 Passo 2: Deploy no Elestio

### 2.1 Criar Conta no Elestio
1. **Acesse**: [elest.io](https://elest.io)
2. **Clique**: "Get Started" ou "Sign Up"
3. **Use GitHub**: Para login rápido e automático
4. **Verifique email**: Se solicitado
5. **Confirme créditos**: Você receberá $10 grátis

### 2.2 Criar Novo Serviço
1. **No dashboard**: Clique "Create Service"
2. **Escolha**: "CI/CD" ou "Custom Docker"
3. **Conecte GitHub**: Autorize o acesso aos seus repositórios
4. **Selecione repo**: `cferrugem/viaje-mais-facil`

### 2.3 Configurar o Serviço
**Configurações básicas:**
- **Service Name**: `viaje-mais-facil-backend`
- **Git Branch**: `main`
- **Root Directory**: `backend`
- **Dockerfile**: `Dockerfile` (já detectado automaticamente)
- **Port**: `5000`

**Configurações avançadas:**
- **Health Check**: `/health`
- **Build Context**: `backend/`
- **Auto Deploy**: ✅ Ativado (deploy automático no push)

### 2.4 Configurar Variáveis de Ambiente
**⚠️ IMPORTANTE**: Na seção "Environment Variables", adicione TODAS essas variáveis:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=viaje-mais-facil-super-secret-key-2025
FRONTEND_URL=https://viaje-mais-facil.vercel.app
```

### 2.5 Iniciar Deploy
1. **Clique**: "Deploy Service"
2. **Aguarde**: Build automático (5-15 minutos)
3. **Monitore**: Logs na aba "Logs" em tempo real
4. **Anote URL**: Será algo como `https://viaje-mais-facil-backend-xxxx.elest.io`

### 2.6 Verificar Deploy
**Sinais de sucesso:**
- ✅ Status: "Running"
- ✅ Health check: Verde
- ✅ Logs mostram: "Server running on port 5000"
- ✅ URL responde no navegador

---

## 🔧 Passo 3: Atualizar Frontend (Vercel)

### 3.1 Obter URL do Backend
Após deploy no Elestio, você terá uma URL como:
```
https://viaje-mais-facil-backend-xxxx.elest.io
```

### 3.2 Atualizar Vercel
1. **Acesse**: [vercel.com](https://vercel.com) e faça login
2. **Encontre**: Projeto "viaje-mais-facil"
3. **Vá em**: Settings → Environment Variables
4. **Edite**: `REACT_APP_API_URL`
5. **Novo valor**:
   ```
   https://viaje-mais-facil-backend-xxxx.elest.io/api
   ```
   ⚠️ **Importante**: Não esqueça do `/api` no final!

### 3.3 Fazer Redeploy
1. **Vá em**: Deployments
2. **Clique**: Nos 3 pontinhos da última versão
3. **Selecione**: "Redeploy"
4. **Aguarde**: Build terminar (2-5 minutos)

---

## 🧪 Passo 4: Testar Tudo

### 4.1 Testar API Diretamente
```bash
# Teste de saúde
curl https://viaje-mais-facil-backend-xxxx.elest.io/health

# Resposta esperada:
{
  "status": "OK",
  "message": "Bus Ticket API is running"
}
```

### 4.2 Testar Registro de Usuário
```bash
curl -X POST https://viaje-mais-facil-backend-xxxx.elest.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@elestio.com",
    "password": "123456",
    "firstName": "Teste",
    "lastName": "Elestio",
    "phoneNumber": "11999999999"
  }'
```

### 4.3 Testar Frontend Completo
1. **Acesse**: Sua URL do Vercel
2. **Teste registro**: Crie uma conta nova
3. **Teste login**: Entre com a conta criada
4. **Teste busca**: Pesquise passagens
5. **Verifique**: Console do navegador (F12) para erros

---

## 💰 Custos e Duração

### Plano Gratuito Elestio:
- **$10 em créditos grátis** 💰
- **Custo estimado**: ~$5-8/mês para aplicação pequena
- **Duração**: 1-2 meses grátis
- **Inclui**: SSL, custom domain, backups

### Após créditos:
- **Plano básico**: $5-15/mês
- **Ainda acessível**: Para projetos comerciais
- **Escalabilidade**: Fácil upgrade quando necessário

---

## 🧪 Passo 4: Testar

### 4.1 Verificar Saúde da API
```bash
curl https://viaje-mais-facil-backend-xxxx.elest.io/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "Bus Ticket API is running",
  "timestamp": "2025-07-12T..."
}
```

### 4.2 Testar Registro
```bash
curl -X POST https://viaje-mais-facil-backend-xxxx.elest.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@elestio.com",
    "password": "123456",
    "firstName": "Teste",
    "lastName": "Elestio",
    "phoneNumber": "11999999999"
  }'
```

---

## 💰 Custos e Limites

### Plano Gratuito Elestio:
- **$10 em créditos grátis**
- **~1GB RAM**: $0.01/hora = $7.20/mês
- **Créditos duram**: ~1 mês e meio
- **SSL**: Incluído
- **Custom domain**: Incluído

### Renovação:
- Plano básico: $7-15/mês
- Ainda muito acessível para produção

---

## 🔧 Troubleshooting

### Build Falha
```bash
# Logs detalhados no Elestio dashboard
# Verificar se Dockerfile está correto
# Certificar que todas as dependências estão no package.json
```

### Health Check Falha
```bash
# Verificar se porta 5000 está exposta
# Confirmar que /health endpoint existe
# Checar logs de inicialização
```

### Conexão com Frontend
```bash
# Verificar CORS no backend
# Confirmar FRONTEND_URL no backend
# Testar REACT_APP_API_URL no frontend
```

---

## 📞 Próximos Passos
1. ✅ Deploy concluído no Elestio
2. ✅ Frontend atualizado
3. ✅ Aplicação funcionando
4. 🎉 **Enviar URL para o cliente!**

**URL Final:** `https://viaje-mais-facil.vercel.app`
**API:** `https://viaje-mais-facil-backend-xxxx.elest.io`
