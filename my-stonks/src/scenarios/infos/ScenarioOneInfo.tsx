import 'nes.css/css/nes.min.css';
import './Info.css';

import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../components/Header';

function ScenarioOneInfo() {
    const navigate = useNavigate(); // Initialize the navigate function
    return (
        <div>
            <Header />
            <div className="padded">
                <br></br>
                <h3 className="nes-text is-primary">Stock Market Crashes: A Quick Overview</h3>
                <br></br>

                You will now play the market, during a market crash scenario.
                <br></br>
                Take a minute to understand the game rules.
                Once you're done reading, proceed to playing the game!

                <br></br>
                <br></br>
                <div>
                    <div className="nes-container is-rounded">
                        {/* What Caused the Crash?
                        <ul className='nes-list is-circle'>
                            <li>Housing prices soared as banks gave out risky loans.</li>
                            <li>Subprime mortgages went to borrowers who couldn’t pay them back.</li>
                            <li>Banks bundled these bad loans into investment products.</li>
                            <li>When homeowners defaulted, investments lost value.</li>
                            <li>The financial system toppled like a game of Jenga.</li>
                        </ul> */}

                        Game Rules:

                        <ul className='nes-list is-circle'>
                            <li>Play the market for <b>80 days</b>, during a market crash.</li>
                            <li>Your goal is to make a profit by making smart investment decisions.</li>
                            <li>Pay attention to alerts. They affect the market.</li>
                            <li>Use the hint button to learn more and drive your decisions.</li>
                            <li>Remember: Buy when it's cheap, Sell when it's not.</li>
                            <li>Tip: There's a "Resume!" button to resume after an alert!</li>
                        </ul>

                    </div>


                    {/* <div className="nes-container is-rounded">
                    Then what happened?
                    <ul className='nes-list is-circle'>
                        <li>Stocks took a nosedive, losing a ton of value.</li>
                        <li>Lots of companies went belly up, causing huge job losses.</li>
                        <li>Home prices plummeted, leaving folks with houses worth less than what they owed.</li>
                        <li>The government swooped in with cash to save the day.</li>
                    </ul>
                </div> */}
                </div>
                <br></br>
                <div className="nes-container is-rounded is-dark is-centered">
                    Investor Tips:
                    <ul className='nes-list is-circle'>
                        <li>Keep your cool; don’t panic sell your stocks!</li>
                        <li>Spread out your investments to minimize risk.</li>
                        <li>Stick to solid companies that are more reliable.</li>
                        <li>Use dips in the market to snag great stocks at lower prices.</li>
                    </ul>

                </div>
                <br></br>
                <br></br>
                <div className='centered-button'>
                    <button type="button" className="nes-btn is-success" onClick={() => navigate('/market-crash')}>Start Playing! </button>
                </div>
            </div>

        </div>
    );
}

export default ScenarioOneInfo;
