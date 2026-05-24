'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, AuthState, LoginFormData } from '@/types'

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for development
const MOCK_USERS = {
  seller: {
    id: 'seller-001',
    username: 'warung_bahagia',
    email: 'warung@example.com',
    role: 'seller' as UserRole,
    accountStatus: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  consumer: {
    id: 'consumer-001',
    username: 'budi_konsumen',
    email: 'budi@example.com',
    role: 'consumer' as UserRole,
    accountStatus: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('sisarasa_user')
        if (storedUser) {
          const user = JSON.parse(storedUser) as User
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock login - use role to determine which mock user to return
    const mockUser = MOCK_USERS[data.role]

    // Store user in localStorage
    localStorage.setItem('sisarasa_user', JSON.stringify(mockUser))

    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    localStorage.removeItem('sisarasa_user')
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
        login,
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
