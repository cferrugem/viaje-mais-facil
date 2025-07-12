# 🎨 **Logo Integration Guide - Viaje Mais Fácil**

## 📁 **Where to Place Your Logo Files**

### **1. Main Logo Locations (Required)**
Place your logo files in the frontend public folder:

```
frontend/public/
├── logo-viaje-mais-facil.png          (Main logo - colored version)
├── logo-viaje-mais-facil-white.png    (White version for dark backgrounds)
├── favicon.ico                        (Browser tab icon - 32x32px)
├── logo192.png                        (PWA icon - 192x192px)
└── logo512.png                        (PWA icon - 512x512px)
```

### **2. Logo Specifications**

**Main Logo (`logo-viaje-mais-facil.png`)**
- **Size**: 200px width × 60px height (or maintain aspect ratio)
- **Format**: PNG with transparent background
- **Usage**: Main navbar, forms, general pages
- **Background**: Transparent for flexibility

**White Logo (`logo-viaje-mais-facil-white.png`)**
- **Size**: 200px width × 60px height 
- **Format**: PNG with transparent background
- **Usage**: Footer, dark backgrounds
- **Color**: White/light colored

**Favicon (`favicon.ico`)**
- **Size**: 32×32px, 16×16px (multi-size ICO file)
- **Usage**: Browser tab icon
- **Tip**: Use a simplified version of your logo

**PWA Icons (`logo192.png`, `logo512.png`)**
- **Sizes**: 192×192px and 512×512px
- **Format**: PNG
- **Usage**: Mobile app icons when installed as PWA
- **Background**: Should NOT be transparent (use white/brand background)

## 🔧 **How to Add Your Logo**

### **Step 1: Prepare Your Logo Files**
1. **Export your logo** in the required sizes and formats
2. **Name them exactly** as specified above
3. **Copy them** to `frontend/public/` folder

### **Step 2: Logo is Already Integrated! ✅**
The code has been updated to automatically use your logo files:

**Navbar (Main Logo):**
```tsx
// File: frontend/src/components/Layout/Navbar.tsx
<img 
  src="/logo-viaje-mais-facil.png" 
  alt="Viaje Mais Fácil" 
  className="h-10 w-auto mr-3"
/>
```

**Footer (White Logo):**
```tsx
// File: frontend/src/components/Layout/Footer.tsx
<img 
  src="/logo-viaje-mais-facil-white.png" 
  alt="Viaje Mais Fácil" 
  className="h-8 w-auto mr-3"
/>
```

### **Step 3: Verify Integration**
1. **Add your logo files** to the public folder
2. **Restart the application**: `npm run dev`
3. **Check the navbar** - your logo should appear
4. **Check the footer** - white version should appear
5. **Check browser tab** - favicon should appear

## 🎯 **Customization Options**

### **Logo Size Adjustments**
If your logo appears too big/small, adjust the CSS classes:

**Navbar Logo Size:**
```tsx
className="h-10 w-auto mr-3"  // h-10 = 40px height
// Options: h-8 (32px), h-12 (48px), h-16 (64px)
```

**Footer Logo Size:**
```tsx
className="h-8 w-auto mr-3"   // h-8 = 32px height
// Options: h-6 (24px), h-10 (40px), h-12 (48px)
```

### **Additional Logo Locations**
You can add your logo to other pages by following the same pattern:

**Login/Register Pages:**
```tsx
<img 
  src="/logo-viaje-mais-facil.png" 
  alt="Viaje Mais Fácil" 
  className="h-12 w-auto mx-auto mb-4"
/>
```

**Email Templates/Documents:**
```tsx
<img 
  src="/logo-viaje-mais-facil.png" 
  alt="Viaje Mais Fácil" 
  className="h-16 w-auto"
/>
```

## 💡 **Logo Design Tips**

### **For Best Results:**
1. **Vector Format**: Start with SVG/AI for scalability
2. **Simple Design**: Works well at small sizes (favicon)
3. **High Contrast**: Readable on different backgrounds
4. **Horizontal Layout**: Works better in navbar
5. **Square Version**: For social media/app icons

### **Color Variants Needed:**
- **Full Color**: Main brand colors
- **White/Light**: For dark backgrounds
- **Black/Dark**: For light backgrounds (optional)
- **Monochrome**: Single color version (optional)

## 🚀 **Implementation Status**

### ✅ **Completed:**
- [x] Navbar logo integration with fallback
- [x] Footer logo integration with fallback  
- [x] Favicon reference in HTML
- [x] PWA manifest icons
- [x] Brand name updated throughout app
- [x] QR codes updated with new brand name
- [x] Meta tags updated

### 📋 **To Do (Add Your Files):**
- [ ] Add `logo-viaje-mais-facil.png` to `frontend/public/`
- [ ] Add `logo-viaje-mais-facil-white.png` to `frontend/public/`
- [ ] Replace `favicon.ico` in `frontend/public/`
- [ ] Replace `logo192.png` in `frontend/public/`
- [ ] Replace `logo512.png` in `frontend/public/`

## 🔍 **Testing Your Logo**

### **Browser Testing:**
1. **Desktop**: Check navbar and footer on large screens
2. **Mobile**: Verify logo scales properly on small screens  
3. **Dark Mode**: Ensure white logo shows in footer
4. **Favicon**: Check browser tab icon
5. **PWA**: Test installation and app icon

### **Performance Check:**
- Keep logo files under 100KB each
- Use PNG for photos, SVG for simple graphics
- Test loading speed with logo files

## 📞 **Need Help?**

If you need assistance with:
- **Logo file preparation**
- **Size adjustments** 
- **Additional placements**
- **Custom styling**

The logo integration system is ready - just add your files and they'll appear automatically! 🎉
