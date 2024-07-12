import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'fightcore',
  webDir: 'build',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '633866961609-2sounkc4dc0ror0j65571alse4269vms.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
