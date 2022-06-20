import { getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const syncSql = require("sync-sql");

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

  console.log(
    "################################ activity ################################"
  );
  const activitysnapshot = await getDocs(collection(firebase.db, "activity"));
  let activitydocs = activitysnapshot.docs;
  console.log(`Items ${activitydocs.length}`);
  activitydocs.forEach((doc) => {
    const data = {
      content: doc.data()?.content,
      date: doc.data()?.date,
      score: doc.data()?.score,
      userId: doc.data()?.userId,
    };
    var sql = `INSERT INTO activity (userId, content, score, date) VALUES('${data.userId}', '${data.content}', ${data.score}, '${data.date}')`;
    syncSql.mysql(
      {
        host: "localhost",
        user: "root",
        password: "",
        database: "meemosworld",
        port: "3306",
      },
      sql
    );
  });

  console.log(
    "################################ moodfeelings ################################"
  );
  const moodfeelingssnapshot = await getDocs(
    collection(firebase.db, "moodfeelings")
  );
  const moodfeelingsdocs = moodfeelingssnapshot.docs;
  console.log(`Items ${moodfeelingsdocs.length}`);
  moodfeelingsdocs.forEach((doc) => {
    const data = {
      lastModifiedDate: doc.data()?.lastModifiedDate,
      moodId: doc.data()?.moodId,
      point: doc.data()?.point,
      userId: doc.data()?.userId,
    };
    var sql = `INSERT INTO moodfeelings (userId, lastModifiedDate, moodId, point) VALUES('${data.userId}', '${data.lastModifiedDate}', '${data.moodId}', ${data.point})`;
    syncSql.mysql(
      {
        host: "localhost",
        user: "root",
        password: "",
        database: "meemosworld",
        port: "3306",
      },
      sql
    );
  });

  console.log(
    "################################ userHistories ################################"
  );
  const userHistoriessnapshot = await getDocs(
    collection(firebase.db, "userHistories")
  );
  const userHistoriesdocs = userHistoriessnapshot.docs;
  console.log(`Items ${userHistoriesdocs.length}`);
  userHistoriesdocs.forEach((doc) => {
    const data = {
      lastModifiedDate: doc.data()?.lastModifiedDate,
      action: doc.data()?.action,
      time: doc.data()?.time,
      userId: doc.data()?.userId,
    };
    var sql = `INSERT INTO userHistories (userId, action, time) VALUES('${data.userId}', ${data.action}, '${data.time}')`;
    syncSql.mysql(
      {
        host: "localhost",
        user: "root",
        password: "",
        database: "meemosworld",
        port: "3306",
      },
      sql
    );
  });
};

exportDatabase();
