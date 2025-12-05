import React from 'react'
import './ContactUs.css'

const ContactUs = () => {
  return (
    <div className="contact-us">
      <div className="contact-us-container">
        <div className="contact-us-header">
          <h1>Contact Us</h1>
          <p className="contact-us-intro">
            We're here to make your turf booking experience seamless! Whether you have questions about booking a turf, 
            need help with our platform, or want to share feedback, the Turf-Ease team is ready to assist you.
          </p>
        </div>

        <div className="contact-us-content">
          <div className="contact-section">
            <h2>Get in Touch</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>Reach us at <a href="mailto:support@turfease.com">support@turfease.com</a> for quick responses.</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Phone</h3>
                  <p>Call or WhatsApp us at <a href="tel:+8801234567890">+880-123-456-7890</a> (Available 9 AM - 9 PM, daily).</p>
                </div>
              </div>


            </div>
          </div>

          <div className="feedback-section">
            <h2>Have Feedback or Suggestions?</h2>
            <p>
              We're a team of passionate students working to make Turf-Ease the best it can be. 
              Your ideas and feedback help us improve! Drop us a message, and let's make your sports experience even better.
            </p>
          </div>

          <div className="visit-section">
            <h2>Visit Us</h2>
            <p>
              Based in Sylhet, Bangladesh, we're proud to serve sports enthusiasts nationwide. 
              For partnerships or inquiries, email us at <a href="mailto:partnerships@turfease.com">partnerships@turfease.com</a>.
            </p>
          </div>

          <div className="cta-section">
            <h2>Ready to book your next game?</h2>
            <p>Let us know how we can help you hit the field with ease!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs