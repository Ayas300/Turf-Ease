import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
// import dataService from '../services/dataService' // Removed: localStorage-based service
import { bookingAPI } from '../services/api'
import { showError } from '../utils/toast'
import './Analytics.css'

const Analytics = () => {
  const { user, isOwner } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('all')

  useEffect(() => {
    loadAnalytics()
  }, [user, timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch bookings from API
      const response = await bookingAPI.getMyBookings()
      
      if (response.success) {
        const bookings = response.data.bookings || []
        
        // Calculate analytics from bookings
        const totalBookings = bookings.length
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
        const upcomingBookings = bookings.filter(b => {
          const bookingDate = new Date(b.date)
          return bookingDate >= new Date() && b.status === 'confirmed'
        }).length
        
        const totalSpent = confirmedBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0)
        const totalRevenue = totalSpent // For owners, this would be revenue
        
        // Calculate favorite types
        const typeCount = {}
        bookings.forEach(booking => {
          const turfType = booking.turf?.sports?.[0] || 'Unknown'
          typeCount[turfType] = (typeCount[turfType] || 0) + 1
        })
        
        const favoriteTypes = Object.entries(typeCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([type, count]) => ({ type, count }))
        
        const analyticsData = {
          totalBookings,
          upcomingBookings,
          totalSpent,
          totalRevenue,
          confirmedBookings: confirmedBookings.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          occupancyRate: 0, // Would need facility data to calculate
          totalFacilities: 0, // Would need to fetch from turf API
          favoriteTypes,
          recentBookings: bookings.slice(-5).reverse().map(b => ({
            id: b._id,
            facilityName: b.turf?.name || 'Unknown Facility',
            date: b.date,
            amount: b.pricing?.totalAmount || 0,
            status: b.status
          }))
        }
        
        setAnalytics(analyticsData)
      }
    } catch (error) {
      showError('Failed to load analytics data. Please refresh the page.')
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return `Tk${amount || 0}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="error-state">
          <h3>Unable to load analytics</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>{isOwner ? 'Business Analytics' : 'My Activity'}</h1>
        <p>{isOwner ? 'Track your facility performance and revenue' : 'View your booking history and preferences'}</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {isOwner ? (
          <>
            <div className="metric-card revenue">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>Total Revenue</h3>
                <div className="metric-value">{formatCurrency(analytics.totalRevenue)}</div>
                <div className="metric-subtitle">From confirmed bookings</div>
              </div>
            </div>

            <div className="metric-card bookings">
              <div className="metric-icon">📅</div>
              <div className="metric-content">
                <h3>Total Bookings</h3>
                <div className="metric-value">{analytics.totalBookings}</div>
                <div className="metric-subtitle">{analytics.pendingBookings} pending</div>
              </div>
            </div>

            <div className="metric-card occupancy">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h3>Occupancy Rate</h3>
                <div className="metric-value">{analytics.occupancyRate}%</div>
                <div className="metric-subtitle">Average across facilities</div>
              </div>
            </div>

            <div className="metric-card facilities">
              <div className="metric-icon">🏟️</div>
              <div className="metric-content">
                <h3>Active Facilities</h3>
                <div className="metric-value">{analytics.totalFacilities}</div>
                <div className="metric-subtitle">Listed facilities</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="metric-card bookings">
              <div className="metric-icon">📅</div>
              <div className="metric-content">
                <h3>Total Bookings</h3>
                <div className="metric-value">{analytics.totalBookings}</div>
                <div className="metric-subtitle">{analytics.upcomingBookings} upcoming</div>
              </div>
            </div>

            <div className="metric-card spent">
              <div className="metric-icon">💳</div>
              <div className="metric-content">
                <h3>Total Spent</h3>
                <div className="metric-value">{formatCurrency(analytics.totalSpent)}</div>
                <div className="metric-subtitle">On confirmed bookings</div>
              </div>
            </div>

            <div className="metric-card upcoming">
              <div className="metric-icon">⏰</div>
              <div className="metric-content">
                <h3>Upcoming Bookings</h3>
                <div className="metric-value">{analytics.upcomingBookings}</div>
                <div className="metric-subtitle">Next 30 days</div>
              </div>
            </div>

            <div className="metric-card average">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <h3>Average Booking</h3>
                <div className="metric-value">
                  {analytics.totalBookings > 0 
                    ? formatCurrency(analytics.totalSpent / analytics.totalBookings)
                    : formatCurrency(0)
                  }
                </div>
                <div className="metric-subtitle">Per booking</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts and Additional Info */}
      <div className="analytics-content">
        {isOwner ? (
          <div className="analytics-section">
            <h2>Recent Bookings</h2>
            <div className="recent-bookings">
              {analytics.recentBookings.length === 0 ? (
                <div className="empty-state">
                  <p>No recent bookings to display</p>
                </div>
              ) : (
                analytics.recentBookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <div className="booking-facility">{booking.facilityName}</div>
                      <div className="booking-date">{formatDate(booking.date)}</div>
                    </div>
                    <div className="booking-amount">{formatCurrency(booking.amount)}</div>
                    <div className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {analytics.favoriteTypes.length > 0 && (
              <div className="analytics-section">
                <h2>Favorite Sports</h2>
                <div className="favorite-types">
                  {analytics.favoriteTypes.map((item, index) => (
                    <div key={index} className="type-item">
                      <div className="type-name">{item.type}</div>
                      <div className="type-count">{item.count} bookings</div>
                      <div className="type-bar">
                        <div 
                          className="type-fill"
                          style={{ 
                            width: `${(item.count / analytics.favoriteTypes[0].count) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="analytics-section">
              <h2>Recent Bookings</h2>
              <div className="recent-bookings">
                {analytics.recentBookings.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent bookings to display</p>
                  </div>
                ) : (
                  analytics.recentBookings.map(booking => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-info">
                        <div className="booking-facility">{booking.facilityName}</div>
                        <div className="booking-date">{formatDate(booking.date)}</div>
                      </div>
                      <div className="booking-amount">{formatCurrency(booking.amount)}</div>
                      <div className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Performance Tips */}
      <div className="tips-section">
        <h2>💡 {isOwner ? 'Business Tips' : 'Booking Tips'}</h2>
        <div className="tips-grid">
          {isOwner ? (
            <>
              <div className="tip-card">
                <h4>Optimize Pricing</h4>
                <p>Consider dynamic pricing for peak hours and weekends to maximize revenue.</p>
              </div>
              <div className="tip-card">
                <h4>Improve Facilities</h4>
                <p>Add popular amenities like floodlights and parking to attract more bookings.</p>
              </div>
              <div className="tip-card">
                <h4>Quick Response</h4>
                <p>Respond to booking requests quickly to improve customer satisfaction.</p>
              </div>
            </>
          ) : (
            <>
              <div className="tip-card">
                <h4>Book Early</h4>
                <p>Popular time slots fill up quickly, especially on weekends.</p>
              </div>
              <div className="tip-card">
                <h4>Off-Peak Savings</h4>
                <p>Morning slots are often cheaper than evening slots.</p>
              </div>
              <div className="tip-card">
                <h4>Regular Bookings</h4>
                <p>Some facilities offer discounts for regular customers.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics