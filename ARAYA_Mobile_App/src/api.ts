// API Service para conectar a tus datos reales

interface DashboardData {
  totalIncome: number;
  activeProjects: number;
  operationalExpenses: number;
  pendingItems: number;
  monthlyTrend: number[];
  incomeData: number[];
  expenseData: number[];
  distributionLabels: string[];
  distributionData: number[];
  transactions: Transaction[];
}

interface Transaction {
  date: string;
  concept: string;
  amount: number;
}

// Configuración
const API_BASE_URL = process.env.VITE_API_URL || 'https://tu-api.com';

// Obtener datos del dashboard
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Retorna datos de fallback
    return getDefaultData();
  }
}

// Obtener transacciones
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

// Datos por defecto (para cuando no hay conexión)
function getDefaultData(): DashboardData {
  return {
    totalIncome: 2400000,
    activeProjects: 24,
    operationalExpenses: 890000,
    pendingItems: 12,
    monthlyTrend: [1800, 1920, 2100, 2400, 2300, 2400],
    incomeData: [1800, 1920, 2100, 2400, 2300, 2400],
    expenseData: [800, 850, 900, 950, 890, 920],
    distributionLabels: ['Ventas', 'Servicios', 'Inversiones'],
    distributionData: [300, 150, 100],
    transactions: [
      { date: '2026-05-25', concept: 'Pago Proveedores', amount: -125000 },
      { date: '2026-05-24', concept: 'Ingresos Ventas', amount: 450000 },
      { date: '2026-05-23', concept: 'Gastos Administración', amount: -75000 }
    ]
  };
}

// Guardar datos en almacenamiento local (para modo offline)
export async function saveDataLocally(data: DashboardData): Promise<void> {
  try {
    localStorage.setItem('dashboardData', JSON.stringify(data));
    localStorage.setItem('lastSyncTime', new Date().toISOString());
  } catch (error) {
    console.error('Error saving data locally:', error);
  }
}

// Obtener datos del almacenamiento local
export function getLocalData(): DashboardData | null {
  try {
    const data = localStorage.getItem('dashboardData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading local data:', error);
    return null;
  }
}

// Obtener última sincronización
export function getLastSyncTime(): Date | null {
  const time = localStorage.getItem('lastSyncTime');
  return time ? new Date(time) : null;
}

// Sincronizar datos (obtener de API y guardar localmente)
export async function syncData(): Promise<DashboardData> {
  try {
    const data = await fetchDashboardData();
    await saveDataLocally(data);
    return data;
  } catch (error) {
    // Si falla, usar datos locales
    const localData = getLocalData();
    return localData || getDefaultData();
  }
}
