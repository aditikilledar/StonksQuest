import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioOne.css';
import Portfolio from '../components/Portfolio';
import { Line } from 'react-chartjs-2';
import Header from '../components/Header';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Stock {
    shares: number;
}

interface PortfolioI {
    cash: number;
    stocks: Stock[];
}

const ScenarioOne: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100],
        [120],
        [80]
    ]);

    const [portfolio, setPortfolio] = useState<PortfolioI>({
        cash: 1000,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });

    const [paused, setPaused] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [shownAlerts, setShownAlerts] = useState<Set<number>>(new Set());
    const [activeDialog, setActiveDialog] = useState<number | null>(null);

    const timelineMessages = [
        { day: 10, message: "Housing market weakens as home prices start to fall." },
        { day: 27, message: "Mortgage defaults rise, hitting banks with losses." },
        { day: 35, message: "Lehman Brothers collapses, triggering panic." },
        { day: 42, message: "Global markets plunge as fears of recession grow." },
        { day: 50, message: "Government bailouts aim to stabilize the market." },
        { day: 60, message: "Early signs of recovery as market stabilizes." }
    ];

    const stockSymbols = ["Stock A", "Stock B", "Stock C"];

    const hints = [
        // Days 0-20: Housing market weakens as home prices start to fall.
        { dayStart: 0, dayEnd: 20, hint: "Monitor the housing market closely. If prices fall, consider buying undervalued stocks, but be cautious of overall market trends." },
    
        // Days 21-40: Mortgage defaults rise, hitting banks with losses.
        { dayStart: 21, dayEnd: 40, hint: "Mortgage defaults may lead to stock price drops. Hold off on buying bank stocks, and consider selling if you already own them." },
    
        // Days 41-60: Lehman Brothers collapses, triggering panic.
        { dayStart: 41, dayEnd: 60, hint: "During market panic, consider buying stocks that are undervalued, but be ready to sell if prices continue to drop." },
    
        // Days 61-80: Global markets plunge as fears of recession grow.
        { dayStart: 61, dayEnd: 80, hint: "Recession fears might mean it's time to sell weaker stocks to minimize losses. Hold onto strong stocks with solid fundamentals." },
    
        // Days 81-100: Government bailouts aim to stabilize the market.
        { dayStart: 81, dayEnd: 100, hint: "Watch for stocks that may benefit from government bailouts. Consider buying these stocks, but sell any stocks that are not performing well." },
    
        // Days 101-120: Early signs of recovery as market stabilizes.
        { dayStart: 101, dayEnd: 120, hint: "If the market shows signs of recovery, it may be a good time to buy strong-performing stocks. Hold onto your investments as the market stabilizes." }
    ];
    
    // const hints = [
    //     { dayStart: 0, dayEnd: 20, hint: "Consider selling if you see a drop in housing prices." },
    //     { dayStart: 21, dayEnd: 40, hint: "Mortgage defaults may lead to stock price drops; be cautious." },
    //     { dayStart: 41, dayEnd: 60, hint: "Panic in the market could provide buying opportunities." },
    //     { dayStart: 61, dayEnd: 80, hint: "Recession fears might mean it's time to sell." },
    //     { dayStart: 81, dayEnd: 100, hint: "Government bailouts could stabilize some stocks; keep an eye on them." },
    //     { dayStart: 101, dayEnd: 120, hint: "Market recovery means it might be a good time to invest." }
    // ];

    const [buyCounts, setBuyCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const [sellCounts, setSellCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const stockInfo = [
        {
            title: "Global BankCorp",
            description: "Global BankCorp is a prominent international banking institution that stands out for its commitment to innovation..."
        },
        {
            title: "SafeHold Realty Trust",
            description: "SafeHold Realty Trust is a premier real estate investment trust (REIT) specializing in top-tier commercial properties..."
        },
        {
            title: "GreenEnergy Innovations Inc.",
            description: "GreenEnergy Innovations is a pioneering renewable energy company focused on advancing clean power solutions..."
        }
    ];



    const resetGame = () => {
        console.log("HIIII")
        // Reset state when the component mounts
        setDay(0);
        setPortfolio({
            cash: 1000,
            stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }] // reset stocks as needed
        });
        isGameOver = false;
        isProfitMade = false;
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                resetGame();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    const getCurrentMessage = () => {
        const phase = timelineMessages.find(event => day < event.day);
        return phase ? phase.message : timelineMessages[timelineMessages.length - 1].message;
    };


    const checkForAlert = () => {
        const alert = timelineMessages.find(event => day < event.day);
        if (alert && !shownAlerts.has(alert.day)) {
            setAlertMessage(alert.message);
            setPaused(true);
            setShownAlerts(new Set(shownAlerts).add(alert.day));
        }
    };

    // Increment day if simulation is not paused
    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [paused]);

    // Update stock prices, independent of paused state
    useEffect(() => {
        if (day > 0) {
            setPrices((prevPrices) => prevPrices.map((priceSeries) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;
                if (day < 10) {
                    newPrice = previousPrice * (1 - Math.random() * 0.02);
                } else if (day < 27) {
                    newPrice = previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 35) {
                    newPrice = previousPrice * (1 + Math.random() * 0.005);
                } else if (day < 42) {
                    newPrice = previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 50) {
                        newPrice = previousPrice * (1 + Math.random() * 0.01);
                    newPrice = previousPrice * (1 + Math.random() * 0.01);
                } else {
                    newPrice = previousPrice * (1 + Math.random() * 0.04);
                }
                return [...priceSeries, newPrice];
            }));
            checkForAlert();
        }
    }, [day]);
    const handleCloseAlert = () => {
        setAlertMessage(null);
        setPaused(false);
    };

    const openDialog = (index: number) => {
        setActiveDialog(index);
    };

    const closeDialog = () => {
        setActiveDialog(null);
    };

    const handleBuy = (index: number) => {
        const price = prices[index][day];
        if (portfolio.cash >= price) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash - price,
                stocks: prevPortfolio.stocks.map((stock, i) => i === index
                    ? { shares: stock.shares + 1 }
                    : stock
                )
            }));
            setBuyCounts((prevCounts) =>
                prevCounts.map((count, i) => i === index ? count + 1 : count)
            );
        }
    };

    const handleSell = (index: number) => {
        const price = prices[index][day];
        if (portfolio.stocks[index].shares > 0) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash + price,
                stocks: prevPortfolio.stocks.map((stock, i) => i === index
                    ? { shares: stock.shares - 1 }
                    : stock
                )
            }));
            setSellCounts((prevCounts) =>
                prevCounts.map((count, i) => i === index ? count + 1 : count)
            );
        }
    };

    const createChartData = (priceSeries: number[]) => ({
        labels: Array.from({ length: day + 1 }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Stock Price',
                data: priceSeries,
                fill: false,
                borderColor: 'green',
            },
        ],
    });

    let totalPortfolioValue = (
        portfolio.stocks.reduce((total, stock, index) => {
            const stockValue = stock.shares * (prices[index][day] || 0);
            return total + stockValue;
        }, 0)
    ).toFixed(2);

        const currentPrice = prices[index][day]; // Get current price based on your logic
        return total + (stock.shares * (currentPrice || 0));
    }, 0);

    var isGameOver: Boolean = day >= 300;
    const totalWalletValue = portfolio.cash + totalStockValue; // Total value of portfolio
    const valueInvested = (initialInvestment - portfolio.cash).toFixed(2); // Calculate value invested
    var isProfitMade: Boolean = Number(totalPortfolioValue) > 1000;

    return (
        <div>
            <Header/>
            <div className="grid-container-outer">

            {isGameOver && (
                <div className="game-over-overlay">
                    <h2>{isProfitMade ? 'YOU WIN' : 'YOU LOSE'}</h2>
                    <button className='nes-btn is-success' onClick={() => navigate('/scenario-one')}>Start Over</button>
                </div>
            )}
                        <button className='nes-btn is-success' onClick={() => navigate('/scenario-one')}>Start Over</button>

            <div className="left-column">
                <h1 className='title'>MiniGame: Market Crash Simulation</h1>
                <div className="nes-container">

                    <center><h2>Day: {day + 1}</h2></center>
                    <div className="nes-container is-rounded is-dark">
                        {getCurrentMessage()}
                    </div>
                    <br></br>
                    {prices.map((priceSeries, index) => {
                        const currentPrice = priceSeries[day]?.toFixed(2) || "0.00";
                        const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                        return (
                            <div key={index} className="chart-container">
                        <center><h2>Day: {day + 1}</h2></center>
                        <div className="nes-container is-rounded is-dark">
                            {getCurrentMessage()}
                        </div>
                        <br></br>
                        {prices.map((priceSeries, index) => {
                            const currentPrice = priceSeries[day]?.toFixed(2) || "0.00";
                            const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                            return (
                                <div key={index} className="chart-container">
                                    <h3>{stockSymbols[index]} ${currentPrice}</h3>

                                    <Line data={createChartData(priceSeries)} />
                                    <button className="nes-btn is-primary" onClick={() => openDialog(index)}>
                                        View Info
                                    </button>

                                    {activeDialog === index && (
                                        <dialog className="nes-dialog is-rounded opaque-dialog-info" open>
                                            <form method="dialog">
                                                <p className="title">{stockInfo[index].title}</p>
                                                <p>{stockInfo[index].description}</p>
                                                <menu className="dialog-menu">
                                                    <button className="nes-btn" onClick={closeDialog}>Close</button>
                                                </menu>
                                            </form>
                                        </dialog>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="right-column">
                    <h4 className='title'>Goal: Try to make a profit.</h4>
                    <h4 className='title'>Decide whether to buy, hold, or sell based on the market conditions.</h4>
                    <br></br>
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3 className='title'>Portfolio</h3></center>
                        <p><strong>Money Remaining:</strong> ${portfolio.cash.toFixed(2)}</p>
                        <p><strong>Wallet:</strong> ${(1000 - portfolio.cash).toFixed(2)}</p>
                        <p><strong>Total Value Worth:</strong> ${totalPortfolioValue}</p>
                        <p><strong>Gains (Profit):</strong> ${totalPortfolioValue}</p>
                        <p><strong>Profit Status:</strong> {isProfitMade ? 'Profit Made' : 'No Profit'}</p>
                    </div>
                    <br></br>
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3>Buy/Sell</h3></center>
                        {
                            stockSymbols.map((item, index) => (
                                <div key={index} className="stock-control">
                                    <p>{item} - Shares: {portfolio.stocks[index].shares}</p>
                                    <button onClick={() => handleBuy(index)} className="nes-btn is-success">
                                        Buy
                                    </button>
                                    <button onClick={() => handleSell(index)} className={`nes-btn ${portfolio.stocks[index].shares === 0 ? 'is-disabled' : 'is-error'}`} disabled={portfolio.stocks[index].shares === 0}>
                                        Sell
                                    </button>
                                </div>
                            ))
                            // stockSymbols.map((item, index) => (
                            //     <p key={index}>{item} </p>
                            // ))
                        }
                    </div>

                </div>

                {alertMessage && (
                    <div className="nes-container is-rounded is-warning opaque-alert">
                        <p><strong>Alert:</strong> {alertMessage}<br></br><br></br> Tip: Use this paused time to buy, sell, or hold onto stocks.</p>
                        <button className="nes-btn is-primary" onClick={handleCloseAlert}>I'm done. Resume! </button>
                    </div>
                )}
            </div>
        </div >

    );
};

export default ScenarioOne;
function useRef(arg0: null) {
    throw new Error('Function not implemented.');
}

