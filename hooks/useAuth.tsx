import React, { createContext, useContext } from 'react';
import * as Google from 'expo-google-app-auth';
import environment from '../environment';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';

type AuthProviderProps = {
  children: any
}

type AuthContextType = {
  user: any;
  signInWithGoogle: Function | any;
}

const config = {
  scopes: ['profile', 'email'],
  permissions: ['public_profile', 'email', 'gender', 'location'],
  androidClientId: environment.ANDROID_ID
}

const AuthContext = createContext<AuthContextType>({ user: null, signInWithGoogle: null });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const signInWithGoogle = async () => {
    try {
      const logInResult = await Google.logInAsync(config);
      if (logInResult.type === 'success') {
        const { idToken, accessToken } = logInResult;
        const credentials = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credentials);
      }
    } catch (err) {
      return err;
    }
  }

  return (
    <AuthContext.Provider value={{ user: null, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}
