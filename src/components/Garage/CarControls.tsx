import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { createCarThunk, updateCarThunk, generateCarsThunk, selectCar, startRace, resetRace } from '../../store/garageSlice';

export const CarControls: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCar, raceStatus, winnerName, winnerTime } = useSelector((state: RootState) => state.garage);

  const [createName, setCreateName] = useState('');
  const [createColor, setCreateColor] = useState('#ffffff');
  const [updateName, setUpdateName] = useState('');
  const [updateColor, setUpdateColor] = useState('#ffffff');

  useEffect(() => {
    if (selectedCar) {
      setUpdateName(selectedCar.name);
      setUpdateColor(selectedCar.color);
    }
  }, [selectedCar]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    dispatch(createCarThunk({ name: createName, color: createColor }));
    setCreateName('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar || !updateName.trim()) return;
    dispatch(updateCarThunk({ id: selectedCar.id, car: { name: updateName, color: updateColor } }));
    dispatch(selectCar(null));
    setUpdateName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Car name" value={createName} onChange={(e) => setCreateName(e.target.value)} />
        <input type="color" value={createColor} onChange={(e) => setCreateColor(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Select car first" disabled={!selectedCar} value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
        <input type="color" disabled={!selectedCar} value={updateColor} onChange={(e) => setUpdateColor(e.target.value)} />
        <button type="submit" disabled={!selectedCar}>Update</button>
      </form>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => dispatch(generateCarsThunk())}>Generate 100 Cars</button>
        <button type="button" disabled={raceStatus === 'racing' || raceStatus === 'finished'} onClick={() => dispatch(startRace())} style={{ background: '#1890ff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>RACE</button>
        <button type="button" disabled={raceStatus === 'ready'} onClick={() => dispatch(resetRace())} style={{ background: '#d9d9d9', color: '#333', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>RESET</button>
      </div>

      {winnerName && (
        <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', background: '#52c41a', color: '#fff', padding: '20px 40px', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000 }}>
          Winner: 
          <br />
          {winnerName}
          <br />
          Time: {winnerTime} S
        </div>
      )}
    </div>
  );
};