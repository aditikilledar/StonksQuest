// StockSimulatorGame.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface GameProps {
  onScenarioSelect: (scenario: string) => void;
  onTest: () => void;
}

const Home: React.FC<GameProps> = ({ onScenarioSelect, onTest }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="game-container">
      <h2 className="game-title">Stock Market Simulator</h2>
      <div className="button-container">
        <button className="game-button" onClick={() => navigate('/scenario-one')}>Scenario 1</button>
        <button className="game-button" onClick={() => navigate('/scenario-two')}>Scenario 2</button>
        <button className="game-button" onClick={() => navigate('/scenario-three')}>Scenario 3</button>
        <button className="game-button" onClick={() => navigate('/scenario-four')}>Scenario 4</button>
        <button className="game-button test-button" onClick={onTest}>Test</button>
      </div>
    </div>
  );
};

export default Home;