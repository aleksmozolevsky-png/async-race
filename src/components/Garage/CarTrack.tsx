import React from 'react';
import type { Car } from '../../types';

interface CarTrackProps {
  car: Car;
  onDelete: (id: number) => void;
}

export const CarTrack: React.FC<CarTrackProps> = ({ car, onDelete }) => {
  return (
    <div style={{ borderBottom: '1px dashed #ccc', padding: '10px 0' }}>
      {/* Individual car control panel */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
        <button type="button">Select</button>
        <button type="button" onClick={() => onDelete(car.id)}>Remove</button>
        <strong>{car.name}</strong>
      </div>

      {/* Route and start button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button type="button">A</button>
        <button type="button" disabled>B</button>
        
        {/* Machine icon (painted in color from the database) */}
        <div style={{ fontSize: '24px', transform: 'translateX(0px)', transition: 'transform 0.1s' }}>
          <svg width="40" height="20" viewBox="0 0 40 20" style={{ fill: car.color }}>
            <rect width="40" height="12" y="4" rx="3" />
            <circle cx="10" cy="16" r="4" fill="#000" />
            <circle cx="30" cy="16" r="4" fill="#000" />
          </svg>
        </div>
      </div>
    </div>
  );
};