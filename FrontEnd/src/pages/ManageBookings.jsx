import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { bookingAPI } from '../services/api'
import { showSuccess, showError } from '../utils/toast'
import './ManageBookings.css'

const ManageBookings = () => {
  const { user, isOwner } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const response = await bookingAPI.getMyBookings()
      // API returns { success: true, data: { bookings: [...] } }
      const bookingsData = response.data?.bookings || response.bookings || []
      setBookings(bookingsData)
    } catch (error) {
      console.error('Failed to load bookings:', error)
      showError(error.message || 'Failed to load bookings. Please refresh the page.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setCancellingId(bookingId)
    try {
      await bookingAPI.cancel(bookingId, 'Cancelled by user')
      showSuccess('Booking cancelled successfully!')
      // Update the booking list after cancellation
      await loadBookings()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      showError(error.message || 'Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings
    return bookings.filter(booking => booking.status === filter)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      case 'completed': return '#6366f1'
      default: return '#6b7280'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeSlot) => {
    // Handle both old format (string) and new format (object with startTime/endTime)
    if (typeof timeSlot === 'object' && timeSlot.startTime && timeSlot.endTime) {
      return `${timeSlot.startTime} - ${timeSlot.endTime}`
    }
    const timeMap = {
      morning: '6:00 AM - 12:00 PM',
      afternoon: '12:00 PM - 6:00 PM',
      evening: '6:00 PM - 12:00 AM'
    }
    return timeMap[timeSlot] || timeSlot
  }

  const getTurfName = (booking) => {
    // Handle populated turf object from API
    if (booking.turf && typeof booking.turf === 'object') {
      return booking.turf.name || 'Unknown Facility'
    }
    return booking.facilityName || 'Unknown Facility'
  }

  const getTurfLocation = (booking) => {
    if (booking.turf && typeof booking.turf === 'object' && booking.turf.location) {
      const loc = booking.turf.location
      return `${loc.city || ''}, ${loc.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Unknown Location'
    }
    return booking.facilityLocation || 'Unknown Location'
  }

  const getTurfSports = (booking) => {
    if (booking.turf && typeof booking.turf === 'object' && booking.turf.sports) {
      return booking.turf.sports.join(', ')
    }
    return booking.facilityType || 'Unknown Type'
  }

  const getBookingAmount = (booking) => {
    // Handle new pricing structure
    if (booking.pricing && booking.pricing.totalAmount) {
      return booking.pricing.totalAmount
    }
    return booking.amount || 0
  }

  if (loading) {
    return (
      <div className="manage-bookings-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="manage-bookings-container">
      <div className="bookings-header">
        <h1>{isOwner ? 'Manage Bookings' : 'My Bookings'}</h1>
        <p>{isOwner ? 'Review and manage customer bookings' : 'Track your turf reservations'}</p>
      </div>

      <div className="bookings-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({bookings.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter(b => b.status === 'pending').length})
        </button>
        <button 
          className={filter === 'confirmed' ? 'active' : ''}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({bookings.filter(b => b.status === 'completed').length})
        </button>
        <button 
          className={filter === 'cancelled' ? 'active' : ''}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </button>
      </div>

      <div className="bookings-list">
        {getFilteredBookings().length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>
              {filter === 'all' 
                ? isOwner 
                  ? 'No bookings have been made for your facilities yet.'
                  : 'You haven\'t made any bookings yet. Start by browsing available turfs!'
                : `No ${filter} bookings found.`
              }
            </p>
          </div>
        ) : (
          getFilteredBookings().map(booking => (
            <div key={booking._id || booking.id} className="booking-card">
              <div className="booking-info">
                <div className="booking-header">
                  <h3>{getTurfName(booking)}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Sports:</span>
                    <span>{getTurfSports(booking)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span>{getTurfLocation(booking)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Time:</span>
                    <span>{formatTime(booking.timeSlot)}</span>
                  </div>
                  {booking.duration && (
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span>{booking.duration} hour{booking.duration > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="label">Amount:</span>
                    <span className="amount">₹{getBookingAmount(booking)}</span>
                  </div>
                  {booking.players && booking.players.count && (
                    <div className="detail-item">
                      <span className="label">Players:</span>
                      <span>{booking.players.count}</span>
                    </div>
                  )}
                  {booking.specialRequests && (
                    <div className="detail-item">
                      <span className="label">Special Requests:</span>
                      <span>{booking.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && (booking.status === 'pending' || booking.status === 'confirmed') && (
                <div className="booking-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking._id || booking.id)}
                    disabled={cancellingId === (booking._id || booking.id)}
                  >
                    {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                </div>
              )}

              {booking.cancellation && booking.cancellation.reason && (
                <div className="cancellation-info">
                  <span className="label">Cancellation Reason:</span>
                  <span>{booking.cancellation.reason}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageBookings