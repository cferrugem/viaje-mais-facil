# Como Adicionar o Logo da Viaje Mais Fácil

## Localização do Logo
Para substituir o emoji "🚌" pelo logo da empresa, você deve:

1. **Colocar o arquivo do logo** na pasta `frontend/public/` com o nome `logo-viaje-mais-facil.png`
   - Caminho completo: `c:\Users\cleit\OneDrive\Área de Trabalho\onibus\frontend\public\logo-viaje-mais-facil.png`

2. **O logo já está configurado** no componente `Navbar.tsx` para aparecer automaticamente quando você colocar o arquivo na pasta correta.

## Especificações Recomendadas do Logo
- **Formato**: PNG com fundo transparente
- **Tamanho**: 40x40 pixels (ou proporcional)
- **Qualidade**: Alta resolução para telas Retina

## Como Funciona
- Se o arquivo `logo-viaje-mais-facil.png` existir na pasta `public`, o logo será exibido
- Se o arquivo não existir, aparecerá o texto "🚌 Viaje Mais Fácil" como fallback

## Resultado
Após colocar o logo na pasta correta, ele aparecerá:
- No cabeçalho de todas as páginas
- Ao lado do nome "Viaje Mais Fácil"
- Com o slogan "Sua jornada começa aqui"

## Testando
Após colocar o logo:
1. Salve o arquivo na pasta `frontend/public/`
2. Atualize o navegador (F5)
3. O logo deve aparecer automaticamente no cabeçalho
