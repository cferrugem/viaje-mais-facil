#!/bin/bash

echo "🔧 Fixing TypeScript Module Resolution Issues..."

# Clear TypeScript cache
echo "📁 Clearing TypeScript cache..."
rm -rf node_modules/.cache
rm -rf frontend/node_modules/.cache  
rm -rf backend/node_modules/.cache

# Clear build artifacts
echo "🗑️ Clearing build artifacts..."
rm -rf frontend/build
rm -rf backend/dist

# Regenerate type declarations
echo "⚙️ Regenerating TypeScript declarations..."
cd backend && npm run build
cd ../frontend && npm run build

echo "✅ TypeScript issues should now be resolved!"
echo "💡 If issues persist, restart VS Code completely."
