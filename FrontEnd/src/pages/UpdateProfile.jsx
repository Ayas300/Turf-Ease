import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showSuccess, showError } from '../utils/toast'
import './UpdateProfile.css'

const UpdateProfile = () => {
  const { user, updateProfile, isOwner } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    preferredSports: [],
    facilityTypes: []
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const sportsOptions = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Hockey']
  const facilityOptions = ['Football Field', 'Cricket Ground', 'Basketball Court', 'Tennis Court', 'Badminton Court', 'Hockey Field', 'Multi-purpose Ground']

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        businessName: user.businessName || '',
        businessAddress: user.businessAddress || '',
        preferredSports: user.preferredSports || [],
        facilityTypes: user.facilityTypes || []
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleArrayChange = (item, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)


    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (isOwner && !formData.businessName) {
      setError('Business name is required for facility owners')
      setLoading(false)
      return
    }

    try {
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        preferredSports: formData.preferredSports,
        facilityTypes: formData.facilityTypes
      }

      // Update user profile via API and AuthContext
      const response = await updateProfile(updatedData)
      
      if (response.success) {
        setSuccess('Profile updated successfully!')
        showSuccess('Profile updated successfully!')

        setTimeout(() => {
          navigate(isOwner ? '/owner-dashboard' : '/dashboard')
        }, 2000)
      } else {
        setError('Failed to update profile. Please try again.')
        showError('Failed to update profile. Please try again.')
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while updating your profile.'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="update-profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Update Profile</h2>
          <p>Keep your information up to date</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-section">
            <h3>Personal Information</h3>
            
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

            <div className="form-row">
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
            </div>
          </div>

          {isOwner && (
            <div className="form-section">
              <h3>Business Information</h3>
              
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

              <div className="form-group">
                <label>Types of Facilities You Own</label>
                <div className="options-grid">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="option-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.facilityTypes.includes(facility)}
                        onChange={() => handleArrayChange(facility, 'facilityTypes')}
                      />
                      <span>{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isOwner && (
            <div className="form-section">
              <h3>Preferences</h3>
              
              <div className="form-group">
                <label>Preferred Sports</label>
                <div className="options-grid">
                  {sportsOptions.map(sport => (
                    <label key={sport} className="option-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.preferredSports.includes(sport)}
                        onChange={() => handleArrayChange(sport, 'preferredSports')}
                      />
                      <span>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(isOwner ? '/owner-dashboard' : '/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile