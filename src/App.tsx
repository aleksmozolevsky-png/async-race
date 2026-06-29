import React from 'react';
import { GarageView } from './components/Garage/GarageView';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Async Race</h1>
      <main>
        <GarageView />
      </main>
    </div>
  );
};

export default App;