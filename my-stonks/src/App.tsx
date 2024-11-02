import React from 'react';
import logo from './logo.svg';
import './App.css';
import Portfolio from './portfolio/Portfolio';

function App() {
  return (
    <div className="container">
      <div className="section section1">Section 1</div>
      <div className="section section2">Section 2</div>
      <div className="section section3">Section 3</div>
      <div className="section section4">
        <Portfolio />
      </div>
    </div>

  );
}

export default App;
