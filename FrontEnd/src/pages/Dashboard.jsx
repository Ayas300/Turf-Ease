import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { bookingAPI } from '../services/api'
import { showError, showSuccess } from '../utils/toast'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch user's bookings from API
      const response = await bookingAPI.getMyBookings()
      
      if (response.success && response.data) {
        const userBookings = response.data.bookings || response.data
        setBookings(userBookings)
        
        // Calculate analytics from bookings
        const calculatedAnalytics = calculateAnalytics(userBookings)
        setAnalytics(calculatedAnalytics)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showError(error.message || 'Failed to load dashboard data. Please refresh the page.')
      // Set empty analytics on error
      setAnalytics({
        totalBookings: 0,
        upcomingBookings: 0,
        totalSpent: 0,
        recentBookings: []
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (userBookings) => {
    const now = new Date()
    
    // Filter upcoming bookings (future dates with confirmed or pending status)
    const upcoming = userBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      const isUpcoming = bookingDate >= now
      const isActive = booking.status === 'confirmed' || booking.status === 'pending'
      return isUpcoming && isActive
    })

    // Calculate total spent from confirmed bookings
    const totalSpent = userBookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((sum, booking) => {
        const amount = booking.pricing?.totalAmount || booking.totalAmount || 0
        return sum + amount
      }, 0)

    // Get recent bookings (last 5)
    const recentBookings = [...userBookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return {
      totalBookings: userBookings.length,
      upcomingBookings: upcoming.length,
      totalSpent: totalSpent,
      recentBookings: recentBookings
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
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || user?.firstName || 'User'}!</h1>
        <p>Your turf booking dashboard</p>
        {user?.email && <p className="user-email">{user.email}</p>}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Bookings</h3>
          <p>View and manage your turf reservations</p>
          <div className="card-stats">
            <span className="stat-number">{analytics?.upcomingBookings || 0}</span>
            <span className="stat-label">Upcoming Bookings</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Total Spent</h3>
          <p>Your total booking expenses</p>
          <div className="card-stats">
            <span className="stat-number">৳ {analytics?.totalSpent?.toLocaleString() || 0}</span>
            <span className="stat-label">Total Amount</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Booking History</h3>
          <p>Review your past reservations</p>
          <div className="card-stats">
            <span className="stat-number">{analytics?.totalBookings || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Profile Settings</h3>
          <p>Update your account information</p>
          <div className="profile-info">
            <p><strong>Role:</strong> {user?.role || 'User'}</p>
            {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          </div>
          <button 
            className="card-action-btn"
            onClick={() => handleNavigation('/update-profile')}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {analytics?.recentBookings && analytics.recentBookings.length > 0 && (
        <div className="recent-bookings-section">
          <h2>Recent Bookings</h2>
          <div className="bookings-list">
            {analytics.recentBookings.map((booking) => (
              <div key={booking._id || booking.id} className="booking-item">
                <div className="booking-info">
                  <h4>{booking.turf?.name || 'Turf Booking'}</h4>
                  <p className="booking-date">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="booking-time">
                    {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                  </p>
                </div>
                <div className="booking-status">
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                  <p className="booking-amount">
                    ₹{(booking.pricing?.totalAmount || booking.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => handleNavigation('/turfs')}
          >
            Browse Turfs
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleNavigation('/manage-bookings')}
          >
            View All Bookings
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleNavigation('/update-profile')}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard