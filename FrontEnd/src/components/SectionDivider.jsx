import React from 'react';
import './SectionDivider.css';

const SectionDivider = ({ label }) => (
  <div className="section-divider">
    <span>{label}</span>
  </div>
);

export default SectionDivider;