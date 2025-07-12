# 🎨 **Logo Integration Guide - Viaje Mais Fácil**

## 📁 **Where to Place Your Logo Files**

### **1. Main Logo Location (Required)**
Place your logo file in the frontend public folder:

```
frontend/public/logo-viaje-mais-facil.png
```

**Full path**: `c:\Users\cleit\OneDrive\Área de Trabalho\onibus\frontend\public\logo-viaje-mais-facil.png`

### **2. Logo Specifications**

**Main Logo (`logo-viaje-mais-facil.png`)**
- **Size**: 400px width × 120px height (or maintain aspect ratio)
- **Format**: PNG with transparent background
- **Usage**: Main navbar, header
- **Background**: Transparent for flexibility

**Optional: White Version for Footer**
- **File**: `logo-viaje-mais-facil-white.png`
- **Same size**: 400px × 120px
- **Usage**: Footer and dark backgrounds

## 🔧 **How to Add Your Logo**

### **Step 1: Prepare Your Logo File**
1. **Save your logo** as `logo-viaje-mais-facil.png`
2. **Recommended size**: 400px wide (height will auto-adjust)
3. **Format**: PNG with transparent background
4. **Copy the file** to: `frontend/public/logo-viaje-mais-facil.png`

### **Step 2: Logo Integration is Complete! ✅**
The navbar has been updated to use your logo:

- ✅ **Main logo** will appear in the navbar
- ✅ **Fallback text** will show if logo file is missing
- ✅ **Responsive sizing** - logo adapts to screen size
- ✅ **Proper alt text** for accessibility

### **Step 3: Test Your Logo**
1. **Add your logo file** to `frontend/public/logo-viaje-mais-facil.png`
2. **Refresh the browser** - your logo should appear in the navbar
3. **Check mobile view** - logo should resize properly

## 🎯 **Logo Locations in the App**

Your logo will appear in these locations:

### **✅ Already Integrated:**
- **Navbar** (top of every page)
- **Footer** (bottom of every page)

### **🔄 Can be added to:**
- **Login/Register pages** (can add company branding)
- **Email templates** (for booking confirmations)
- **Loading screens**
- **Error pages**

## 🔧 **Customization Options**

### **Logo Size Adjustment**
If your logo appears too big/small, edit the navbar:

```tsx
// Current setting - you can adjust:
className="h-12 w-auto mr-3"  // h-12 = 48px height

// Options:
// h-8  = 32px height (smaller)
// h-10 = 40px height (default)
// h-12 = 48px height (current - larger)
// h-16 = 64px height (extra large)
```

### **Add Logo to Login/Register Pages**
You can add your logo to the authentication pages for better branding:

```tsx
// In Login.tsx and Register.tsx, add above the form:
<div className="text-center mb-6">
  <img 
    src="/logo-viaje-mais-facil.png" 
    alt="Viaje Mais Fácil" 
    className="h-16 w-auto mx-auto"
  />
</div>
```

## 📱 **PWA/App Icons (Optional)**

For a complete branding experience, you can also replace:

- **favicon.ico** (browser tab icon)
- **logo192.png** (mobile app icon)
- **logo512.png** (mobile app icon large)

Place these in the same `frontend/public/` folder.

## 🚀 **Quick Test**

1. **Place your logo** at: `frontend/public/logo-viaje-mais-facil.png`
2. **Visit**: http://localhost:3001
3. **Look for your logo** in the top-left navbar
4. **Success!** Your logo should replace "🚌 Viaje Mais Fácil"

---

**Note**: If you don't have a logo file yet, the app will show "🚌 Viaje Mais Fácil" as a fallback. Once you add the logo file, it will automatically appear!
