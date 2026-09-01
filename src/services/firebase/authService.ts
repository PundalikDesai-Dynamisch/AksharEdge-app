import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import type { User } from '@react-native-firebase/auth';

import { AppError } from '@/domain/errors/AppError';

import { mapAuthError } from './errorMap';

GoogleSignin.configure({
  webClientId: '656142735843-ff108a1f50mj3bqtjqkq74l3f6sc8nvd.apps.googleusercontent.com',
  offlineAccess: false,
});

export const authService = {
  async registerWithEmail(fullName: string, email: string, password: string): Promise<User> {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      return userCredential.user;
    } catch (e) {
      throw mapAuthError(e);
    }
  },

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (e) {
      throw mapAuthError(e);
    }
  },

  async signInWithGoogle(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices();
      // Always sign out from Google SDK first so the account chooser appears
      try { await GoogleSignin.signOut(); } catch { /* safe no-op */ }
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID token returned');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, googleCredential);

      // We can attach the isNewUser flag directly to the object to avoid another firestore read
      const isNewUser = userCredential.additionalUserInfo?.isNewUser ?? false;
      (userCredential.user as User & { _isNewUser: boolean })._isNewUser = isNewUser;

      return userCredential.user;
    } catch (error: unknown) {
      const appError = error instanceof AppError ? error : null;
      if (appError?.code === 'AUTH_CANCELLED') {
        throw appError;
      }
      const errorWithCode = error as { code?: string };
      if (errorWithCode.code === statusCodes.SIGN_IN_CANCELLED) {
         throw new AppError('AUTH_CANCELLED', 'Sign-in cancelled.', error, false);
      } else if (errorWithCode.code === statusCodes.IN_PROGRESS) {
         throw new AppError('UNKNOWN', 'Sign-in is already in progress.', error, false);
      } else if (errorWithCode.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
         throw new AppError('UNKNOWN', "Google Sign-In isn't available on this device.", error, false);
      }
      throw mapAuthError(error);
    }
  },

  async sendPasswordReset(email: string): Promise<void> {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw mapAuthError(e);
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) throw new Error('No user is currently signed in.');
      // Need to import updatePassword from @react-native-firebase/auth
      const { updatePassword: firebaseUpdatePassword } = require('@react-native-firebase/auth');
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (e) {
      throw mapAuthError(e);
    }
  },

  async signOut(): Promise<void> {
    try {
      // Safe no-op if not signed in with Google
      try {
        await GoogleSignin.signOut();
      } catch { /* Ignore Google Sign-Out errors */ }
      const auth = getAuth();
      await signOut(auth);
    } catch (e) {
      throw mapAuthError(e);
    }
  },

  getCurrentUser(): User | null {
    const auth = getAuth();
    return auth.currentUser;
  },

  onAuthStateChanged(cb: (user: User | null) => void): () => void {
    const auth = getAuth();
    return onAuthStateChanged(auth, cb);
  },
};
