import * as admin from 'firebase-admin';

const serviceAccount = require('../../secrets/service-account-key.json');
const data = require('./data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ionic-conference-demo.firebaseio.com'
});

const db = admin.firestore();

async function main() {
  Object.keys(data).forEach(async (collection) => {
    const snapshot = await db.collection(collection).get();
    if (!snapshot.empty) {
      console.log(`Skipping ${collection}`);
      return;
    }
    data[collection].forEach(async (it) => {
      await db.collection(collection).add(it);
      console.log('Added', it);
    });
  });

}

main().catch(console.error);
