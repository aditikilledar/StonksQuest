import React from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScenarioOne from './scenarios/ScenarioOne';
import ScenarioOneInfo from './scenarios/infos/ScenarioOneInfo';
import TechBoomOrBustScenario from './scenarios/TechBoomOrBustScenario'; // Assuming you have this scenario as well
import FinancialCrisisScenario from './scenarios/FinancialCrisisScenario'; // Uncommented this line

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home component at the root path */}
          <Route path="/" element={<Home />} />
          
          {/* Scenario-specific routes */}
          <Route path="/scenario-one" element={<ScenarioOneInfo />} />
          <Route path="/market-crash" element={<ScenarioOne />} />
          <Route path="/tech-boom" element={<TechBoomOrBustScenario />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
