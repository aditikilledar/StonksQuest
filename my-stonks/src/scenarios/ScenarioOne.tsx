import 'nes.css/css/nes.min.css';
import './ScenarioOne.css';
import Portfolio from '../components/Portfolio';
// import BuyStock from '../components/BuyStock';

function ScenarioOne() {
    return (
        <div className="container">
            {/* <header className="slogan nes-container is-dark">
        <h1 className="slogan-text">goal??</h1>
      </header> */}
            <div className="nes-container with-title">
                <h3 className='title'>Scenario</h3>
            </div>
            <div className="nes-container with-title">
                <h3 className='title'>Stock View</h3>
            </div>
            <div className="nes-container with-title">
                <h3 className='title'>Buy Stocks</h3>
                <p className='nes-text is-primary'>
                    {/* <BuyStock {stocksymbol, qty} /> */}
                </p>
            </div>
            <div className="nes-container with-title">
                {/* <h3 className='title'>Portfolio</h3><p className='nes-text is-primary'>Section 1</p> */}
                <Portfolio />
            </div>
        </div>
    );
}

export default ScenarioOne;
