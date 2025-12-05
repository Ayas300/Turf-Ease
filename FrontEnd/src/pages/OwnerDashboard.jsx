import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { turfAPI, bookingAPI } from '../services/api'
import { showError } from '../utils/toast'
import './Dashboard.css'

const OwnerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [turfs, setTurfs] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Show success message if redirected from add facility
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch owner's turfs from API
      const turfsResponse = await turfAPI.getAll()
      const userId = user._id || user.id
      const ownerTurfs = turfsResponse.data.turfs.filter(
        turf => {
          const ownerId = turf.owner._id || turf.owner.id || turf.owner
          return ownerId === userId || ownerId.toString() === userId.toString()
        }
      )
      setTurfs(ownerTurfs)

      // Fetch bookings for each turf
      const allBookings = []
      for (const turf of ownerTurfs) {
        try {
          const bookingsResponse = await bookingAPI.getTurfBookings(turf._id)
          if (bookingsResponse.data && bookingsResponse.data.bookings) {
            allBookings.push(...bookingsResponse.data.bookings)
          }
        } catch (error) {
          console.error(`Failed to fetch bookings for turf ${turf._id}:`, error)
        }
      }

      // Calculate analytics from fetched data
      const totalRevenue = allBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0)

      const pendingBookings = allBookings.filter(b => b.status === 'pending').length
      const confirmedBookings = allBookings.filter(
        b => b.status === 'confirmed' || b.status === 'completed'
      ).length

      // Calculate occupancy rate (simplified)
      const totalSlots = ownerTurfs.length * 30 * 3 // 30 days, 3 slots per day
      const bookedSlots = confirmedBookings
      const occupancyRate = totalSlots > 0 ? (bookedSlots / totalSlots * 100).toFixed(1) : 0

      // Get recent bookings (last 5)
      const sortedBookings = allBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      setRecentBookings(sortedBookings)

      setAnalytics({
        totalRevenue,
        totalBookings: allBookings.length,
        pendingBookings,
        confirmedBookings,
        occupancyRate,
        totalFacilities: ownerTurfs.length
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showError('Failed to load dashboard data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Manage your turf facilities - {user?.businessName}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Facilities</h3>
          <p>Manage your listed turf facilities</p>
          <div className="card-stats">
            <span className="stat-number">{analytics?.totalFacilities || 0}</span>
            <span className="stat-label">Active Listings</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Bookings</h3>
          <p>View and manage customer reservations</p>
          <div className="card-stats">
            <span className="stat-number">{analytics?.pendingBookings || 0}</span>
            <span className="stat-label">Pending Bookings</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p>Track your earnings and payments</p>
          <div className="card-stats">
            <span className="stat-number">Tk{analytics?.totalRevenue || 0}</span>
            <span className="stat-label">Total Earned</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Analytics</h3>
          <p>View facility performance metrics</p>
          <div className="card-stats">
            <span className="stat-number">{analytics?.occupancyRate || 0}%</span>
            <span className="stat-label">Occupancy Rate</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => handleNavigation('/add-facility')}
          >
            Add New Facility
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleNavigation('/manage-bookings')}
          >
            Manage Bookings
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleNavigation('/analytics')}
          >
            View Analytics
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleNavigation('/update-profile')}
          >
            Update Profile
          </button>
        </div>
      </div>

      {recentBookings.length > 0 && (
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-list">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-info">
                  <h4>{booking.turf?.name || 'Turf'}</h4>
                  <p className="booking-date">
                    {new Date(booking.date).toLocaleDateString()} - {booking.timeSlot?.startTime} to {booking.timeSlot?.endTime}
                  </p>
                  <p className="booking-user">
                    Booked by: {booking.user?.name || 'User'}
                  </p>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                  <p className="booking-amount">
                    Tk{booking.pricing?.totalAmount || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard