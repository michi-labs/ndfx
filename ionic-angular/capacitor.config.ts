import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-in-app-browser',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['https://*'],
  },
};

export default config;
