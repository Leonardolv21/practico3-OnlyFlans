import { createContext, useContext, useMemo, useState } from 'react'
import apiClient from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (payload) => {
    const response = await apiClient.post('/auth/login', payload)
    setUser(response.data.user)
    return response.data.user
  }

  const register = async (payload) => {
    const response = await apiClient.post('/auth/register', payload)
    return response.data
  }

  const logout = async () => {
    await apiClient.post('/auth/logout')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
