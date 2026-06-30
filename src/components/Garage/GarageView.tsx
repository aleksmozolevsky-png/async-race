import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars, removeCarThunk, setPage, selectCar, resetRace } from '../../store/garageSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { CarTrack } from './CarTrack';
import { CarControls } from './CarControls';

export const GarageView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, totalCount, currentPage, loading, winnerName, winnerTime, raceStatus } =
    useSelector((state: RootState) => state.garage);

  useEffect(() => {
    dispatch(fetchCars(currentPage));
  }, [dispatch, currentPage]);

  useEffect(
    () => () => {
      dispatch(resetRace());
    },
    [dispatch]
  );

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return (
    <div style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
      <div>
        <CarControls />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--text-h)' }}>Garage ({totalCount})</h2>
        <h3 style={{ margin: 0, color: 'var(--text)' }}>Page #{currentPage}</h3>
      </div>

      {loading && <p style={{ color: 'var(--text)' }}>Loading cars...</p>}

      {/* Rrelative container for storing the track and the popup */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Horizontal scroll */}
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div
            style={{
              minWidth: '1000px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--track-bg)',
            }}
          >
            {cars.length === 0 && !loading ? (
              <div
                style={{
                  padding: '50px 20px',
                  textAlign: 'center',
                  color: 'var(--text)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                Your garage is empty. Create some epic cars above to start the race!
              </div>
            ) : (
              cars.map((car) => (
                <CarTrack
                  key={car.id}
                  car={car}
                  onDelete={(id) => dispatch(removeCarThunk(id))}
                  onSelect={(selected) => dispatch(selectCar(selected))}
                />
              ))
            )}
          </div>
        </div>

        {/* Semitransparent winner popup */}
        {winnerName && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--popup-bg)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              border: '3px solid var(--accent)',
              color: '#fff',
              padding: '25px 50px',
              borderRadius: '12px',
              fontSize: '22px',
              fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: 'var(--shadow)',
              zIndex: 100,
              pointerEvents: 'none',
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ color: 'var(--accent)', fontSize: '26px' }}>WINNER!</span>
            <div style={{ margin: '10px 0', fontSize: '28px', textTransform: 'uppercase' }}>
              {winnerName}
            </div>
            <div style={{ color: 'var(--text)', fontSize: '16px' }}>Time: {winnerTime} s</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          disabled={currentPage === 1 || raceStatus === 'racing'}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <button
          type="button"
          disabled={currentPage * 7 >= totalCount || raceStatus === 'racing'}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
