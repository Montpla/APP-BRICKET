# 🚀 Guía de Instalación - ARAYA Mobile App

## ✅ Paso 1: Instalar Node.js (REQUERIDO)

1. Ve a https://nodejs.org
2. Descarga la versión **LTS** (Recommended for most users)
3. Ejecuta el instalador (.msi)
4. Elige las opciones por defecto
5. Marca: ✅ Automatically install necessary tools
6. Completa la instalación
7. **Reinicia tu computadora**

### Verificar instalación:
Abre PowerShell y escribe:
```powershell
node --version
npm --version
```
Deberías ver números de versión.

---

## ✅ Paso 2: Preparar Capacitor

Abre PowerShell en la carpeta `ARAYA_Mobile_App`:

```powershell
# Navega a la carpeta
cd "C:\Users\Usuario1\iCloudDrive\Proyecto Araya\Finanzas ARAYA\ARAYA_Mobile_App"

# Instala las dependencias
npm install

# Compila la app web
npm run build

# Sincroniza con Capacitor
npm run cap:sync
```

Espera a que se complete (puede tomar 5-10 minutos la primera vez).

---

## 📱 Paso 3: Android

### Opción A: Emulador (en tu PC)

1. **Instala Android Studio**
   - Descarga desde https://developer.android.com/studio
   - Ejecuta el instalador
   - Durante la instalación, marca: ✅ Android Virtual Device

2. **Crea un emulador virtual**
   - Abre Android Studio
   - Clic en "Device Manager"
   - Clic en "Create Virtual Device"
   - Elige Pixel 6, Android 14
   - Completa la configuración

3. **Prepara la app**
   ```powershell
   npm run cap:add:android
   npm run cap:open:android
   ```

4. **Compila y ejecuta**
   - En Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Espera a que se complete
   - El APK estará en: `android\app\build\outputs\apk\debug\app-debug.apk`

### Opción B: Dispositivo físico Android

1. Habilita "Modo de desarrollador"
   - Ve a Ajustes > Acerca de
   - Toca "Número de compilación" 7 veces
   - Vuelve a Ajustes > Opciones de desarrollador
   - Activa "Depuración USB"

2. Conecta tu teléfono por USB a tu PC

3. En PowerShell:
   ```powershell
   npm run cap:add:android
   npm run cap:open:android
   ```

4. En Android Studio:
   - Selecciona tu teléfono en el dropdown
   - Clic en Run (botón ▶️ verde)

---

## 🍎 Paso 4: iOS (Solo en Mac)

1. **Requisitos en Mac**
   - Instala Xcode desde App Store
   - Instala CocoaPods:
     ```bash
     sudo gem install cocoapods
     ```

2. **Prepara la app**
   ```bash
   npm run cap:add:ios
   npm run cap:open:ios
   ```

3. **En Xcode**
   - Abre el proyecto `App.xcworkspace` (no App.xcodeproj)
   - Selecciona el esquema "App"
   - Selecciona tu dispositivo o simulador
   - Clic en Run (▶️)

---

## 🌐 Publicar en Tiendas

### Google Play Store (Android)

1. Crea una cuenta: https://play.google.com/console
2. Paga la tarifa de registro ($25 USD)
3. Sigue los pasos en el README.md sección "Publicar en Google Play Store"

### App Store (iOS)

1. Crea una cuenta: https://developer.apple.com
2. Paga la tarifa anual ($99 USD)
3. Sigue los pasos en el README.md sección "Publicar en App Store"

---

## 🔄 Actualizar la App

Cada vez que cambies el código:

```powershell
npm run build
npm run cap:sync
```

Luego:
- **Android**: Rebuild en Android Studio (Build > Rebuild Project)
- **iOS**: Rebuild en Xcode (Product > Clean Build Folder, luego Run)

---

## ⚙️ Conectar a tu API

Si tienes una API con datos reales:

1. Edita `src/main.ts`
2. Reemplaza los datos estáticos con llamadas fetch:

```typescript
async function loadData() {
  const response = await fetch('https://tu-api.com/data');
  const data = await response.json();
  updateCharts(data);
}

// Llamar cuando carga la app
window.addEventListener('load', () => {
  SplashScreen.hide();
  loadData();
  initializeCharts();
});
```

3. Rebuild: `npm run build && npm run cap:sync`

---

## 📞 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| "npm not found" | Reinstala Node.js y reinicia |
| Android Studio no abre | Instala Java JDK 17+ |
| Xcode error de provisioning | Añade Apple ID en Xcode > Preferences |
| App se ve pequeña en móvil | Los estilos ya son responsive, limpia caché del navegador |
| Datos no actualizan | Implementa fetch() a tu API |

---

## ✨ Siguiente: Personalización

Una vez tengas la app corriendo:

1. **Cambiar colores**: Edita las variables CSS en `src/index.html` (línea ~43)
2. **Agregar gráficos**: Usa Chart.js (ya incluido)
3. **Conectar datos reales**: Implementa fetch() a tu base de datos
4. **Agregar páginas**: Duplica el HTML y crea navegación

---

**¿Listo? ¡Comienza con el Paso 1 instalando Node.js!** 🎉
