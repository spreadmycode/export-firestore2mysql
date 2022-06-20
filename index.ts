import { getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { execQuery } from "./db";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
  measurementId: process.env.FIREBASE_measurementId,
};

const initFirebase = () => {
  let app = getApps()[0];
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { auth, db, storage };
};

const firebase = initFirebase();

const exportDatabase = async () => {
  if (!firebase) return;

  const snapshot = await getDocs(collection(firebase.db, "activity"));
  const docs = snapshot.docs;
  docs.forEach((doc, index) => {
    const data = {
      content: doc.data()?.content,
      date: doc.data()?.date,
      score: doc.data()?.score,
      userId: doc.data()?.userId,
    };
    var query = "INSERT INTO activity SET ?";
    execQuery(query, data, (error: any, res: any) => {
      if (error) {
        console.log(`Error ${index}:`, error);
        return;
      }
      console.log(`Success ${index}`);
    });
  });
};

exportDatabase();
