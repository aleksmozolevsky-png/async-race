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
  const [leftPos, setLeftPos] = useState('10px');
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
      setLeftPos('calc(100% - 130px)');

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
    const currentLeft = computedStyle.left;
    
    setIsBroken(true);
    setLeftPos(currentLeft);
    carRef.current.style.left = currentLeft; 
  };

  const handleReset = async () => {
    await api.toggleEngine(car.id, 'stopped');
    setIsDriving(false);
    setIsBroken(false);
    setDuration(0);
    setLeftPos('10px');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '60px', borderBottom: '1px solid #333', background: '#232329' }}>
      
      {/* Left control panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', minWidth: '140px', padding: '0 10px', height: '100%', background: '#1a1a1f', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button type="button" onClick={() => onSelect(car)} style={{ fontSize: '10px', padding: '2px 4px', cursor: 'pointer' }}>SEL</button>
          <button type="button" onClick={() => onDelete(car.id)} style={{ fontSize: '10px', padding: '2px 4px', cursor: 'pointer' }}>DEL</button>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button type="button" disabled={isDriving || isBroken || raceStatus === 'racing'} onClick={handleStart} style={{ background: '#52c41a', color: '#fff', border: 'none', borderRadius: '3px', width: '26px', height: '34px', cursor: 'pointer', fontWeight: 'bold' }}>A</button>
          <button type="button" disabled={(!isDriving && !isBroken) || raceStatus === 'racing'} onClick={handleReset} style={{ background: '#f5222d', color: '#fff', border: 'none', borderRadius: '3px', width: '26px', height: '34px', cursor: 'pointer', fontWeight: 'bold' }}>B</button>
        </div>
      </div>

      {/* Track */}
      <div style={{ flexGrow: 1, height: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
        
        {/* Start lane */}
        <div style={{ position: 'absolute', left: '52px', top: 0, bottom: 0, width: '4px', background: '#ff4d4f', zIndex: 1 }} />

        {/* Car name */}
        <span style={{ position: 'absolute', left: '70px', fontSize: '20px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.66)', textTransform: 'uppercase', letterSpacing: '2px', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none' }}>
          {car.name}
        </span>

        {/* Finish lane */}
        <div style={{ position: 'absolute', right: '80px', top: 0, bottom: 0, width: '6px', background: '#52c41a' }} />
        
        {/* Car */}
        <div 
          ref={carRef}
          style={{ 
            position: 'absolute',
            left: leftPos,
            transition: isDriving && !isBroken ? `left ${duration}s linear` : 'none',
            display: 'flex',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <svg width="42" height="20" viewBox="0 0 40 20" style={{ fill: isBroken ? '#ff4d4f' : car.color }}>
            <rect width="40" height="12" y="4" rx="3" />
            <circle cx="10" cy="16" r="4" fill="#000" />
            <circle cx="30" cy="16" r="4" fill="#000" />
          </svg>
          
          {isBroken && (
            <span style={{ fontSize: '10px', color: '#fff', background: '#ff4d4f', padding: '2px 5px', borderRadius: '3px', marginLeft: '6px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              Boom
            </span>
          )}
        </div>

      </div>
    </div>
  );
};