// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// إعدادات مشروعك كما هي
const firebaseConfig = {
  apiKey: "AIzaSyAr3RcKdWc8-GPnYEW1-XaNsZa0iQObnUQ",
  authDomain: "faleh-4134f.firebaseapp.com",
  projectId: "faleh-4134f",
  storageBucket: "faleh-4134f.firebasestorage.app",
  messagingSenderId: "220252443520",
  appId: "1:220252443520:web:6266f99fa2da2cd1b66765"
};

// تهيئة Firebase مرة واحدة فقط
const app = initializeApp(firebaseConfig);

// تصدير Auth لاستخدامه في Onboarding.tsx
export const auth = getAuth(app);