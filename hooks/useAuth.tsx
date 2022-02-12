import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import * as Google from 'expo-google-app-auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth';

import environment from '../environment';
import { auth } from '../firebase';

type AuthProviderProps = {
  children: any;
};

type AuthContextType = {
  user: any;
  isLoading: boolean;
  signInWithGoogle: any;
  logout: any;
  error?: any;
};

const config = {
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location'],
  androidClientId: environment.ANDROID_ID,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  logout: null,
  signInWithGoogle: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [error, setError] = useState<any>();
  const [user, setUser] = useState<any>();
  const [isLoadingInitial, setisLoadingInitial] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }

    setisLoadingInitial(false);
  }), []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const logInResult = await Google.logInAsync(config);
      if (logInResult.type === 'success') {
        const { idToken, accessToken } = logInResult;
        const credentials = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credentials);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    signOut(auth).catch((err) => setError(err));
    setIsLoading(false);
  };

  const memoedValue = useMemo(() => ({
    user,
    isLoading,
    signInWithGoogle,
    logout
  }), [user, isLoading, error]);

  return (
    <AuthContext.Provider
      value={memoedValue}
    >
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
