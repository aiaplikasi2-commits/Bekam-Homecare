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

// Permanent Fixed Admin Credentials
const FIXED_ADMIN_USERNAME = 'nedi_bekam';
const FIXED_ADMIN_PASS = '021985Mur';
const FIXED_ADMIN_EMAIL = 'jamurtv69@gmail.com';

const FIXED_ADMIN_USER = {
  uid: 'fixed_admin_nedi_bekam',
  email: FIXED_ADMIN_EMAIL,
  displayName: 'Nedi_bekam (Admin Utama)',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    authTime: '',
    expirationTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    token: '',
    claims: {}
  }),
  reload: async () => {},
  toJSON: () => ({})
} as unknown as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLocalAdmin = localStorage.getItem('nedi_bekam_admin_active') === 'true';
    if (isLocalAdmin) {
      setUser(FIXED_ADMIN_USER);
      setLoading(false);
      return;
    }

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

  const loginEmail = async (inputUserOrEmail: string, pass: string) => {
    const cleanInput = inputUserOrEmail.trim().toLowerCase();
    const isFixedUsername =
      cleanInput === FIXED_ADMIN_USERNAME ||
      cleanInput === 'nedi_bekam' ||
      cleanInput === FIXED_ADMIN_EMAIL;
    const isFixedPassword = pass === FIXED_ADMIN_PASS;

    if (isFixedUsername && isFixedPassword) {
      localStorage.setItem('nedi_bekam_admin_active', 'true');
      setUser(FIXED_ADMIN_USER);
      return;
    }

    if (!isFixedUsername) {
      throw new Error(
        `Akses Ditolak: Username "${inputUserOrEmail}" tidak terdaftar. Hanya Username "Nedi_bekam" yang diizinkan masuk.`
      );
    }

    if (!isFixedPassword) {
      throw new Error(`Akses Ditolak: Password yang Anda masukkan salah.`);
    }

    try {
      const allowed = await isEmailAllowed(inputUserOrEmail);
      if (!allowed) {
        throw new Error(
          `Akses Ditolak: Hanya Username "Nedi_bekam" yang diizinkan masuk.`
        );
      }
      const cred = await signInWithEmailAndPassword(auth, inputUserOrEmail, pass);
      const userAllowed = await isEmailAllowed(cred.user.email);
      if (!userAllowed) {
        await firebaseSignOut(auth);
        throw new Error(`Akses Ditolak: Akses dikunci khusus Nedi_bekam.`);
      }
    } catch (error: any) {
      if (error.message?.startsWith('Akses Ditolak')) throw error;
      throw new Error(formatAuthError(error));
    }
  };

  const registerEmail = async () => {
    throw new Error('Akses Ditolak: Pendaftaran akun baru ditutup oleh sistem. Website ini terkunci khusus Admin Nedi_bekam.');
  };

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userAllowed = await isEmailAllowed(result.user.email);
      if (!userAllowed) {
        await firebaseSignOut(auth);
        throw new Error(`Akses Ditolak: Email Google (${result.user.email}) tidak memiliki akses. Hanya Nedi_bekam yang diizinkan.`);
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
      localStorage.removeItem('nedi_bekam_admin_active');
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
