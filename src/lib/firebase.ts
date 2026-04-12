import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

// ── TODO: Replace with your Firebase Config from Firebase Console ───────────────
// Project Settings → Your Apps → Firebase SDK configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const logInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const logOut = () => signOut(auth)

export const onAuthChange = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback)

// Re-export User type for convenience
export type { User } from 'firebase/auth'
