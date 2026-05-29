'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, AuthState, LoginFormData } from '@/types'

const rawApiUrl: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const BASE_URL: string = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api/v1`;

interface AuthContextType extends AuthState {
  token: string | null
  login: (data: LoginFormData) => Promise<void>
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const [token, setToken] = useState<string | null>(null)

  // Load user & token from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('sisarasa_user')
        const storedToken = localStorage.getItem('sisarasa_token')
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser) as User
          setToken(storedToken)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    loadUser()
  }, [])

  const login = async (data: LoginFormData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const body = await response.json()

      if (!response.ok) {
        throw new Error(body.detail || body.message || 'Login gagal.')
      }

      const receivedUser: User = body.user
      const receivedToken: string = body.token

      // Store in localStorage
      localStorage.setItem('sisarasa_user', JSON.stringify(receivedUser))
      localStorage.setItem('sisarasa_token', receivedToken)

      setToken(receivedToken)
      setAuthState({
        user: receivedUser,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw err
    }
  }

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      })

      const body = await response.json()

      if (!response.ok) {
        throw new Error(body.detail || body.message || 'Registrasi gagal.')
      }

      // Auto login after registration
      await login({
        emailOrUsername: email,
        password,
        role,
      })
    } catch (err) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('sisarasa_user')
    localStorage.removeItem('sisarasa_token')
    setToken(null)
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return

    const updatedUser = { ...authState.user, ...updates }
    localStorage.setItem('sisarasa_user', JSON.stringify(updatedUser))
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
