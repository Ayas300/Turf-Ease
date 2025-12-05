import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tokenStorage } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  /**
   * Initialize authentication on app load
   * Checks for existing token and fetches user data if valid
   */
  const initAuth = async () => {
    try {
      const savedToken = tokenStorage.getToken()
      
      if (savedToken) {
        setToken(savedToken)
        
        // Fetch user data from backend using the token
        const response = await authAPI.getMe()
        
        if (response.success && response.data) {
          const userData = response.data.user || response.data
          // Normalize user data - ensure _id exists (backend returns 'id')
          if (userData.id && !userData._id) {
            userData._id = userData.id
          }
          setUser(userData)
        }
      }
    } catch (error) {
      // If token is invalid or expired, clear it
      console.error('Auth initialization failed:', error)
      tokenStorage.clearToken()
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth on mount
  useEffect(() => {
    initAuth()
  }, [])

  /**
   * Login user with credentials
   * Calls backend API and stores token
   */
  const login = async (credentials) => {
    setAuthLoading(true)
    try {
      const response = await authAPI.login(credentials)
      
      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data
        
        // Store token in localStorage
        tokenStorage.saveToken(authToken)
        setToken(authToken)
        
        // Normalize user data - ensure _id exists (backend returns 'id')
        if (userData.id && !userData._id) {
          userData._id = userData.id
        }
        
        // Update user state
        setUser(userData)
        
        return { success: true, data: response.data }
      }
      
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  /**
   * Register new user
   * Calls backend API and stores token
   */
  const register = async (userData) => {
    setAuthLoading(true)
    try {
      const response = await authAPI.register(userData)
      
      if (response.success && response.data) {
        const { token: authToken, user: newUser } = response.data
        
        // Store token in localStorage
        tokenStorage.saveToken(authToken)
        setToken(authToken)
        
        // Normalize user data - ensure _id exists (backend returns 'id')
        if (newUser.id && !newUser._id) {
          newUser._id = newUser.id
        }
        
        // Update user state
        setUser(newUser)
        
        return { success: true, data: response.data }
      }
      
      throw new Error(response.message || 'Registration failed')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  /**
   * Logout user
   * Calls backend API and clears token
   */
  const logout = async () => {
    setAuthLoading(true)
    try {
      // Call backend logout endpoint
      await authAPI.logout()
    } catch (error) {
      // Even if backend call fails, proceed with local logout
      console.error('Logout error:', error)
    } finally {
      // Clear token and user state
      tokenStorage.clearToken()
      setToken(null)
      setUser(null)
      setAuthLoading(false)
    }
  }

  /**
   * Update user profile
   * Calls backend API and updates user state
   */
  const updateProfile = async (profileData) => {
    setAuthLoading(true)
    try {
      const response = await authAPI.updateProfile(profileData)
      
      if (response.success && response.data) {
        const userData = response.data.user || response.data
        // Normalize user data - ensure _id exists (backend returns 'id')
        if (userData.id && !userData._id) {
          userData._id = userData.id
        }
        setUser(userData)
        return { success: true, data: response.data }
      }
      
      throw new Error(response.message || 'Profile update failed')
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    register,
    updateProfile,
    loading,
    authLoading,
    isAuthenticated: !!user && !!token,
    isOwner: user?.role === 'owner',
    isBooker: user?.role === 'user' || user?.role === 'booker',
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}