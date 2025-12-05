import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import './Signup.css'

const SignupAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    adminCode: '',
    department: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.adminCode) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      // Prepare user data for API
      // Backend will validate the admin code
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'admin', // Backend expects 'admin' role
        adminCode: formData.adminCode, // Send admin code for backend validation
        department: formData.department
      }
      
      // Register user via API
      await register(userData)
      
      // Show success message
      toast.success('Admin account created successfully! Welcome to TurfEase.')
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard')
    } catch (err) {
      // Handle API errors
      console.error('Registration error:', err)
      
      // Display error message
      const errorMessage = err.message || 'Registration failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Handle validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const validationMessages = err.errors.map(e => e.msg || e.message).join(', ')
        setError(validationMessages)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign up as Admin</h2>
        <p>Create your admin account to manage turf approvals and system oversight</p>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Operations, Management"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminCode">Admin Code *</label>
            <input
              type="password"
              id="adminCode"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              placeholder="Enter admin authorization code"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          <p><Link to="/signup">Choose different account type</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignupAdmin