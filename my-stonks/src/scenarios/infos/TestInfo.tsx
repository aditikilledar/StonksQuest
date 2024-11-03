import 'nes.css/css/nes.min.css';
import './Info.css';

import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function TechInfo() {
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div className="padded">
                <br></br>
                <h3 className="nes-text is-primary">Tech Boom or Bust: A Quick Overview</h3>
                <br></br>
                The tech industry is booming with innovation, but new challenges are emerging.
                Take a minute to understand the risks and rewards of investing in tech stocks.
                When you're ready, dive into the game to experience the volatility firsthand!

                <br></br>
                <br></br>
                <div>
                    <div className="nes-container is-rounded">
                        Why Tech Stocks Are So Wild:
                        <ul className='nes-list is-circle'>
                            <li>Cool new tech boosts stock prices—who doesn’t love AI?</li>
                            <li>But new laws? Yikes! They make stocks drop fast.</li>
                            <li>Big competition = big moves. Everyone’s racing to be #1!</li>
                            <li>One news headline can send prices soaring... or crashing!</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <div className="nes-container is-rounded is-dark is-centered">
                    Investor Tips:
                    <ul className='nes-list is-circle'>
                        <li>Avoid investing based on hype—focus on long-term growth potential.</li>
                        <li>Diversify your portfolio to reduce sector-specific risks.</li>
                        <li>Pay attention to regulatory news that may impact tech giants.</li>
                        <li>Use market dips as opportunities to invest strategically.</li>
                    </ul>
                </div>
                <br></br>
                <br></br>
                <div className='centered-button'>
                    <button type="button" className="nes-btn is-success" onClick={() => navigate('/testScenario')}>Start Playing!</button>
                </div>
            </div>
        </div>
    );
}

export default TechInfo;
