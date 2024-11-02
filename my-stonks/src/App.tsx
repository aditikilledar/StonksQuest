import React from 'react';
import './App.css';
import Home from './components/home';

const App: React.FC = () => {
  const handleScenarioSelect = (scenario: string) => {
    console.log(`Selected ${scenario}`);
    // Add logic for each scenario here
  };

  const handleTest = () => {
    console.log('Running test scenario...');
    // Add test scenario logic here
  };

  return (
    <div>
      {/* <h1>Welcome to the Stock Market Simulator!</h1> */}
      <Home onScenarioSelect={handleScenarioSelect} onTest={handleTest} />
    </div>
  );
};

export default App;