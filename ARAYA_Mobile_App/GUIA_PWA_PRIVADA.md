# 📱 PWA Privada - ARAYA Dashboard

Tu app como **Progressive Web App (PWA)** privada. Los usuarios simplemente abren un link en Safari/Chrome y la instalan como app nativa.

---

## ¿Qué es una PWA?

Una **Progressive Web App** es una app web que:

✅ Se instala como app nativa (iOS, Android, Desktop)  
✅ Funciona offline  
✅ Actualizaciones automáticas  
✅ No necesita App Store  
✅ Un link, muchos usuarios  
✅ Dinámico - cambias el código en el servidor  

**Usuario ve:**
```
Abre link → Safari/Chrome → "Agregar a pantalla de inicio" → App nativa
```

---

## 🚀 Paso 1: Instalar Node.js (Si no lo hiciste)

1. Ve a https://nodejs.org
2. Descarga **LTS**
3. Ejecuta el instalador
4. REINICIA tu PC

Verifica:
```powershell
node --version
npm --version
```

---

## 🚀 Paso 2: Instalar Dependencias

```powershell
cd "C:\Users\Usuario1\iCloudDrive\Proyecto Araya\Finanzas ARAYA\ARAYA_Mobile_App"
npm install
```

---

## 🚀 Paso 3: Probar Localmente

```powershell
npm run dev
```

Abre en tu navegador:
```
http://localhost:3000
```

¿Ves el dashboard? ¡Perfecto!

---

## 🚀 Paso 4: Compilar para Producción

```powershell
npm run build
```

Esto crea una carpeta `dist/` lista para publicar.

---

## 🚀 Paso 5: Elegir Servidor (Opciones Gratuitas)

### **Opción A: Vercel (Recomendado - Muy fácil)**

1. Ve a https://vercel.com
2. Sign up (puedes usar GitHub)
3. Click "Import Git Repository"
4. Conecta tu repo de GitHub (o copia los archivos)
5. Deploy automático
6. Tu app en: `https://tu-proyecto.vercel.app`

**Ventajas:**
- ✅ Gratis
- ✅ Deploy automático con `git push`
- ✅ Dominio incluido
- ✅ SSL automático
- ✅ Muy rápido

---

### **Opción B: Netlify**

1. Ve a https://netlify.com
2. Sign up
3. "New site from Git"
4. Conecta GitHub
5. Build command: `npm run build`
6. Publish directory: `dist`

**Ventajas:**
- ✅ Gratis
- ✅ Deploy automático
- ✅ CMS incluido

---

### **Opción C: Firebase Hosting (Google)**

```powershell
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Configurar:
# - Public directory: dist
# - Single-page app: Yes
# - Rewrite rules: Yes

# Deploy
firebase deploy
```

**Ventajas:**
- ✅ Gratis
- ✅ 10GB almacenamiento
- ✅ Integrado con Google

---

### **Opción D: Tu Propio Servidor**

Si tienes hosting propio:

```powershell
# Compilar
npm run build

# Copiar contenido de dist/ a tu servidor web
# (FTP, SSH, cPanel, lo que uses)

# Tu app en: https://tu-dominio.com
```

---

## 📤 Deploy en Vercel (Opción más fácil)

### Método 1: Desde GitHub

```powershell
# 1. Sube tu código a GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/araya-pwa.git
git push -u origin main

# 2. Ve a https://vercel.com
# 3. "Import Git Repository"
# 4. Selecciona tu repo
# 5. Click "Deploy"
# ¡Listo! Tu app está en: https://araya-pwa.vercel.app
```

### Método 2: Drag and Drop

```powershell
# 1. npm run build
# 2. Ve a https://vercel.com/new
# 3. Arrastra la carpeta dist/
# 4. ¡Publicada!
```

---

## 🔗 Compartir con Usuarios

Una vez publicado, simplemente comparte el link:

```
https://tu-proyecto.vercel.app
```

**Usuario abre en iOS:**
```
1. Abre el link en Safari
2. Toca el botón compartir (↗️)
3. "Agregar a pantalla de inicio"
4. Tapa "Agregar"
5. ¡App instalada! 🎉
```

**Usuario abre en Android:**
```
1. Abre el link en Chrome
2. Toca el menú (⋮)
3. "Instalar app"
4. "Instalar"
5. ¡App instalada! 🎉
```

---

## 🔄 Actualizar la App

