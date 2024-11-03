import 'nes.css/css/nes.min.css';
import './Info.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function IPOScenarioInfo() {
    const navigate = useNavigate(); // Initialize the navigate function
    return (
        <div>
            <Header />
            <div className="padded">
                <br />
                <h3 className="nes-text is-primary">IPO Excitement: A Quick Overview</h3>
                <br />

                In this scenario, you’ll experience the hype and risks of investing in a high-profile IPO (Initial Public Offering).
                <br />
                Take a minute to understand the game rules, and once you're ready, jump in and start trading!

                <br />
                <br />
                <div>
                    <div className="nes-container is-rounded">
                        <h4 className="nes-text is-warning">Game Rules:</h4>
                        <ul className='nes-list is-circle'>
                            <li>Play the market for <b>60 days</b>, navigating the IPO’s volatile launch period.</li>
                            <li>Your goal is to make a profit while managing the risks associated with new IPOs.</li>
                            <li>Watch for news alerts that impact IPO stock prices; they reflect the market’s reaction to events.</li>
                            <li>Use the "Hint" button for insights into IPO investment strategies.</li>
                            <li>Remember: IPOs can be unpredictable—be prepared for big swings in price!</li>
                            <li>Tip: Use the "Resume!" button to continue after reading an alert or hint!</li>
                        </ul>
                    </div>

                    <br />

                    <div className="nes-container is-rounded is-dark is-centered">
                        <h4 className="nes-text is-success">Investor Tips:</h4>
                        <ul className='nes-list is-circle'>
                            <li>Understand that IPOs are often highly volatile—don’t invest all your money in one stock!</li>
                            <li>Invest gradually instead of going all in; this helps manage risk.</li>
                            <li>Research the company behind the IPO: Strong fundamentals can indicate long-term stability.</li>
                            <li>Stay cautious—IPOs can have hype-driven spikes followed by price drops.</li>
                        </ul>
                    </div>
                </div>

                <br />
                <div className='centered-button'>
                    <button type="button" className="nes-btn is-success" onClick={() => navigate('/ipo-scenario')}>Start Playing! </button>
                </div>
            </div>
        </div>
    );
}

export default IPOScenarioInfo;
