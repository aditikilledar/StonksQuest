import 'nes.css/css/nes.min.css';
import './ScenarioOne.css';
import Portfolio from '../../components/Portfolio';
import BuyStock from '../../components/BuyStock';

function ScenarioOneInfo() {
    return (
        <div className="container">
            {/* <header className="slogan nes-container is-dark">
        <h1 className="slogan-text">goal??</h1>
      </header> */}
            <div className="nes-container with-title">
                <p className='title'>2008 Stock Market Crash: A Quick Overview</p>

                In 2008, the stock market collapsed, sparking a global financial crisis. Here’s a breakdown of what happened, why it mattered, and what investors generally do in such situations.

                #### What Caused the Crash?
                1. **Housing Bubble**: U.S. banks gave out too many risky home loans, creating a “bubble” where house prices were unrealistically high.
                2. **Subprime Mortgages**: Many of these loans went to people with low credit scores who couldn’t reliably repay them.
                3. **Mortgage-Backed Securities**: Banks bundled these risky loans into investment products. When homeowners defaulted, these investments lost value rapidly, leading to huge losses for banks and investors.

                #### The Effects
                - **Stock Market Plunge**: U.S. stocks lost half of their value, affecting global markets.
                - **High Unemployment**: Many companies failed, leading to massive job losses.
                - **Housing Market Crash**: House prices dropped significantly, leaving many people with homes worth less than their mortgages.
                - **Government Bailouts**: The U.S. government stepped in with financial aid to prevent a deeper collapse.

                #### Investor Tips During a Market Crash
                1. **Stay Calm**: Avoid panic selling. Many investors lose more by selling stocks at a low.
                2. **Diversify**: Spread investments across sectors, so if one fails, others may hold up.
                3. **Focus on Quality**: Stick to stable, reliable companies that are more likely to weather downturns.
                4. **Look for Opportunities**: Market dips can be a chance to buy strong stocks at a lower price.

                Understanding these basics can help investors respond thoughtfully in a crisis rather than react out of fear.
            </div>
        </div>
    );
}

export default ScenarioOneInfo;
