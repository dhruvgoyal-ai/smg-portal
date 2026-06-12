import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = 'http://localhost:5000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('smg_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('smg_token'))

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const { token: jwt, user: userData } = res.data
      localStorage.setItem('smg_token', jwt)
      localStorage.setItem('smg_user', JSON.stringify(userData))
      setToken(jwt)
      setUser(userData)
      return { success: true, role: userData.role }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials and try again.'
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('smg_token')
    localStorage.removeItem('smg_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading: false, login, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
