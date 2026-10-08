import React, { useEffect, useState, createContext, useContext } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { isEmailAllowed, addAllowedAdminEmail } from '../services/dataService';

export function formatAuthError(error: any): string {
  const code = error?.code || '';
  if (code === 'auth/popup-closed-by-user') {
    return 'Jendela login Google ditutup sebelum selesai.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Domain ini belum diizinkan oleh Firebase. Silakan tambahkan domain Anda di Firebase Console -> Authentication -> Settings -> Authorized Domains.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Email atau password yang Anda masukkan tidak sesuai.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'Email ini sudah terdaftar. Silakan login atau gunakan reset password.';
  }
  if (code === 'auth/weak-password') {
    return 'Password terlalu pendek. Gunakan minimal 6 karakter.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Metode email/password belum diaktifkan di Firebase Console. Silakan gunakan Google Sign-In.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Gagal terhubung ke jaringan otentikasi Google. Periksa koneksi internet Anda.';
  }
  return error?.message || 'Terjadi kesalahan saat otentikasi.';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginEmail: (e: string, p: string) => Promise<void>;
  registerEmail: (e: string, p: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const allowed = await isEmailAllowed(currentUser.email);
        if (allowed) {
          setUser(currentUser);
        } else {
          console.warn(`Akses ditolak untuk email ${currentUser.email}: Bukan Admin Terdaftar.`);
          await firebaseSignOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginEmail = async (email: string, pass: string) => {
    try {
      const allowed = await isEmailAllowed(email);
      if (!allowed) {
        throw new Error(`Akses Ditolak: Email (${email}) tidak terdaftar sebagai Admin. Hanya akun terapis resmi yang diizinkan masuk.`);
      }
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userAllowed = await isEmailAllowed(cred.user.email);
      if (!userAllowed) {
        await firebaseSignOut(auth);
        throw new Error(`Akses Ditolak: Email (${cred.user.email}) tidak memiliki izin Admin.`);
      }
    } catch (error: any) {
      if (error.message?.startsWith('Akses Ditolak')) throw error;
      throw new Error(formatAuthError(error));
    }
  };

  const registerEmail = async (email: string, pass: string) => {
    try {
      // Registering new admin is only allowed if email is pre-authorized
      const allowed = await isEmailAllowed(email);
      if (!allowed) {
        throw new Error(`Akses Ditolak: Email (${email}) tidak diizinkan membuat akun Admin. Kontak pemilik website untuk meminta akses.`);
      }
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error.message?.startsWith('Akses Ditolak')) throw error;
      throw new Error(formatAuthError(error));
    }
  };

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userAllowed = await isEmailAllowed(result.user.email);
      if (!userAllowed) {
        await firebaseSignOut(auth);
        throw new Error(`Akses Ditolak: Email Google (${result.user.email}) tidak terdaftar sebagai Admin Website ini. Kontak pemilik website untuk mendaftarkan email Anda.`);
      }
    } catch (error: any) {
      if (error.message?.startsWith('Akses Ditolak')) throw error;
      throw new Error(formatAuthError(error));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.warn('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginEmail,
        registerEmail,
        loginGoogle,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
