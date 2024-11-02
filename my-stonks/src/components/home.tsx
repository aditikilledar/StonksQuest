// StockSimulatorGame.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface GameProps {
  onScenarioSelect: (scenario: string) => void;
  onTest: () => void;
}

const Home: React.FC<GameProps> = ({ onScenarioSelect, onTest }) => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleScenarioClick = (scenario: string) => {
    onScenarioSelect(scenario); // Call the scenario selection function
    navigate('/scenario-one'); // Navigate to ScenarioOne
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Stock Market Simulator</h2>
      <div className="button-container">
        <button className="game-button" onClick={() => handleScenarioClick('Scenario 1')}>Scenario 1</button>
        <button className="game-button" onClick={() => handleScenarioClick('Scenario 2')}>Scenario 2</button>
        <button className="game-button" onClick={() => handleScenarioClick('Scenario 3')}>Scenario 3</button>
        <button className="game-button" onClick={() => handleScenarioClick('Scenario 4')}>Scenario 4</button>
        <button className="game-button test-button" onClick={onTest}>Test</button>
      </div>
    </div>
  );
};

export default Home;