Cambias el código y se actualiza automáticamente para todos:

```powershell
# 1. Edita src/main.ts o src/index.html
# 2. npm run build
# 3. git push (si usas GitHub)
# 4. Vercel auto-deploya
# 5. Todos ven los cambios al actualizar
```

---

## 📡 Conectar tu API

En `src/main.ts`, reemplaza los datos estáticos:

```typescript
async function loadDashboard() {
  try {
    const response = await fetch('https://tu-api.com/dashboard');
    const data = await response.json();
    
    // Actualizar UI con datos reales
    updateDashboard(data);
    initializeCharts(data);
  } catch (error) {
    console.log('Sin conexión, usando datos offline');
  }
}

// Llamar al cargar
window.addEventListener('load', loadDashboard);
```

---

## 🔐 Control de Acceso (Privada)

### Opción 1: Contraseña Simple

En `src/index.html`, antes de `<div id="app">`:

```html
<div id="login-screen">
  <div style="padding: 40px; text-align: center;">
    <h2>ARAYA Executive</h2>
    <input type="password" id="pwd" placeholder="Contraseña" 
           style="width: 100%; padding: 12px;">
    <button onclick="checkPassword()" style="width: 100%; padding: 12px; margin-top: 10px;">
      Ingresar
    </button>
  </div>
</div>
```

En `src/main.ts`:

```typescript
function checkPassword() {
  const pwd = (document.getElementById('pwd') as HTMLInputElement).value;
  
  if (pwd === 'tu-contraseña-aqui') {
    localStorage.setItem('authenticated', 'true');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  } else {
    alert('Contraseña incorrecta');
  }
}

// Verificar al cargar
window.addEventListener('load', () => {
  if (!localStorage.getItem('authenticated')) {
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
  }
});
```

### Opción 2: Restricción por Red

Si quieres que solo funcione en una red (oficina):
- Hosting en servidor privado
- VPN requerida
- Token de acceso

---

## 📊 Monitorear Uso

En Vercel:
- Dashboard con analytics
- Performance metrics
- Error logs
- Traffic stats

---

## 🔄 Actualizaciones Automáticas

El service worker actualiza automáticamente cuando:
- El usuario abre la app
- Hay nueva versión en el servidor

O fuerza actualización:
```typescript
// En src/main.ts
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  window.location.reload();
});
```

---

## ⚙️ Personalización

### Cambiar nombre de la app
En `public/manifest.json`:
```json
"name": "Tu Nombre de App",
"short_name": "Tu App"
```

### Cambiar colores
En `src/index.html`:
```css
:root {
  --bg: #07111f;    /* Color fondo */
  --blue: #4aa3ff;  /* Color azul */
}
```

### Cambiar icono
Reemplaza `public/icon.png` con tu logo

---

## 📞 Troubleshooting

| Problema | Solución |
|----------|----------|
| App no se instala en iOS | Safari → Compartir → Agregar pantalla inicio |
| Cambios no se ven | Limpiar caché o reabrir app |
| Service Worker error | Verifica que `/src/service-worker.js` existe |
| API no responde | Revisa CORS en tu servidor |

---

## 🎯 Checklist Rápido

```
✅ npm install
✅ npm run dev (prueba local)
✅ npm run build
✅ Crear cuenta Vercel/Netlify
✅ Deploy
✅ Compartir link con usuarios
✅ Usuarios instalan desde navegador
✅ ¡Publicada! 🎉
```

---

## 📱 Comparación: PWA vs App Store

| Aspecto | PWA | App Store |
|--------|-----|----------|
| Compilación | No | Sí (complejo) |
| Publicación | 1 minuto | 1-3 días |
| Actualizaciones | Automáticas | Manual |
| Costo | $0 | $99/año |
| Usuarios privados | ✅ Sí | ❌ Complicado |
| Acceso offline | ✅ Sí | ✅ Sí |
| Performance | ✅ Bueno | ✅ Mejor |

---

## 🚀 ¡Listo!

Tu PWA está lista. Ahora:

1. `npm run dev` para probar
2. `npm run build` para compilar
3. Deploy a Vercel/Netlify
4. Comparte el link
5. Usuarios instalan como app nativa

**Sin App Store. Sin compilación. Solo un link.**

---

**Siguiente: Abre PowerShell y ejecuta:**
```powershell
npm install
npm run dev
```

¡Verás tu app en `http://localhost:3000`! 🎉
