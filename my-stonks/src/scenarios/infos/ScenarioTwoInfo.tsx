import 'nes.css/css/nes.min.css';
import './Info.css';
import Portfolio from '../../components/Portfolio';
import BuyStock from '../../components/BuyStock';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function ScenarioTwoInfo() {
    const navigate = useNavigate();
    return (
        <div>
            <Header />
            <div className="padded">
                <br></br>
                <h3 className="nes-text is-primary">Mergers & Acquisitions (M&A): Strategic Moves</h3>
                <br></br>

                In this scenario, you’ll navigate a company merger. Your portfolio includes a company that’s merging with another, causing stock fluctuations.
                <br></br>
                Take a moment to understand the rules before diving into the game!
                <br></br>
                <br></br>
                <div>
                    <div className="nes-container is-rounded">
                        Game Rules:
                        <ul className='nes-list is-circle'>
                            <li>Your goal: make a profit as the merger progresses and affects stock prices.</li>
                            <li>Track news and alerts about the merger to inform your investment decisions.</li>
                            <li>Use the hint button for tips on market reactions in each phase of the merger.</li>
                            <li>Decide whether to hold, buy more, or sell your shares based on stock performance.</li>
                            <li>Remember: Money invested once is locked in, so strategize carefully!</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <div className="nes-container is-rounded is-dark is-centered">
                    Investor Tips:
                    <ul className='nes-list is-circle'>
                        <li>Don’t rush! Mergers are unpredictable—monitor each phase carefully.</li>
                        <li>Look for synergies and growth opportunities but beware of integration risks.</li>
                        <li>Consider holding if the company is strong, but sell if uncertainty grows.</li>
                        <li>Use market dips strategically to increase your holdings if the stock seems promising.</li>
                    </ul>
                </div>
                <br></br>
                <br></br>
                <div className='centered-button'>
                    <button type="button" className="nes-btn is-success" onClick={() => navigate('/merger')}>Start Playing! </button>
                </div>
            </div>
        </div>
    );
}

export default ScenarioTwoInfo;
