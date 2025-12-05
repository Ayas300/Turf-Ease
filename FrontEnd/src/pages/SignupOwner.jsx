import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import './Signup.css'

const SignupOwner = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    facilityTypes: []
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const facilityOptions = ['Football Field', 'Cricket Ground', 'Basketball Court', 'Tennis Court', 'Badminton Court', 'Hockey Field', 'Multi-purpose Ground']

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilityTypes: prev.facilityTypes.includes(facility)
        ? prev.facilityTypes.filter(f => f !== facility)
        : [...prev.facilityTypes, facility]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.businessName) {
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
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'owner', // Backend expects 'owner' role
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        preferences: {
          facilityTypes: formData.facilityTypes
        }
      }
      
      // Register user via API
      await register(userData)
      
      // Show success message
      toast.success('Owner account created successfully! Welcome to TurfEase.')
      
      // Redirect to owner dashboard
      navigate('/owner-dashboard')
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
        <h2>Sign up as a Turf Owner</h2>
        <p>Create your account to list and manage your sports facilities</p>
        
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
            <label htmlFor="businessName">Business/Facility Name *</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter your business or facility name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessAddress">Business Address</label>
            <textarea
              id="businessAddress"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter your business address"
              rows="3"
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

          <div className="form-group">
            <label>Types of Facilities You Own (Optional)</label>
            <div className="sports-selection">
              {facilityOptions.map(facility => (
                <label key={facility} className="sport-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.facilityTypes.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Owner Account'}
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

export default SignupOwner