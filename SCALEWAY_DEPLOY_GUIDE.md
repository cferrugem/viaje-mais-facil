# 🚀 Deploy Backend no Scaleway - Viaje Mais Fácil

## 📋 Visão Geral
Scaleway oferece containers serverless gratuitos - perfeito para sua aplicação!

**Vantagens do Scaleway:**
- ✅ 1 milhão de requests grátis/mês
- ✅ 400,000 GB-s de compute grátis
- ✅ Deploy automático via Git
- ✅ Scaling automático
- ✅ Sem cobrança por tempo ocioso

---

## 🔧 Pré-requisitos
1. Conta no GitHub (seu código já está lá)
2. Conta no Scaleway (criar em [scaleway.com](https://www.scaleway.com))

---

## 📤 Passo 1: Preparar Dockerfile para Scaleway

### 1.1 Criar Dockerfile Otimizado para Scaleway
Vamos criar um Dockerfile específico para Scaleway:

```dockerfile
# Scaleway optimized Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for layer caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (Scaleway uses PORT env var)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### 1.2 Atualizar package.json para Scaleway
Vamos verificar se o script start está correto:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "postbuild": "npm run db:generate"
  }
}
```

---

## 🚀 Passo 2: Deploy no Scaleway

### 2.1 Criar Conta
1. Acesse [console.scaleway.com](https://console.scaleway.com)
2. Crie uma conta gratuita
3. Verifique o email
4. Complete o perfil

### 2.2 Criar Container
1. No console, vá para "Serverless" → "Containers"
2. Clique "Create container"
3. Preencha:
   - **Name**: `viaje-mais-facil-backend`
   - **Region**: `Paris (fr-par)` ou `Amsterdam (nl-ams)`
   - **Registry**: `Public Docker Hub Registry`

### 2.3 Configurar Deploy Automático
1. **Deploy method**: `Git repository`
2. **Git URL**: `https://github.com/cferrugem/viaje-mais-facil`
3. **Branch**: `main`
4. **Root path**: `backend`
5. **Dockerfile path**: `Dockerfile`

### 2.4 Configurar Runtime
1. **vCPU**: `0.1 vCPU` (gratuito)
2. **RAM**: `128 MB` (gratuito)
3. **Min instances**: `0` (economia)
4. **Max instances**: `5`
5. **Port**: `5000`
6. **Protocol**: `HTTP1`

### 2.5 Configurar Variáveis de Ambiente
Na seção "Environment Variables":

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.czmpgdlheiwicauclhbx:CCYsrzcaRQFSAubw@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=viaje-mais-facil-super-secret-key-2025
FRONTEND_URL=https://viaje-mais-facil.vercel.app
```

### 2.6 Deploy
1. Clique "Create container"
2. Aguarde o deploy (5-10 minutos)
3. Anote a URL gerada (ex: `https://viaje-mais-facil-backend-xxxx.containers.scw.cloud`)

---

## 🔧 Passo 3: Configurar Frontend

### 3.1 Atualizar Vercel
1. Acesse dashboard do Vercel
2. Vá em "Settings" → "Environment Variables"
3. Atualize `REACT_APP_API_URL`:
   ```
   REACT_APP_API_URL=https://viaje-mais-facil-backend-xxxx.containers.scw.cloud/api
   ```
4. Redeploy o frontend

---

## 🧪 Passo 4: Testar

### 4.1 Verificar Saúde da API
```bash
curl https://viaje-mais-facil-backend-xxxx.containers.scw.cloud/health
```

### 4.2 Testar Registro
```bash
curl -X POST https://viaje-mais-facil-backend-xxxx.containers.scw.cloud/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@scaleway.com",
    "password": "123456",
    "firstName": "Teste",
    "lastName": "Scaleway",
    "phoneNumber": "11999999999"
  }'
```

---

## 🔄 Alternativa: Scaleway Serverless Functions

### Se Container não funcionar, use Functions:

1. **Serverless** → **Functions**
2. **Runtime**: `node20`
3. **Handler**: `dist/index.handler`
4. **Memory**: `128 MB`
5. **Timeout**: `30s`

### Adaptar código para Functions:
```typescript
// Adicionar ao final do backend/src/index.ts
export const handler = app; // Para Scaleway Functions
```

---

## 💰 Custos e Limites

### Plano Gratuito Scaleway:
- **1,000,000 requests/mês**: Grátis
- **400,000 GB-s compute/mês**: Grátis
- **Tráfego**: Primeiros 75 GB grátis
- **SSL**: Incluído
- **Auto-scaling**: Incluído

### Cálculo para sua aplicação:
- **API requests típicos**: ~10,000/mês
- **Uso de compute**: ~50,000 GB-s/mês
- **Custo mensal**: **R$ 0,00** (dentro do free tier)

---

## 🎯 Comparação: Elestio vs Scaleway

| Característica | Elestio | Scaleway |
|----------------|---------|----------|
| **Custo inicial** | $10 créditos | Completamente grátis |
| **Limite mensal** | ~$7/mês após créditos | 1M requests grátis |
| **Complexidade** | Simples | Média |
| **Scaling** | Manual | Automático |
| **Cold starts** | Não | Sim (serverless) |
| **Persistência** | 24/7 | Sob demanda |

---

## 🏆 Recomendação

### Para Produção Imediata: **Elestio**
- Deploy mais simples
- Sempre ativo (sem cold starts)
- Melhor para demonstrações

### Para Longo Prazo: **Scaleway**
- Completamente gratuito
- Scaling automático
- Ideal para crescimento

---

## 🔧 Troubleshooting Scaleway

### Cold Start Lento
```bash
# Configurar health check mais agressivo
# Ou manter 1 instância mínima ativa
```

### Build Timeout
```bash
# Otimizar Dockerfile
# Usar multi-stage build se necessário
```

### Memória Insuficiente
```bash
# Aumentar para 256MB se necessário
# Otimizar dependências do Prisma
```

---

## 📞 Qual Escolher?

**Escolha Elestio se:**
- ✅ Quer simplicidade máxima
- ✅ Precisa de deploy hoje
- ✅ Tem orçamento de ~$7/mês

**Escolha Scaleway se:**
- ✅ Quer solução 100% gratuita
- ✅ Pode lidar com cold starts
- ✅ Planeja crescimento futuro
