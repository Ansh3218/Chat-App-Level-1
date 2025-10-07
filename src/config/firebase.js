import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyAvf3ASpFjVT405UExVwjV_UJaQ86ASE9U",
  authDomain: "chat-app-ca-16e88.firebaseapp.com",
  projectId: "chat-app-ca-16e88",
  storageBucket: "chat-app-ca-16e88.firebasestorage.app",
  messagingSenderId: "1074504165295",
  appId: "1:1074504165295:web:e7a8df48737084a805715a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const defaultAvatar = "https://i.ibb.co/2n4pJjK/default-avatar.png";

    // Create user document
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: defaultAvatar,
      bio: "Hey, There I am using chat app",
      lastSeen: Date.now(),
    });

    // Create chats document
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });

    // ✅ Only after Firestore doc is created, navigate
    toast.success("Signup successful!");
    return user.uid; // ye return karo taki login flow use kar sake
  } catch (error) {
    toast.error(
      error?.code?.split("/")[1]?.split("-").join(" ") || "Signup failed"
    );
    console.error(error);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPassword = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return null;
  }

  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q); // ✅ getDocs instead of getDoc

    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset Email Sent");
    } else {
      toast.error("Email doesn't exist");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

export { signup, login, logout, resetPassword, auth, db };
