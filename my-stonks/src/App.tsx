import React from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScenarioOne from './scenarios/ScenarioOne'; 
import TechBoomOrBustScenario from './scenarios/testScenario';
import ScenarioOneInfo from './scenarios/infos/ScenarioOneInfo';
import TestInfo from './scenarios/infos/TestInfo'

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Home component at the root path */}
          <Route path="/StonkQuest" element={<Home />} />
          
          {/* Scenario-specific routes */}
          <Route path="/scenario-one" element={<ScenarioOneInfo />} />
          <Route path="/market-crash" element={<ScenarioOne />} />
          <Route path="/test" element={<TestInfo />} />
          <Route path="/testScenario" element={<TechBoomOrBustScenario />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
