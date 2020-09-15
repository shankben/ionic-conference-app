import firebaseAppConfig from '../../secrets/firebase-app-config';
import amplifyConfig from '../../secrets/amplify-config';

export const environment = {
  production: true,
  provider: 'amplify',
  firebase: firebaseAppConfig,
  amplify: amplifyConfig
};
