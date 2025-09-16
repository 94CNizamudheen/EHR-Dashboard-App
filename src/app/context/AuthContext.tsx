

'use client'
import React, { createContext, useContext, useState } from 'react'
import { User } from '../../types/types' 

interface AuthContextValue {
  user: User | null
  login: (username: string, role?: User['role']) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({ name: 'Demo User', role: 'clinician' })

  function login(username: string, role: User['role'] = 'clinician') {
    setUser({ name: username, role })
  }
  function logout() {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
