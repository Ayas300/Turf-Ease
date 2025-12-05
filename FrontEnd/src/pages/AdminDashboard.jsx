import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { turfAPI } from '../services/api'
import { showSuccess, showError } from '../utils/toast'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [pendingTurfs, setPendingTurfs] = useState([])
  const [approvedTurfs, setApprovedTurfs] = useState([])
  const [allTurfs, setAllTurfs] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTurfs()
  }, [])

  const loadTurfs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch pending turfs (not verified)
      const pendingResponse = await turfAPI.getPendingTurfs()
      const pending = pendingResponse.data.turfs || []
      setPendingTurfs(pending)
      
      // Fetch all turfs (verified)
      const allResponse = await turfAPI.getAll({ limit: 1000 })
      const approved = allResponse.data.turfs || []
      setApprovedTurfs(approved)
      
      // Combine all turfs for management tab
      setAllTurfs([...pending, ...approved])
      
    } catch (err) {
      console.error('Error loading turfs:', err)
      setError(err.message || 'Failed to load turfs')
      showError(err.message || 'Failed to load turfs')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (turfId, turfName) => {
    try {
      await turfAPI.verifyTurf(turfId, true)
      showSuccess(`"${turfName}" has been approved successfully!`)
      
      // Reload turfs to reflect changes
      await loadTurfs()
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('turfsUpdated'))
    } catch (err) {
      console.error('Error approving turf:', err)
      showError(err.message || 'Failed to approve turf')
    }
  }

  const handleReject = async (turfId, turfName, reason = '') => {
    try {
      await turfAPI.verifyTurf(turfId, false)
      showError(`"${turfName}" has been rejected${reason ? ` - ${reason}` : ''}`)
      
      // Reload turfs to reflect changes
      await loadTurfs()
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('turfsUpdated'))
    } catch (err) {
      console.error('Error rejecting turf:', err)
      showError(err.message || 'Failed to reject turf')
    }
  }

  const handleDelete = async (turfId, turfName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${turfName}"?\n\nThis action cannot be undone and will:\n- Remove the turf from all listings\n- Cancel all related bookings\n- Remove it from the system completely`
    )
    
    if (confirmDelete) {
      try {
        await turfAPI.delete(turfId)
        showSuccess(`"${turfName}" has been permanently deleted from the system.`)
        
        // Reload turfs to reflect changes
        await loadTurfs()
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('turfsUpdated'))
      } catch (err) {
        console.error('Error deleting turf:', err)
        showError(err.message || 'Failed to delete turf. Please try again.')
      }
    }
  }

  const TurfCard = ({ turf, showActions = false, showDelete = false }) => {
    // Extract location details from API response structure
    const location = turf.location?.address 
      ? `${turf.location.address}, ${turf.location.city}, ${turf.location.state}`
      : turf.location || 'N/A'
    
    // Get sports list (API returns array)
    const sports = Array.isArray(turf.sports) 
      ? turf.sports.join(', ') 
      : turf.sport || 'N/A'
    
    // Get price from pricing object
    const price = turf.pricing?.hourlyRate || turf.price || 0
    
    // Get owner details
    const ownerName = turf.owner?.name || turf.ownerName || 'N/A'
    const ownerEmail = turf.owner?.email || turf.ownerEmail || 'N/A'
    
    // Determine status based on isVerified flag
    const status = turf.isVerified ? 'approved' : 'pending'
    
    return (
      <div className="admin-turf-card">
        <div className="turf-header">
          <h3>{turf.name}</h3>
          <span className={`status-badge ${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <div className="turf-details">
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Sport:</strong> {sports}</p>
          <p><strong>Price:</strong> ₹{price}/hour</p>
          <p><strong>Owner:</strong> {ownerName}</p>
          <p><strong>Contact:</strong> {ownerEmail}</p>
          <p><strong>Submitted:</strong> {new Date(turf.createdAt).toLocaleDateString()}</p>
          
          {turf.description && (
            <p><strong>Description:</strong> {turf.description}</p>
          )}
          
          {turf.amenities && turf.amenities.length > 0 && (
            <div className="amenities">
              <strong>Amenities:</strong>
              <div className="amenity-tags">
                {turf.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {showActions && (
          <div className="turf-actions">
            <button 
              className="approve-btn"
              onClick={() => handleApprove(turf._id, turf.name)}
            >
              Approve
            </button>
            <button 
              className="reject-btn"
              onClick={() => {
                const reason = prompt('Reason for rejection (optional):')
                handleReject(turf._id, turf.name, reason)
              }}
            >
              Reject
            </button>
          </div>
        )}

        {showDelete && (
          <div className="turf-actions">
            <button 
              className="delete-btn"
              onClick={() => handleDelete(turf._id, turf.name)}
            >
              🗑️ Delete Permanently
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderTurfs = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <p>Loading turfs...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={loadTurfs} className="retry-btn">Retry</button>
        </div>
      )
    }

    let turfsToShow = []
    
    switch(activeTab) {
      case 'pending':
        turfsToShow = pendingTurfs
        break
      case 'approved':
        turfsToShow = approvedTurfs
        break
      case 'manage':
        turfsToShow = allTurfs
        break
      default:
        turfsToShow = pendingTurfs
    }

    if (turfsToShow.length === 0) {
      return (
        <div className="no-turfs">
          <p>No {activeTab === 'manage' ? 'turfs' : activeTab + ' turfs'} found.</p>
        </div>
      )
    }

    return turfsToShow.map(turf => (
      <TurfCard 
        key={turf._id} 
        turf={turf} 
        showActions={activeTab === 'pending'}
        showDelete={activeTab === 'manage'}
      />
    ))
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name || user?.fullName || 'Admin'}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{loading ? '...' : pendingTurfs.length}</h3>
          <p>Pending Approvals</p>
        </div>
        <div className="stat-card">
          <h3>{loading ? '...' : approvedTurfs.length}</h3>
          <p>Approved Turfs</p>
        </div>
        <div className="stat-card">
          <h3>{loading ? '...' : allTurfs.length}</h3>
          <p>Total Turfs</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
            disabled={loading}
          >
            Pending ({loading ? '...' : pendingTurfs.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
            disabled={loading}
          >
            Approved ({loading ? '...' : approvedTurfs.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
            disabled={loading}
          >
            Manage All ({loading ? '...' : allTurfs.length})
          </button>
        </div>

        <div className="turfs-grid">
          {renderTurfs()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard