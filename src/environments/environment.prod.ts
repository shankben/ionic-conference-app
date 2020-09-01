import apiKey from '../../secrets/google-api-key';

export const environment = {
  production: true,
  provider: 'firebase',
  firebase: {
    apiKey,
    authDomain: 'ionic-conference-demo.firebaseapp.com',
    databaseURL: 'https://ionic-conference-demo.firebaseio.com',
    projectId: 'ionic-conference-demo',
    storageBucket: 'ionic-conference-demo.appspot.com',
    messagingSenderId: '953187498755',
    appId: '1:953187498755:web:e58f2602c8b30ec152c736'
  }
};
