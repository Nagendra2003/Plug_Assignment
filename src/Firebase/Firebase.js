import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBy-A15tRVjUYgoVu3HaqtXDQRWtgn4jyA",
  authDomain: "reactproject-d70dc.firebaseapp.com",
  databaseURL: "https://reactproject-d70dc-default-rtdb.firebaseio.com",
  projectId: "reactproject-d70dc",
  storageBucket: "reactproject-d70dc.appspot.com",
  messagingSenderId: "243868807212",
  appId: "1:243868807212:web:24131fdef8d12da824a189",
  measurementId: "G-YLTQX41GT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth};