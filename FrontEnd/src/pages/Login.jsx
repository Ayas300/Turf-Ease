import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showError, showSuccess } from '../utils/toast'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login, authLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation
    if (!formData.email || !formData.password) {
      showError('Please fill in all fields')
      return
    }

    try {
      // Call backend API via AuthContext
      const response = await login({
        email: formData.email,
        password: formData.password
      })

      if (response.success) {
        const user = response.data.user
        showSuccess('Login successful! Welcome back.')
        
        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin-dashboard')
        } else if (user.role === 'owner') {
          navigate('/owner-dashboard')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      // Display error message from API
      const errorMessage = error.message || 'Invalid email or password'
      showError(errorMessage)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your Turf-Ease account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={authLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={authLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={authLoading}>
            {authLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login