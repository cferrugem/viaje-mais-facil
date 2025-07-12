#!/bin/bash

echo "🚀 Preparando Deploy da Viaje Mais Fácil..."
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Inicializando Git..."
    git init
    git add .
    git commit -m "Initial commit - Viaje Mais Fácil"
    echo "✅ Git inicializado!"
else
    echo "📝 Atualizando Git..."
    git add .
    git commit -m "Update for deployment - $(date)"
    echo "✅ Git atualizado!"
fi

echo ""
echo "🔗 Próximos passos:"
echo "1. Crie um repositório no GitHub"
echo "2. Execute: git remote add origin https://github.com/SEU_USUARIO/viaje-mais-facil.git"
echo "3. Execute: git push -u origin main"
echo "4. Siga o DEPLOYMENT_GUIDE.md para continuar"
echo ""
echo "📄 Leia o arquivo DEPLOYMENT_GUIDE.md para instruções completas!"
echo "✨ Boa sorte com o deploy!"
