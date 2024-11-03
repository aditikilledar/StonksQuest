import 'nes.css/css/nes.min.css';
import './Info.css';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function ScenarioFourInfo() {
    const navigate = useNavigate();
    return (
        <div>
            <Header />
            <div className="padded">
                <br></br>
                <h3 className="nes-text is-primary">Earnings Report Impact: Analyzing Financial Performance</h3>
                <br></br>

                In this scenario, a company in your portfolio has released its quarterly earnings report, which has led to immediate stock price movements.
                <br></br>
                Take a moment to understand the rules before you start making your investment decisions!
                <br></br>
                <br></br>
                <div>
                    <div className="nes-container is-rounded">
                        Game Rules:
                        <ul className='nes-list is-circle'>
                            <li>Your objective is to maximize profit by analyzing the company's earnings report.</li>
                            <li>Follow alerts on the report to gauge market sentiment and short-term impacts on stock price.</li>
                            <li>Use the hint button for insights into how earnings reports generally affect the market.</li>
                            <li>Decide whether to buy more, hold, or sell your shares based on the company's financial performance.</li>
                            <li>Remember: Once money is invested, it remains tied up, so plan your moves carefully!</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <div className="nes-container is-rounded is-dark is-centered">
                    Investor Tips:
                    <ul className='nes-list is-circle'>
                        <li>Don’t overreact! Look closely at the company's growth metrics, profit margins, and outlook.</li>
                        <li>Consider holding if the company has solid fundamentals, even if short-term results are mixed.</li>
                        <li>Sell if you notice red flags, like declining revenue or increasing debt.</li>
                        <li>Use dips to buy more if the company's long-term prospects remain strong.</li>
                    </ul>
                </div>
                <br></br>
                <br></br>
                <div className='centered-button'>
                    <button type="button" className="nes-btn is-success" onClick={() => navigate('/earnings-report')}>Start Playing! </button>
                </div>
            </div>
        </div>
    );
}

export default ScenarioFourInfo;
