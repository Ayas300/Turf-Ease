import React from 'react';
import { useNavigate } from 'react-router-dom';
import TurfCard from './TurfCard';
import './TurfGrid.css';

function TurfGrid({ turfs }) {
  const navigate = useNavigate();

  const handleViewMoreTurfs = () => {
    navigate('/turfs');
  };

  return (
    <div className="turf-grid-new">
      {turfs.slice(0, 6).map(turf => (
        <TurfCard key={turf.id} turf={turf} />
      ))}
      <div className="view-more-container">
        <button className="view-more-btn" onClick={handleViewMoreTurfs}>
          <span>View More Turfs</span>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TurfGrid;