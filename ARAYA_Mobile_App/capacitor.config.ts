import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arayapuntacana.mobile',
  appName: 'ARAYA Executive',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#07111f'
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;
