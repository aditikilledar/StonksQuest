import React from 'react';
import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScenarioOne from './scenarios/ScenarioOne';
import TechBoomOrBustScenario from './scenarios/testScenario';
import ScenarioOneInfo from './scenarios/infos/ScenarioOneInfo';
import ScenarioTwoInfo from './scenarios/infos/ScenarioTwoInfo';
import ScenarioFourInfo from './scenarios/infos/ScenarioFourInfo';
import TestInfo from './scenarios/infos/TestInfo';
import ScenarioTwo from './scenarios/ScenarioTwo';
import ScenarioFour from './scenarios/ScenarioFour';
import IPOScenarioInfo from './scenarios/infos/IPOScenarioInfo';
import IPOScenario from './scenarios/IpoScenario';


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

          <Route path="/scenario-two" element={<ScenarioTwoInfo />} />
          <Route path="/ipo-scenario" element={<IPOScenario />} />
          <Route path="/ipo-scenario-info" element={<IPOScenarioInfo />} />
          <Route path="/merger" element={<ScenarioTwo />} />

          <Route path="/scenario-four" element={<ScenarioFourInfo />} />
          <Route path="/earnings-report" element={<ScenarioFour />} />

          <Route path="/test" element={<TestInfo />} />
          <Route path="/testScenario" element={<TechBoomOrBustScenario />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
