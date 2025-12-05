import React from 'react';
import './AboutUs.css';
import aiasPhoto from '../assets/ABOUT US/AIAS.JPG';
import akifPhoto from '../assets/ABOUT US/AKIF.JPG';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-container">
        <h1 className="about-title">About Us</h1>

        <div className="website-info">
          <div className="welcome-section">
            <p className="welcome-text">
              Welcome to Turf-Ease, your go-to platform for seamless turf booking! We're a team of passionate innovators dedicated to transforming the way you book sports facilities, making it quick, easy, and reliable.
            </p>
          </div>

          <div className="mission-section">
            <h3>Our Mission</h3>
            <p>
              At Turf-Ease, we aim to empower sports enthusiasts by providing a user-friendly platform to book top-quality turfs effortlessly. Whether you're organizing a friendly match or a competitive tournament, we're here to ensure you spend more time playing and less time planning.
            </p>
          </div>

          <div className="features-section">
            <h3>Why Choose Turf-Ease?</h3>
            <div className="features-grid">
              <div className="feature-item">
                <h4>Simple & Fast Booking</h4>
                <p>Reserve your turf in just a few clicks, anytime, anywhere.</p>
              </div>
              <div className="feature-item">
                <h4>Premium Facilities</h4>
                <p>Access a curated network of high-quality turf venues.</p>
              </div>
              <div className="feature-item">
                <h4>Reliable Support</h4>
                <p>Our dedicated team is available 24/7 to assist you.</p>
              </div>
              <div className="feature-item">
                <h4>Community Focus</h4>
                <p>We're building a vibrant community of players who share a love for sports.</p>
              </div>
            </div>
          </div>

          <div className="story-section">
            <h3>Our Story</h3>
            <p>
              Turf-Ease was founded by Mohammad Aias Rahman and Mahir Mohtasin Akif, two driven third-year students from the Department of Computer Science and Engineering at Shahjalal University of Science and Technology. As avid sports lovers and tech enthusiasts, we recognized the need for a modern, efficient solution to the challenges of booking sports facilities. Combining our expertise in software development with a passion for sports, we created Turf-Ease to simplify the booking process and elevate the playing experience for everyone.
            </p>
          </div>

          <div className="vision-section">
            <h3>Our Vision</h3>
            <p>
              We envision Turf-Ease as more than just a booking platform—it's a community where players connect, compete, and celebrate the joy of sports. With cutting-edge technology and a commitment to excellence, we're here to make every game unforgettable.
            </p>
            <p className="call-to-action">
              Join Turf-Ease today and kick off your next match with ease!
            </p>
          </div>
        </div>

        <div className="team-title">
          <h2>Meet Our Team</h2>
          <p>The passionate developers behind Turf Ease</p>
        </div>

        <div className="developers-section">
          <div className="developer-card developer-left">
            <div className="developer-info">
              <h2 className="developer-name">Mohammad Aias Rahman</h2>
              <p className="developer-details">
                Currently studying in 3rd year at the Department of Computer Science and Engineering
                in Shahjalal University of Science and Technology.
              </p>
              <a
                href="https://ayas300.github.io/my-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                View Portfolio →
              </a>
            </div>
            <div className="developer-photo">
              <img
                src={aiasPhoto}
                alt="Mohammad Aias Rahman"
                className="developer-image"
              />
            </div>
          </div>

          <div className="developer-card developer-right">
            <div className="developer-photo">
              <img 
                src={akifPhoto} 
                alt="Mahir Mohtasim Akif" 
                className="developer-image"
              />
            </div>
            <div className="developer-info">
              <h2 className="developer-name">Mahir Mohtasim Akif</h2>
              <p className="developer-details">
                Currently studying in 3rd year at the Department of Computer Science and Engineering
                in Shahjalal University of Science and Technology.
              </p>
              <a
                href="https://2021331101akif.github.io/Github-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                View Portfolio →
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AboutUs;