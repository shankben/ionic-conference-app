import firebaseAppConfig from '../../secrets/firebase-app-config';
import amplifyConfig from '../../secrets/amplify-config';

export const environment = {
  production: false,
  provider: 'firebase',
  firebase: firebaseAppConfig,
  amplify: amplifyConfig
};
