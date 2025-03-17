import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO6wWufvlYus3KdM6aJPDCCUaUbDOzvIM",
  authDomain: "wads-67e4f.firebaseapp.com",
  projectId: "wads-67e4f",
  storageBucket: "wads-67e4f.appspot.com",
  messagingSenderId: "1055466607579",
  appId: "1:1055466607579:web:b4e98eb5da22fb45c60dfe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/** 
 * Sign in with Google
 */
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Check if user exists in Firestore
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    // If user doesn't exist, add to Firestore
    if (docs.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        createdAt: new Date(),
      });
    }

    return { success: true, user };
  } catch (err) {
    console.error("Error signing in with Google:", err);
    return { success: false, error: err.message };
  }
};

/** 
 * Login with email and password
 */
const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (err) {
    console.error("Error logging in with email:", err);
    return { success: false, error: err.message };
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
  
      // Store user data in Firestore with UID as the document ID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        createdAt: new Date(),
      });
  
      return { success: true, user };
    } catch (err) {
      console.error("Error registering with email:", err);
      return { success: false, error: err.message };
    }
  };
  
/** 
 * Send password reset email
 */
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset link sent!" };
  } catch (err) {
    console.error("Error sending password reset:", err);
    return { success: false, error: err.message };
  }
};

/** 
 * Logout user
 */
const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
    console.error("Error signing out:", err);
    return { success: false, error: err.message };
  }
};

/** 
 * Get current user
 */
const getCurrentUser = () => {
  return auth.currentUser || null;
};

/** 
 * Get user data from Firestore
 */
const getUserData = async (uid) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: true,
        data: querySnapshot.docs[0].data(),
        id: querySnapshot.docs[0].id,
      };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (err) {
    console.error("Error getting user data:", err);
    return { success: false, error: err.message };
  }
};

// Exporting the functions and variables
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getCurrentUser,
  onAuthStateChanged,
  getUserData,
};
