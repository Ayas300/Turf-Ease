import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { turfAPI, tokenStorage } from '../services/api'
import { showSuccess, showError } from '../utils/toast'
import { mapFacilityTypeToBackend, mapAmenitiesToBackend } from '../utils/turfDataMapper'
import './AddFacility.css'

const AddFacility = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    price: '',
    description: '',
    amenities: [],
    image: ''
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageError, setImageError] = useState('')

  const facilityTypes = [
    'Football Field',
    'Cricket Ground',
    'Basketball Court',
    'Tennis Court',
    'Badminton Court',
    'Hockey Field',
    'Multi-purpose Ground',
    'Swimming Pool',
    'Volleyball Court'
  ]

  const amenityOptions = [
    'Parking',
    'Washrooms',
    'Changing Rooms',
    'Floodlights',
    'Seating Area',
    'Cafeteria',
    'First Aid',
    'Equipment Rental'
  ]

  const validateImageUrl = (url) => {
    if (!url) {
      return { valid: true, error: '' } // Empty URL is valid (optional field)
    }

    // Check if it's a valid URL format
    try {
      const urlObj = new URL(url)
      
      // Check if protocol is http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'URL must start with http:// or https://' }
      }

      // Check if URL ends with common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
      const pathname = urlObj.pathname.toLowerCase()
      const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext))
      
      // Also accept URLs without extensions (like CDN URLs with query params)
      if (!hasImageExtension && !urlObj.search) {
        return { 
          valid: false, 
          error: 'URL should point to an image file (.jpg, .jpeg, .png, .gif, .webp, .bmp, .svg)' 
        }
      }

      return { valid: true, error: '' }
    } catch (err) {
      return { valid: false, error: 'Please enter a valid URL (e.g., https://example.com/image.jpg)' }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })

    // Special handling for image URL field
    if (name === 'image') {
      const validation = validateImageUrl(value)
      
      if (!validation.valid) {
        setImageError(validation.error)
        setImagePreview('')
      } else {
        setImageError('')
        // Set preview if URL is valid and not empty
        if (value) {
          setImagePreview(value)
        } else {
          setImagePreview('')
        }
      }
    }
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setError('')
    setFieldErrors({})

    // Client-side validation
    if (!formData.name || !formData.type || !formData.location || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Please enter a valid price')
      return
    }

    // Validate image URL if provided
    if (formData.image) {
      const validation = validateImageUrl(formData.image)
      if (!validation.valid) {
        setImageError(validation.error)
        setError('Please provide a valid image URL or leave it empty')
        return
      }
    }

    // Check if user is properly authenticated as owner
    if (!user) {
      setError('Authentication error. Please log in again.')
      showError('You are not logged in. Please log in again.')
      navigate('/login')
      return
    }

    if (user.role !== 'owner') {
      setError('Only turf owners can add facilities.')
      showError('Only turf owners can add facilities.')
      return
    }

    // Debug: Log user info to console
    console.log('User info:', { id: user._id || user.id, role: user.role, email: user.email })

    setLoading(true)

    try {
      // Parse location into city and state (if comma-separated)
      const locationParts = formData.location.split(',').map(part => part.trim())
      const city = locationParts[0] || formData.location
      const state = locationParts[1] || ''

      // Prepare turf data according to backend schema
      const turfData = {
        name: formData.name,
        description: formData.description || `${formData.type} facility in ${formData.location}`,
        location: {
          address: formData.location,
          city: city,
          ...(state && { state: state }), // Only include state if it exists
          coordinates: {
            latitude: 0,
            longitude: 0
          }
        },
        sports: [mapFacilityTypeToBackend(formData.type)], // Map facility type to backend format
        amenities: mapAmenitiesToBackend(formData.amenities), // Map amenities to backend format
        pricing: {
          hourlyRate: parseFloat(formData.price),
          currency: 'INR'
        },
        images: formData.image ? [{ url: formData.image }] : [],
        capacity: {
          maxPlayers: 22, // Default capacity
          recommendedPlayers: 11
        },
        contact: {
          phone: user.phone || '0000000000',
          email: user.email
        }
      }

      // Submit to backend API
      const response = await turfAPI.create(turfData)

      // Clear error state on successful submission
      setError('')
      setFieldErrors({})
      
      showSuccess(`${response.data.name} has been created successfully!`)
      navigate('/owner-dashboard')
    } catch (err) {
      console.error('Error creating turf:', err)
      
      // Handle different error types
      if (err.type === 'validation' && err.errors && err.errors.length > 0) {
        // Handle validation errors (400) - display field-specific messages
        const errors = {}
        const errorMessages = []
        
        err.errors.forEach(error => {
          const field = error.param || error.path || error.field
          const message = error.msg || error.message
          
          if (field) {
            errors[field] = message
          }
          errorMessages.push(message)
        })
        
        setFieldErrors(errors)
        const summaryMessage = errorMessages.length > 0 
          ? errorMessages.join('. ') 
          : 'Validation failed. Please check your input.'
        setError(summaryMessage)
        showError(summaryMessage)
        
      } else if (err.type === 'authentication') {
        // Handle authentication errors (401) - clear token and redirect
        setError('Your session has expired. Please log in again.')
        showError('Authentication required. Please log in again.')
        
        // Clear token from storage
        tokenStorage.clearToken()
        
        // Logout user from context
        await logout()
        
        // Redirect to login page
        navigate('/login', { replace: true })
        
      } else if (err.type === 'authorization') {
        // Handle authorization errors (403) - show appropriate message
        const message = err.message || 'You do not have permission to add facilities.'
        setError(message)
        showError(message)
        
      } else if (err.type === 'network' || err.type === 'timeout') {
        // Handle network errors - show user-friendly message
        const message = err.type === 'timeout' 
          ? 'Request timeout. Please check your connection and try again.'
          : 'Network error. Please check your internet connection and try again.'
        setError(message)
        showError(message)
        
      } else {
        // Handle other errors (server errors, unknown errors)
        const errorMessage = err.message || 'Failed to add facility. Please try again.'
        setError(errorMessage)
        showError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-facility-container">
      <div className="add-facility-card">
        <div className="form-header">
          <h2>Add New Facility</h2>
          <p>List your sports facility on Turf-Ease</p>
        </div>

        <form onSubmit={handleSubmit} className="facility-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Facility Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter facility name"
                required
                className={fieldErrors.name ? 'error-input' : ''}
              />
              {fieldErrors.name && (
                <span className="field-error">{fieldErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type">Facility Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={fieldErrors.sports || fieldErrors.type ? 'error-input' : ''}
              >
                <option value="">Select facility type</option>
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {(fieldErrors.sports || fieldErrors.type) && (
                <span className="field-error">{fieldErrors.sports || fieldErrors.type}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Dhaka or Dhaka, Bangladesh"
                required
                className={fieldErrors.location || fieldErrors['location.city'] || fieldErrors['location.address'] ? 'error-input' : ''}
              />
              {(fieldErrors.location || fieldErrors['location.city'] || fieldErrors['location.address']) && (
                <span className="field-error">
                  {fieldErrors.location || fieldErrors['location.city'] || fieldErrors['location.address']}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price per Hour (Tk) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="2000"
                min="0"
                required
                className={fieldErrors.price || fieldErrors['pricing.hourlyRate'] ? 'error-input' : ''}
              />
              {(fieldErrors.price || fieldErrors['pricing.hourlyRate']) && (
                <span className="field-error">
                  {fieldErrors.price || fieldErrors['pricing.hourlyRate']}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL (Optional)</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={imageError || fieldErrors.image || fieldErrors['images'] ? 'error-input' : ''}
            />
            {imageError && (
              <span className="field-error">{imageError}</span>
            )}
            {(fieldErrors.image || fieldErrors['images']) && (
              <span className="field-error">{fieldErrors.image || fieldErrors['images']}</span>
            )}
            {imagePreview && !imageError && (
              <div className="image-preview-container">
                <p className="preview-label">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="image-preview"
                  onError={() => {
                    setImageError('Failed to load image. Please check the URL.')
                    setImagePreview('')
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your facility, its features, and what makes it special..."
              rows="4"
              className={fieldErrors.description ? 'error-input' : ''}
            />
            {fieldErrors.description && (
              <span className="field-error">{fieldErrors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <div className="amenities-grid">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
            {fieldErrors.amenities && (
              <span className="field-error">{fieldErrors.amenities}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/owner-dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding Facility...' : 'Add Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFacility