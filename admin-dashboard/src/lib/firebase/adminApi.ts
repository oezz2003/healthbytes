import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Admin config
const adminConfig = {
  "type": "service_account",
  "project_id": "application-63412",
  "private_key_id": "fb62d80209b7e6de31258b7bd1dacb6c65d38c42",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsE3fBwOqz35ZD\nYyfkelCGRFfpfw7EkN4TMFCuZ5Z2QPO4lTigFYbsCE+sosqePUzj+tUr2GSo99p7\nLuo5ziRz7ya0yjt1huF36s0O/o28h3mFMchaZZyADq3X39IweMontjI5WbZOvITh\n/6k2DAMoTnPrtOt0VueZMjJyCFvu/hHSHlDijjQnELeNNBnD+P/oX6P87YdXYkbL\nbI12USTxnZRxzXHp5l6l08QSs8/sXUxH5vnGq7nRadOrbTd71CBNoBGxRTjlEoRZ\nbtSSUaz8te7hSFBpHta6qGdkalKbL01qwjDjuUMwnwElWs4McXVKvMvzi3zW6Js+\nm1XmqMrBAgMBAAECgf8e0sug6Vtqk+uf3WxH7sWibAlTXG8kNIXcV8tAlwSBTtgQ\nXPOjJxNxxp2jmBfX92w8RbIy30cotBiTZfiO9IK3r2g/jIyHyg8rkHYGXiUFe9FI\nwX2P2FqeA3DXXxvZ3BJaL0jP2Is9Rj6HYbI2/DkCSHkNmzZI6dqSlo/gb57jngqn\nYonI5Hzo1czHeG259XZPMD9AZ3rc8h+x32BHuzwx10K/0wZitud6ZMqwfbaZJ6d8\nGXj1Hp4dfKLkiAH1oWw4OBAOCvSSJ82xFnYO+a+hVWNwYsR67udVw5dGtSGTa5vK\ndWbwjjALDQLAf0jWu6DG6vc4DcK2cxsD9uj24A0CgYEA5Xi+CpwuzI3tMmR/DwNn\nT2rR83yV83DQWqA7lNDAr4qvvqd302wOJAXoyqxHWigDhbrMs90ivXwDKCsKQaxn\nf7CsxEamabhChUFK29VT1mBL14K9QNYffae3Qtgb2zsR/1AtWn5FQW0AOLVyTUh5\nwu8qwK/+XzyRmBcszDXlcnsCgYEAv/gXbTQEj8f7q/9SlgPKDrG/OAN8KruFPFSu\nlOcoTFgmTugqOAlEqsu2bV9DIlPXK3Qo3esDx/t/L10ogDq3DekeYwPzScFT4zyi\nuB8KbfJvkdw295l0CJ+QQqD4dDLEjLm1QW52fG3AxlkihHjniG7adV3CqaxOdP5e\nNMEdYPMCgYB3Hipoj5KrlLEgi5J5VKb4TtcVsgKVEGbX5H2JTqP3e+Km8X/+PAVL\nJdYl/zA62LKbZNCGPbCe9BUfcNguJzTC0A+fA523G3NMgQw++Yo/qlU0ViWv1nca\nX0l+ZXhwYUWCZzhj1VBWGiMXTPk8rPan/kcPJ0zAW0yoyr7ycrfcqQKBgQCx0vrA\nacMf/TwgY275D6GIYxaiqHfIjdQpwrfFryshLTavOViCd/Nn0zS1s9zYW5mh4wRI\nLX9fLJTwJvdxcPJIrH09c1dWJwOyJ2UD8Z0To9O95aP1T+ywYD6ducbsvGpdgVlp\ntw2CzZgZJFBZLjYrp6QtvCCqU7aJoWdartisCQKBgQDYpe3Ac7CWWtTt+BnLwpl5\nTUC96dsBkLr+fkSR8GSwNTmANxgrKl+98WvePBBUxpM1dxicnRbwh6hOXUvY7PcI\nMqN/R7uG2BC8XpC9URpRDLAVTjHhVVTJhPh4V/S4rOJI6zb+woWKSAmvTs3y+ewK\n29xutpqPp4ZmX22rncHiWg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@application-63412.iam.gserviceaccount.com",
  "client_id": "101005578403126557075",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40application-63412.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};


// Initialize Firebase Admin
const apps = getApps();
let firebaseAdmin;

if (!apps.length) {
  try {
    firebaseAdmin = initializeApp({
      credential: cert(adminConfig as any),
      storageBucket: "application-63412.appspot.com",
    });
    console.log("✅ Firebase Admin initialized.");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error);
    throw error; // Re-throw to ensure the app fails to start if Firebase can't initialize
  }
}

// Export services
const db = getFirestore();
const storage = getStorage();

export { firebaseAdmin, db, storage };
