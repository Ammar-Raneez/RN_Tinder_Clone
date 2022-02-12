import React, { createContext, useContext } from 'react';

type AuthProviderProps = {
  children: any
}

type AuthContextType = {
  user: any;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ user: 'me' }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}
