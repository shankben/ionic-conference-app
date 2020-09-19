import * as admin from 'firebase-admin';
import firebaseAppConfig from '../../secrets/firebase-app-config';

const data = require('./data.json');
admin.initializeApp(firebaseAppConfig);
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
