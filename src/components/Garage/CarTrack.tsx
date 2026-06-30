import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../api/api';
import type { Car } from '../../types';
import type { RootState, AppDispatch } from '../../store/store';
import { setRaceWinner, saveWinnerThunk } from '../../store/garageSlice';

interface CarTrackProps {
  car: Car;
  onDelete: (id: number) => void;
  onSelect: (car: Car) => void;
}

export const CarTrack: React.FC<CarTrackProps> = ({ car, onDelete, onSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const raceStatus = useSelector((state: RootState) => state.garage.raceStatus);

  const [isDriving, setIsDriving] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [duration, setDuration] = useState(0);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (raceStatus === 'racing' && !isDriving && !isBroken) {
      handleStart();
    } else if (raceStatus === 'ready') {
      handleReset();
    }
  }, [raceStatus]);

  const handleStart = async () => {
    try {
      setIsBroken(false);
      const { velocity, distance } = await api.toggleEngine(car.id, 'started');
      const timeInMs = distance / velocity;
      
      setDuration(timeInMs / 1000);
      setIsDriving(true);

      const finishTimeout = setTimeout(() => {
        setIsDriving((currentDriving) => {
          setIsBroken((currentBroken) => {
            if (currentDriving && !currentBroken) {
              const timeInSeconds = parseFloat((timeInMs / 1000).toFixed(2));
              dispatch(setRaceWinner({ id: car.id, name: car.name, time: timeInSeconds }));
              dispatch(saveWinnerThunk({ id: car.id, time: timeInSeconds }));
            }
            return currentBroken;
          });
          return currentDriving;
        });
      }, timeInMs);

      const driveRes = await api.driveCar(car.id);
      if (!driveRes.success) {
        clearTimeout(finishTimeout);
        handleBreakdown();
      }
    } catch {
      handleBreakdown();
    }
  };

  const handleBreakdown = () => {
    if (!carRef.current) return;
    const computedStyle = window.getComputedStyle(carRef.current);
    setIsBroken(true);
    carRef.current.style.left = computedStyle.left;
  };

  const handleReset = async () => {
    await api.toggleEngine(car.id, 'stopped');
    setIsDriving(false);
    setIsBroken(false);
    setDuration(0);
    if (carRef.current) carRef.current.style.left = '0%';
  };

  return (
    <div style={{ borderBottom: '2px dashed #e0e0e0', padding: '15px 0', minWidth: '460px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
        <button type="button" onClick={() => onSelect(car)}>Select</button>
        <button type="button" onClick={() => onDelete(car.id)}>Remove</button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{car.name}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button type="button" disabled={isDriving || isBroken || raceStatus === 'racing'} onClick={handleStart} style={{ background: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>A</button>
          <button type="button" disabled={(!isDriving && !isBroken) || raceStatus === 'racing'} onClick={handleReset} style={{ background: '#f5222d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>B</button>
        </div>
        
        <div style={{ flexGrow: 1, height: '30px', background: '#f0f0f0', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '50px', top: 0, width: '10px', height: '10px', background: '#000', zIndex: 1 }} />
          <div style={{ position: 'absolute', right: '55px', top: '10px', width: '2px', height: '20px', background: '#ccc', zIndex: 1 }} />
          
          <div 
            ref={carRef}
            style={{ 
              position: 'absolute',
              top: '5px',
              left: isDriving && !isBroken ? 'calc(100% - 90px)' : '0%',
              transition: isDriving && !isBroken ? `left ${duration}s linear` : 'none',
              display: 'flex',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <svg width="40" height="20" viewBox="0 0 40 20" style={{ fill: isBroken ? '#ff4d4f' : car.color }}>
              <rect width="40" height="12" y="4" rx="3" />
              <circle cx="10" cy="16" r="4" fill="#000" />
              <circle cx="30" cy="16" r="4" fill="#000" />
            </svg>
            {isBroken && <span style={{ fontSize: '11px', color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px', whiteSpace: 'nowrap' }}>БУМ</span>}
          </div>
        </div>
      </div>
    </div>
  );
};