import firebaseAppConfig from '../../secrets/firebase-app-config';
import amplifyConfig from '../../secrets/amplify-config';

export const environment = {
  production: false,
  provider: 'amplify',
  firebase: firebaseAppConfig,
  amplify: amplifyConfig
};
