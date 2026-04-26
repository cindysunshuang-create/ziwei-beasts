import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA4GLwzSozSQCdJAI1VshUv0GSSetrs8eg",
  authDomain: "easternmystical.firebaseapp.com",
  projectId: "easternmystical",
  storageBucket: "easternmystical.firebasestorage.app",
  messagingSenderId: "314538813564",
  appId: "1:314538813564:web:cb23be959f7d2e102a41f9",
  measurementId: "G-R2TGJGB9EP"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const appleProvider = new OAuthProvider('apple.com')

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithApple = () => signInWithPopup(auth, appleProvider)

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const logInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const logOut = () => signOut(auth)

export const onAuthChange = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback)
