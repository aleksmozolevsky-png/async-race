import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GarageView } from './components/Garage/GarageView';
import { WinnersView } from './components/Winners/WinnersView';

import type { RootState } from './store/store';

type View = 'garage' | 'winners';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('garage');
  const raceStatus = useSelector((state: RootState) => state.garage.raceStatus);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Async Race</h1>

      {/* Toggle buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setCurrentView('garage')}
          disabled={currentView === 'garage' || raceStatus === 'racing'}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            background: currentView === 'garage' ? '#1677ff' : '#f0f0f0',
            color: currentView === 'garage' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Garage
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('winners')}
          disabled={currentView === 'winners' || raceStatus === 'racing'}
          style={{
            padding: '8px 16px',
            background: currentView === 'winners' ? '#1677ff' : '#f0f0f0',
            color: currentView === 'winners' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Winners
        </button>
      </div>

      {/* Content of selected type */}
      <main>{currentView === 'garage' ? <GarageView /> : <WinnersView />}</main>
    </div>
  );
};

export default App;
