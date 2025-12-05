import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { turfAPI, bookingAPI } from '../services/api'
import { showSuccess, showError } from '../utils/toast'
import './BookTurf.css'

const BookTurf = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [turf, setTurf] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: 1,
    playerCount: 1,
    specialRequests: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTurf()
  }, [id])

  const loadTurf = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch turf details from API
      const response = await turfAPI.getById(id)
      
      if (response.success && response.data) {
        setTurf(response.data.turf || response.data)
      } else {
        setError('Turf not found')
      }
    } catch (err) {
      console.error('Error loading turf:', err)
      setError(err.message || 'Error loading turf details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Calculate duration when times change
    if (name === 'startTime' || name === 'endTime') {
      const start = name === 'startTime' ? value : bookingData.startTime
      const end = name === 'endTime' ? value : bookingData.endTime
      
      if (start && end) {
        const duration = calculateDuration(start, end)
        setBookingData(prev => ({
          ...prev,
          duration
        }))
      }
    }
  }

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 1
    
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const durationMinutes = endMinutes - startMinutes
    return Math.max(1, Math.round(durationMinutes / 60))
  }

  const calculateTotalAmount = () => {
    if (!turf || !bookingData.duration) return 0
    
    const hourlyRate = turf.pricing?.hourlyRate || turf.price || 0
    return hourlyRate * bookingData.duration
  }

  const validateForm = () => {
    // Check if user is logged in
    if (!user) {
      showError('Please log in to make a booking')
      return false
    }

    // Validate required fields
    if (!bookingData.date) {
      showError('Please select a date')
      return false
    }

    if (!bookingData.startTime) {
      showError('Please select a start time')
      return false
    }

    if (!bookingData.endTime) {
      showError('Please select an end time')
      return false
    }

    // Validate time range
    if (bookingData.startTime >= bookingData.endTime) {
      showError('End time must be after start time')
      return false
    }

    // Validate player count
    if (bookingData.playerCount < 1) {
      showError('Player count must be at least 1')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // Prepare booking data for API
      const bookingPayload = {
        turf: id,
        date: bookingData.date,
        timeSlot: {
          startTime: bookingData.startTime,
          endTime: bookingData.endTime
        },
        duration: bookingData.duration,
        players: {
          count: parseInt(bookingData.playerCount)
        },
        specialRequests: bookingData.specialRequests || '',
        payment: {
          method: 'pending' // Payment method to be selected later
        }
      }

      // Create booking via API
      const response = await bookingAPI.create(bookingPayload)
      
      if (response.success) {
        // Show success message
        showSuccess(`Booking confirmed for ${turf.name} on ${new Date(bookingData.date).toLocaleDateString()}!`)
        
        // Redirect to bookings page
        navigate('/manage-bookings')
      } else {
        throw new Error(response.message || 'Failed to create booking')
      }
    } catch (err) {
      console.error('Booking error:', err)
      
      // Handle specific error types
      if (err.status === 409 || err.type === 'conflict') {
        // Booking conflict error
        const conflictMessage = err.conflict 
          ? `Time slot conflict: ${err.message}` 
          : err.message
        showError(conflictMessage)
        setError(conflictMessage)
      } else if (err.status === 401 || err.type === 'authentication') {
        showError('Please log in to make a booking')
        navigate('/login')
      } else {
        // Generic error
        const errorMessage = err.message || 'Failed to create booking. Please try again.'
        showError(errorMessage)
        setError(errorMessage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      slots.push(time)
    }
    return slots
  }

  if (loading) {
    return (
      <div className="book-turf-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading facility details...</p>
        </div>
      </div>
    )
  }

  if (error && !turf) {
    return (
      <div className="book-turf-container">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/turfs')}>Back to Turfs</button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-turf-container">
      <div className="booking-card">
        <div className="facility-info">
          <img 
            src={turf.images?.[0]?.url || turf.image || '/placeholder-turf.jpg'} 
            alt={turf.name} 
          />
          <div className="facility-details">
            <h2>{turf.name}</h2>
            <p className="facility-type">
              {turf.sports?.join(', ') || turf.type || 'Sports Facility'}
            </p>
            <p className="facility-location">
              📍 {turf.location?.address || turf.location?.city || turf.location || 'Location'}
            </p>
            <p className="facility-price">
              Starting from ₹{turf.pricing?.hourlyRate || turf.price || 0}/hour
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <h3>Book This Turf</h3>
          
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="date">Select Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              min={getMinDate()}
              max={getMaxDate()}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <select
              id="startTime"
              name="startTime"
              value={bookingData.startTime}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">Choose start time</option>
              {generateTimeSlots().map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <select
              id="endTime"
              name="endTime"
              value={bookingData.endTime}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">Choose end time</option>
              {generateTimeSlots().map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="playerCount">Number of Players *</label>
            <input
              type="number"
              id="playerCount"
              name="playerCount"
              value={bookingData.playerCount}
              onChange={handleChange}
              min="1"
              max={turf.capacity?.maxPlayers || 50}
              required
              disabled={submitting}
            />
            {turf.capacity?.recommendedPlayers && (
              <small>Recommended: {turf.capacity.recommendedPlayers} players</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={bookingData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements or notes..."
              rows="3"
              disabled={submitting}
            />
          </div>

          {bookingData.startTime && bookingData.endTime && (
            <div className="booking-summary">
              <h4>Booking Summary</h4>
              <div className="summary-item">
                <span>Turf:</span>
                <span>{turf.name}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{new Date(bookingData.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <span>{bookingData.startTime} - {bookingData.endTime}</span>
              </div>
              <div className="summary-item">
                <span>Duration:</span>
                <span>{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="summary-item">
                <span>Players:</span>
                <span>{bookingData.playerCount}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>₹{calculateTotalAmount()}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/turf/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="book-btn"
              disabled={submitting || !bookingData.date || !bookingData.startTime || !bookingData.endTime}
            >
              {submitting ? 'Booking...' : `Book for ₹${calculateTotalAmount()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookTurf