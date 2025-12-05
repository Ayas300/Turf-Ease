import React from 'react'
import './TermsConditions.css'

const TermsConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Terms and Conditions</h1>
        
        <div className="terms-section">
          <h2>1.1 Acceptance of Terms</h2>
          <p>By accessing and using our online venue booking platform, you agree to abide by these terms and conditions.</p>
        </div>

        <div className="terms-section">
          <h2>1.2 User Accounts</h2>
          <p>Users must create an account to access certain features. Users are responsible for maintaining the confidentiality of their account information.</p>
        </div>

        <div className="terms-section">
          <h2>1.3 Booking Process</h2>
          <p>Users must provide accurate information when making bookings. Any misrepresentation may result in cancellation or refusal of service.</p>
        </div>

        <div className="terms-section">
          <h2>1.4 Payment</h2>
          <p>Payment for bookings must be made according to the specified terms. Failure to make payment may result in cancellation.</p>
        </div>

        <div className="terms-section">
          <h2>1.5 Intellectual Property</h2>
          <p>All content and materials on the platform are protected by intellectual property laws and may not be used without permission.</p>
        </div>

        <div className="terms-section">
          <h2>1.6 Prohibited Activities</h2>
          <p>Users must not engage in any illegal, abusive, or disruptive behavior on the platform.</p>
        </div>

        <div className="terms-section">
          <h2>1.7 Modification of Terms</h2>
          <p>We reserve the right to modify these terms at any time. Users will be notified of any changes.</p>
        </div>

        <div className="terms-footer">
          <p className="last-updated">Last updated: January 2025</p>
          <p className="contact-info">
            If you have any questions about these Terms and Conditions, please contact us at{' '}
            <a href="mailto:legal@turfease.com">legal@turfease.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsConditions