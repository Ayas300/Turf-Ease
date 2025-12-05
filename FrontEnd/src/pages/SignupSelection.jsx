import { Link } from 'react-router-dom'
import './SignupSelection.css'

const SignupSelection = () => {
  return (
    <div className="signup-selection-container">
      <div className="signup-selection-card">
        <h2>Join Turf-Ease</h2>
        <p>Choose how you'd like to get started</p>
        
        <div className="signup-options">
          <Link to="/signup/booker" className="signup-option">
            <div className="option-icon">🏃‍♂️</div>
            <h3>I want to book turfs</h3>
            <p>Find and book sports facilities for your games and events</p>
            <div className="option-features">
              <span>✓ Browse available turfs</span>
              <span>✓ Easy booking system</span>
              <span>✓ Manage reservations</span>
            </div>
          </Link>

          <Link to="/signup/owner" className="signup-option">
            <div className="option-icon">🏢</div>
            <h3>I own a turf facility</h3>
            <p>List your sports facility and manage bookings efficiently</p>
            <div className="option-features">
              <span>✓ List your facilities</span>
              <span>✓ Manage bookings</span>
              <span>✓ Track revenue</span>
            </div>
          </Link>

          <Link to="/signup/admin" className="signup-option">
            <div className="option-icon">⚙️</div>
            <h3>I'm an administrator</h3>
            <p>Manage turf approvals and oversee platform operations</p>
            <div className="option-features">
              <span>✓ Review turf submissions</span>
              <span>✓ Approve/reject facilities</span>
              <span>✓ System oversight</span>
            </div>
          </Link>
        </div>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignupSelection