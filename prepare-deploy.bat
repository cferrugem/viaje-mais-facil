@echo off
echo 🚀 Preparando Deploy da Viaje Mais Facil...
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Inicializando Git...
    git init
    git add .
    git commit -m "Initial commit - Viaje Mais Facil"
    echo ✅ Git inicializado!
) else (
    echo 📝 Atualizando Git...
    git add .
    git commit -m "Update for deployment - %date% %time%"
    echo ✅ Git atualizado!
)

echo.
echo 🔗 Proximos passos:
echo 1. Crie um repositorio no GitHub
echo 2. Execute: git remote add origin https://github.com/SEU_USUARIO/viaje-mais-facil.git
echo 3. Execute: git push -u origin main
echo 4. Siga o DEPLOYMENT_GUIDE.md para continuar
echo.
echo 📄 Leia o arquivo DEPLOYMENT_GUIDE.md para instrucoes completas!
echo ✨ Boa sorte com o deploy!
pause
