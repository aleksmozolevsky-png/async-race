import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars, removeCarThunk, setPage } from '../../store/garageSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { CarTrack } from './CarTrack';

export const GarageView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, totalCount, currentPage, loading } = useSelector(
    (state: RootState) => state.garage
  );

  useEffect(() => {
    dispatch(fetchCars(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return (
    <div>
      <h2>Garage ({totalCount})</h2>
      <h3>Page #{currentPage}</h3>

      {loading && <p>Loading cars...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {cars.map((car) => (
          <CarTrack 
            key={car.id} 
            car={car} 
            onDelete={(id) => dispatch(removeCarThunk(id))} 
          />
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          type="button" 
          disabled={currentPage === 1} 
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <button 
          type="button" 
          disabled={currentPage * 7 >= totalCount} 
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};