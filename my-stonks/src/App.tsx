import React from 'react';
import logo from './logo.svg';
import 'nes.css/css/nes.min.css';
import './App.css';
import Portfolio from './portfolio/Portfolio';

<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
</style>

function App() {
  return (
    <div className="container">
      {/* <header className="slogan nes-container is-dark">
        <h1 className="slogan-text">goal??</h1>
      </header> */}
      <div className="nes-container with-title">
        <h3 className='title'>Stocks View</h3><p className='nes-text is-primary'>Section 1</p>
      </div>
      <div className="nes-container with-title">
        <h3 className='title'>Scenario</h3><p className='nes-text is-primary'>Section 1</p>
      </div>
      <div className="nes-container with-title">
        <h3 className='title'>Buy Stocks</h3><p className='nes-text is-primary'>Section 1</p>
      </div>
      <div className="nes-container with-title">
        <h3 className='title'>Portfolio</h3><p className='nes-text is-primary'>Section 1</p>
        <Portfolio />
      </div>
    </div>

  );
}

export default App;
