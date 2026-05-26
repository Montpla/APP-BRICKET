# 📱 Guía Completa: EAS Build para iOS

## ¿Qué es EAS Build?

**EAS Build** es un servicio de Expo que **compila tu app en la nube**. No necesitas Mac, ni Xcode, ni complicaciones. Solo necesitas:
- Windows/Mac/Linux
- Node.js instalado
- Cuenta de Expo (gratis)

---

## 🚀 Paso 1: Instalar Expo CLI

```powershell
npm install -g eas-cli expo-cli
```

Verifica que se instaló:
```powershell
eas --version
expo --version
```

---

## 🚀 Paso 2: Crear Cuenta de Expo

1. Ve a https://expo.dev
2. Haz clic en "Sign Up"
3. Completa el registro con:
   - Email
   - Contraseña
   - Username

**Guarda tu username - lo necesitarás después.**

---

## 🚀 Paso 3: Instalar Dependencias del Proyecto

```powershell
cd "C:\Users\Usuario1\iCloudDrive\Proyecto Araya\Finanzas ARAYA\ARAYA_Mobile_App"
npm install
```

---

## 🚀 Paso 4: Iniciar Proyecto en Expo

```powershell
# Desde la carpeta del proyecto:
npx expo init --template
```

O si quieres hacerlo manual:

```powershell
# Login en Expo desde la terminal
eas login

# Verifica que estás logueado
eas whoami
```

---

## 🚀 Paso 5: Crear Certificados para iOS

```powershell
# Genera automáticamente los certificados necesarios
eas build --platform ios --latest

# Esto:
# 1. Crea credenciales iOS automáticamente
# 2. Genera el .ipa (archivo de la app)
# 3. Lo almacena en tu cuenta de Expo
```

Cuando te pregunte:
```
✓ Use new push notification key? → Yes
✓ Reuse push notification key? → Yes
✓ Generate new iOS Distribution Certificate? → Yes
✓ Reuse iOS Distribution Certificate? → Yes
```

---

## 📦 Opción A: Compilación para Distribuir (App Store)

```powershell
npm run eas:build:ios
```

O:

```powershell
eas build --platform ios --profile production
```

**Esto genera un `.ipa` listo para publicar en App Store.**

Tiempo: 10-20 minutos

---

## 📦 Opción B: Compilación para Probar (Tu dispositivo)

```powershell
npm run eas:build:ios:preview
```

**Esto genera un archivo que puedes instalar en tu iPhone para probar.**

Tiempo: 10-15 minutos

---

## 📱 Instalar la app de prueba en tu iPhone

Después de compilar con `--profile preview`:

1. Ve a tu cuenta de Expo: https://expo.dev
2. Abre tu proyecto
3. Busca el build más reciente
4. Haz clic en "Install"
5. Se abrirá un QR
6. Con tu iPhone, abre la cámara
7. Escanea el QR
8. Sigue los pasos para instalar

---

## 🚀 Publicar en App Store

### Requisitos:
- Cuenta de Apple Developer ($99 USD/año)
- Certificado de distribución iOS (se crea automáticamente)
- Bundle ID único (ya configurado: `com.arayapuntacana.mobile`)

### Paso 1: Configurar credenciales en eas.json

Edita `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "tu-email@apple.com",
        "appleTeamId": "XXXXXXXXXX",
        "bundleIdentifier": "com.arayapuntacana.mobile"
      }
    }
  }
}
```

**¿Dónde encontrar tu Apple Team ID?**
1. Ve a https://developer.apple.com/account
2. Login con tu cuenta Apple Developer
3. Clic en "Membership"
4. Busca "Team ID" (es como: XXXXXXXXXX)

### Paso 2: Compilar la app

```powershell
eas build --platform ios --profile production
```

Espera a que termine (20 minutos aprox)

### Paso 3: Enviar a App Store

```powershell
npm run eas:submit:ios
```

O:

```powershell
eas submit --platform ios --latest
```

Te pedirá:
- Email de Apple Developer
- Contraseña (usa contraseña de aplicación, no tu contraseña regular)

---

## 🔐 Crear Contraseña de Aplicación (Apple)

1. Ve a https://appleid.apple.com
2. Login
3. Clic en "Security"
4. Bajo "App-Specific Passwords" → "Generate"
5. Selecciona:
   - App: "Other"
   - Device: "Windows (or Mac)"
6. Copia la contraseña generada (16 caracteres)
7. Usa esto en lugar de tu contraseña normal

---

## 📋 Flujo Completo (Paso a Paso)

```powershell
# 1. Instalar dependencias
npm install

# 2. Login en Expo
eas login

# 3. Compilar para iOS (producción)
eas build --platform ios --profile production

# 4. Esperar a que termine (10-20 minutos)
# → Puedes ver el progreso en: https://expo.dev

# 5. Una vez compilado, enviar a App Store
eas submit --platform ios --latest

# 6. Seguir los pasos de Submit (Apple ID, contraseña de app)

# 7. ¡Listo! App Store lo revisa (1-3 días típicamente)
```

---

## 📊 Monitorear Compilaciones

Ve a tu cuenta de Expo en https://expo.dev y verás:
- ✅ Estado en tiempo real
- ✅ Logs de compilación
- ✅ Descargar el .ipa
- ✅ Instalar en tu teléfono

---

## ⚠️ Solucionar Problemas

### Error: "eas not found"
```powershell
npm install -g eas-cli
```

### Error: "Not logged in"
```powershell
eas login
eas whoami  # Verifica que estés logueado
```

### Error: "Bundle ID already exists"
Cambia el bundle ID en `app.json`:
```json
"bundleIdentifier": "com.arayapuntacana.mobile.v2"
```

### Error: "Apple ID required"
Asegúrate de haber configurado credenciales en `eas.json`

### La app se ve rota
Actualiza tu código y vuelve a compilar:
```powershell
npm run build
eas build --platform ios --profile production
```

---

## 🔄 Actualizar la App

Cada vez que cambies código:

```powershell
# 1. Edita src/main.ts o src/index.html
# 2. Compila nuevamente:
eas build --platform ios --profile production

# 3. Espera a que termine
# 4. Envía a App Store:
eas submit --platform ios --latest
```

Apple la revisa y sube la actualización.

---

## 💰 Costos

| Servicio | Costo |
|----------|-------|
| EAS Build (free tier) | **Gratis** (pero limitado) |
| EAS Build (sin límites) | $99/mes |
| Apple Developer Account | $99/año |
| App Store | Gratis publicar |

**Recomendación:** Usa free tier mientras desarrollas, luego suscríbete si necesitas compilaciones rápidas.

---

## 📱 Versionar tu App

Antes de cada actualización, actualiza:

En `app.json`:
```json
{
  "version": "1.0.1",
  "ios": {
    "buildNumber": "2"
  }
}
```

En `eas.json`:
```json
{
  "version": "1.0.1"
}
```

---

## 🎯 Próximos Pasos

1. ✅ Instala eas-cli y expo-cli
2. ✅ Crea cuenta de Expo
3. ✅ Crea cuenta de Apple Developer
4. ✅ Ejecuta: `eas build --platform ios --profile production`
5. ✅ Espera compilación
6. ✅ Ejecuta: `eas submit --platform ios --latest`
7. ✅ ¡Publicado en App Store!

---

## 📞 Recursos

- [Documentación EAS Build](https://docs.expo.dev/build/introduction/)
- [Apple Developer](https://developer.apple.com)
- [Expo Dashboard](https://expo.dev)

---

**Tiempo total: 30-60 minutos (primera vez incluye creación de certificados)**

¿Listo para compilar? 🚀
