import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'
import type { User, AuthContextType, LoginResponse } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data)
        } catch (e) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
