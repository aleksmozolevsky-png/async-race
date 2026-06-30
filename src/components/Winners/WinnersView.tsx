import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchWinnersThunk, setWinnersPage, setSorting } from '../../store/winnersSlice';

export const WinnersView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { winners, totalCount, currentPage, sort, order, loading, error} = useSelector((state: RootState) => state.winners);

  useEffect(() => {
    dispatch(fetchWinnersThunk());
  }, [dispatch, currentPage, sort, order]);

  const handleSort = (field: 'wins' | 'time') => {
    dispatch(setSorting(field));
  };

  const renderSortArrow = (field: 'wins' | 'time') => {
    if (sort !== field) return '';
    return order === 'ASC' ? ' ▲' : ' ▼';
  };
  if (error) return <p style={{ color: '#ff4d4f' }}>Error: {error}</p>;
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Winners ({totalCount})</h2>
      <h3>Page #{currentPage}</h3>

      {loading ? <p>Loading leaderboard...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', background: '#f5f5f5' }}>
              <th style={{ padding: '10px' }}>Number</th>
              <th style={{ padding: '10px' }}>Car Model</th>
              <th style={{ padding: '10px' }}>Car View</th>
              <th style={{ padding: '10px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('wins')}>Wins{renderSortArrow('wins')}</th>
              <th style={{ padding: '10px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('time')}>Best Time (s){renderSortArrow('time')}</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={winner.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{(currentPage - 1) * 10 + index + 1}</td>
                <td style={{ padding: '10px', fontWeight: 600 }}>{winner.car.name}</td>
                <td style={{ padding: '10px' }}>
                  <svg width="35" height="18" viewBox="0 0 40 20" style={{ fill: winner.car.color }}>
                    <rect width="40" height="12" y="4" rx="3" />
                    <circle cx="10" cy="16" r="4" fill="#000" />
                    <circle cx="30" cy="16" r="4" fill="#000" />
                  </svg>
                </td>
                <td style={{ padding: '10px' }}>{winner.wins}</td>
                <td style={{ padding: '10px' }}>{winner.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="button" disabled={currentPage === 1} onClick={() => dispatch(setWinnersPage(currentPage - 1))}>Prev</button>
        <button type="button" disabled={currentPage * 10 >= totalCount} onClick={() => dispatch(setWinnersPage(currentPage + 1))}>Next</button>
      </div>
    </div>
  );
};