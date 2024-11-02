import React from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ScenarioOne from './scenarios/ScenarioOne'; // Import the ScenarioOne component

const App: React.FC = () => {
  const handleScenarioSelect = (scenario: string) => {
    console.log(`Selected ${scenario}`);
    // Add logic for each scenario here
  };

  const handleTest = () => {
    console.log('Running test scenario...');
    // Add test scenario logic here
  };
  return(
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/scenario-one">Scenario One</Link> {/* Link to ScenarioOne */}
            </li>
          </ul>
        </nav>
    
        <Routes>
          <Route path="/" element={<Home onScenarioSelect={handleScenarioSelect} onTest={handleTest}/>} /> {/* Home component route */}
          <Route path="/scenario-one" element={<ScenarioOne />} /> {/* ScenarioOne component route */}
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