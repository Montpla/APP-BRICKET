# 📚 Ejemplos de Integración - ARAYA Mobile App

## 1️⃣ Conectar a una API REST

### En `src/main.ts`, reemplaza `initializeCharts()` con:

```typescript
async function loadDashboard() {
  try {
    // Obtener datos de tu API
    const response = await fetch('https://tu-api.com/api/dashboard');
    const data = await response.json();

    // Actualizar valores en la UI
    document.querySelector('.blue .value').textContent = 
      formatCurrency(data.totalIncome);
    document.querySelector('.green .value').textContent = 
      data.activeProjects;
    document.querySelector('.amber .value').textContent = 
      formatCurrency(data.operationalExpenses);
    document.querySelector('.red .value').textContent = 
      data.pendingItems;

    // Inicializar gráficos con datos reales
    initializeCharts(data);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function formatCurrency(value: number): string {
  return '$' + (value / 1000000).toFixed(1) + 'M';
}
```

---

## 2️⃣ Guardar Datos Localmente (Offline)

### Usa el `src/api.ts` incluido:

```typescript
import { syncData, getLocalData } from './api';

// Al iniciar la app
window.addEventListener('load', async () => {
  SplashScreen.hide();
  
  // Intentar sincronizar con servidor
  const data = await syncData();
  
  // Los datos se guardan automáticamente
  updateUI(data);
  initializeCharts(data);
});

// Si pierdes conexión, se usa los datos guardados
function updateUI(data) {
  // Tu lógica aquí
}
```

---

## 3️⃣ Actualizar Datos Periódicamente

```typescript
// Sincronizar cada 5 minutos
setInterval(async () => {
  const data = await syncData();
  updateUI(data);
}, 5 * 60 * 1000);

// O cuando el usuario abre la app desde background
App.addListener('appStateChange', async ({ isActive }) => {
  if (isActive) {
    const data = await syncData();
    updateUI(data);
  }
});
```

---

## 4️⃣ Agregar Notificaciones Push

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

// Solicitar permiso
LocalNotifications.requestPermissions();

// Enviar notificación local
LocalNotifications.schedule({
  notifications: [
    {
      title: 'Alerta ARAYA',
      body: 'Nuevo pago recibido: $50,000',
      id: 1,
      schedule: { at: new Date(Date.now() + 1000 * 5) } // En 5 segundos
    }
  ]
});
```

---

## 5️⃣ Acceder a Datos del Dispositivo

```typescript
import { Storage } from '@capacitor/storage';

// Guardar datos
await Storage.set({
  key: 'user-preferences',
  value: JSON.stringify({ theme: 'dark', language: 'es' })
});

// Obtener datos
const { value } = await Storage.get({ key: 'user-preferences' });
const prefs = JSON.parse(value);
```

---

## 6️⃣ Integración con Base de Datos en Tiempo Real (Firebase)

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'tu-proyecto.firebaseapp.com',
  databaseURL: 'https://tu-proyecto.firebaseio.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.appspot.com',
  messagingSenderId: 'TU_ID',
  appId: 'TU_APP_ID'
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Escuchar cambios en tiempo real
const dbRef = ref(database, 'dashboard');
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  updateUI(data);
  initializeCharts(data);
});
```

---

## 7️⃣ Actualizar Gráficos Dinámicamente

```typescript
function initializeCharts(data) {
  const ctx1 = document.getElementById('incomeChart') as HTMLCanvasElement;
  
  const chart = new (window as any).Chart(ctx1, {
    type: 'line',
    data: {
      labels: data.months, // ['Ene', 'Feb', 'Mar', ...]
      datasets: [
        {
          label: 'Ingresos',
          data: data.incomeValues, // [1800, 1920, 2100, ...]
          borderColor: '#4aa3ff',
          backgroundColor: 'rgba(74, 163, 255, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#aeb8c7' } } }
    }
  });

  return chart;
}

// Actualizar gráfico cuando hay nuevos datos
function updateChart(chart, newData) {
  chart.data.labels = newData.months;
  chart.data.datasets[0].data = newData.incomeValues;
  chart.update();
}
```

---

## 8️⃣ Agregar Página de Login

En `src/index.html`, antes del `<div id="app">`, añade:

```html
<div id="login-screen" style="display: none;">
  <div style="padding: 40px; text-align: center;">
    <h2>ARAYA Executive</h2>
    <input type="email" id="email" placeholder="Email" style="width: 100%; padding: 12px; margin: 10px 0;">
    <input type="password" id="password" placeholder="Contraseña" style="width: 100%; padding: 12px; margin: 10px 0;">
    <button onclick="handleLogin()" style="width: 100%; padding: 12px; cursor: pointer;">Ingresar</button>
  </div>
</div>
```

En `src/main.ts`:

```typescript
async function handleLogin() {
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  try {
    const response = await fetch('https://tu-api.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const { token } = await response.json();
    
    // Guardar token
    localStorage.setItem('auth-token', token);
    
    // Mostrar dashboard
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    // Cargar datos
    loadDashboard();
  } catch (error) {
    alert('Error al iniciar sesión');
  }
}

// Verificar si está autenticado
window.addEventListener('load', () => {
  const token = localStorage.getItem('auth-token');
  
  if (!token) {
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  } else {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadDashboard();
  }
});
```

---

## 9️⃣ Personalizar Colores

En `src/index.html`, busca:

```css
:root {
  --bg: #07111f;        /* Fondo oscuro */
  --text: #f7f3ea;      /* Texto claro */
  --blue: #4aa3ff;      /* Color azul */
  --green: #25d39b;     /* Color verde */
  --amber: #f0b35a;     /* Color naranja */
  --red: #ff6b6b;       /* Color rojo */
}
```

Cambia los valores hex a tus colores preferidos.

---

## 🔟 Agregar Descarga de Reportes

```typescript
function downloadReport() {
  const data = {
    fecha: new Date().toISOString(),
    ingresos: 2400000,
    gastos: 890000,
    ganancias: 2400000 - 890000
  };

  const csvContent = `Fecha,Concepto,Monto\n${Object.entries(data)
    .map(([key, value]) => `${new Date().toLocaleDateString()},${key},${value}`)
    .join('\n')}`;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte-araya.csv';
  a.click();
}
```

---

## 📞 Necesitas Ayuda?

1. Consulta `README.md` para referencias técnicas
2. Consulta `SETUP.md` para instalación paso a paso
3. Usa `src/api.ts` como template para tus conexiones
4. Los comentarios en el código explican cada función

---

**¡Estos ejemplos te permiten crear una app completamente operativa en minutos!**
