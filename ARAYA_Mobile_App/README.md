# ARAYA Mobile App - Capacitor

App móvil nativa para iOS y Android basada en el dashboard ARAYA usando Capacitor.

## 📋 Requisitos Previos

### Instalación de Node.js
1. Descarga Node.js LTS desde https://nodejs.org
2. Ejecuta el instalador y completa la instalación
3. Verifica la instalación:
   ```bash
   node --version
   npm --version
   ```

### Requisitos por Plataforma

**Para Android:**
- Android Studio instalado
- JDK 17 o superior
- Android SDK API 31+
- Emulador Android o dispositivo físico

**Para iOS (Mac):**
- Xcode instalado
- iOS Deployment Target: 14.0 o superior
- CocoaPods (`sudo gem install cocoapods`)

## 🚀 Instalación Rápida

### 1. Instalar dependencias
```bash
cd ARAYA_Mobile_App
npm install
```

### 2. Compilar la app
```bash
npm run build
```

### 3. Sincronizar con Capacitor
```bash
npm run cap:sync
```

## 📱 Deployment a Plataformas

### Android

#### Primera vez:
```bash
npm run cap:add:android
```

#### Abrir en Android Studio:
```bash
npm run cap:open:android
```

En Android Studio:
1. Selecciona `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Espera a que se complete
3. Ve a `Build > Generate Signed Bundle / APK...` para generar un APK firmado
4. Crea/usa una keystore
5. Descarga el APK firmado

#### Publicar en Google Play Store:
1. Crea una cuenta de desarrollador Google Play ($25 USD)
2. Sube el APK a Google Play Console
3. Completa la información de la app (descripción, screenshots, etc.)
4. Sometalo a revisión

### iOS

#### Primera vez:
```bash
npm run cap:add:ios
```

#### Abrir en Xcode:
```bash
npm run cap:open:ios
```

En Xcode:
1. Selecciona el esquema `App`
2. Ve a `Product > Scheme > Edit Scheme`
3. Configura Build Configuration a `Release`
4. Selecciona `Product > Archive`
5. En Organizer, haz clic en `Distribute App`

#### Publicar en App Store:
1. Crea una cuenta de desarrollador Apple ($99 USD/año)
2. Completa los formularios de información de la app
3. Sube el build a TestFlight primero (testing)
4. Luego submítelo a App Store Review
5. Apple revisa (típicamente 1-3 días)

## 🛠️ Desarrollo

### Modo desarrollo web:
```bash
npm run dev
```
Accede a http://localhost:3000

### Actualizar app móvil durante desarrollo:
```bash
npm run build
npm run cap:sync
```

## 📁 Estructura del Proyecto

```
ARAYA_Mobile_App/
├── src/
│   ├── index.html       # Página principal
│   └── main.ts          # Lógica de la app
├── public/
│   └── manifest.json    # Configuración PWA
├── www/                 # Build output (generado)
├── android/             # Código Android (generado)
├── ios/                 # Código iOS (generado)
├── capacitor.config.ts  # Config de Capacitor
├── package.json         # Dependencias
└── README.md            # Este archivo
```

## 🔧 Configuración

### Cambiar ID de app:
Edita `capacitor.config.ts`:
```typescript
appId: 'com.arayapuntacana.mobile'
```

### Cambiar nombre de app:
```typescript
appName: 'ARAYA Executive'
```

## 📝 Notas Importantes

- **Certificados iOS**: Necesitas configurar provisioning profiles en Apple Developer
- **Signing Key Android**: Crea una keystore segura y guárdala
- **Versiones**: Incrementa versionCode en Android y version en iOS antes de cada release
- **Datos**: La app actualmente es un dashboard estático. Para datos dinámicos, conecta a una API

## 🆘 Troubleshooting

### "npm not found"
- Reinstala Node.js asegurándote que se agregó al PATH

### Android Studio no reconoce JDK
- En Android Studio > File > Project Structure > SDK Location
- Verifica que Java SDK Path sea correcto

### Error de provisioning profile en iOS
- Ve a Xcode > Preferences > Accounts
- Añade tu Apple ID y descarga los perfiles

## 📧 Soporte

Para actualizar datos o funcionalidades:
1. Modifica `src/main.ts` (lógica)
2. Modifica `src/index.html` (UI)
3. Ejecuta `npm run build && npm run cap:sync`
4. Rebuild en Android Studio / Xcode

---

**Versión**: 1.0.0  
**Última actualización**: 2026-05-25
