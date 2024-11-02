import React from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScenarioOne from './scenarios/ScenarioOne'; // Import the ScenarioOne component
import FinancialCrisisScenario from './scenarios/FinancialCrisisScenario';

const App: React.FC = () => {
  // const handleScenarioSelect = (scenario: string) => {
  //   console.log(`Selected ${scenario}`);
  //   // Add logic for each scenario here
  // };

  // const handleTest = () => {
  //   console.log('Running test scenario...');
  //   // Add test scenario logic here
  // };
  return (
    <Router>
      <div>
        <Routes>
          {/* The Home component will be shown at the root path */}
          <Route path="/" element={<Home onScenarioSelect={() => { }} onTest={() => { }} />} />
          {/* The ScenarioOne component will be shown when navigating to /scenario-one */}
          <Route path="/scenario-one" element={<FinancialCrisisScenario />} />
          {/* <Route path="/" */}
        </Routes>
      </div>
    </Router>
  );



  // return (
  //   <div>
  //     {/* <h1>Welcome to the Stock Market Simulator!</h1> */}
  //     <Home onScenarioSelect={handleScenarioSelect} onTest={handleTest} />
  //   </div>
  // );
};

export default App;