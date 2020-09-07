import firebaseAppConfig from '../../secrets/firebase-app-config';

export const environment = {
  production: true,
  provider: 'firebase',
  firebase: firebaseAppConfig
};
