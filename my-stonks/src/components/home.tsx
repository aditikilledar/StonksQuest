// StockSimulatorGame.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// interface GameProps {
//   onScenarioSelect: (scenario: string) => void;
//   onTest: () => void;
// }

const Home: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="game-container">
      <h1 style={{ color: 'yellow', fontSize: 72 }}>StonkQuest</h1>
      <h3 className="game-title">Practice Stock Market Scenarios</h3>
      <div className="button-container">
        <button className="game-button" onClick={() => navigate('/scenario-one')}>Market Crash Scenario</button>
        <button className="game-button" onClick={() => navigate('/scenario-two')}>Scenario 2</button>
        <button className="game-button" onClick={() => navigate('/scenario-three')}>Scenario 3</button>
        <button className="game-button" onClick={() => navigate('/scenario-four')}>Scenario 4</button>

        {/* <button className="game-button test-button" onClick={onTest}>Test</button> */}
        <button className="game-button test-button" onClick={() => navigate('/test')}>Test</button>

      </div>
    </div>
  );
};

export default Home;