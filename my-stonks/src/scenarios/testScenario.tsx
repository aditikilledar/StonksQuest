import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './Test.css';
import { Line } from 'react-chartjs-2';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
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

const TechBoomOrBustScenario: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [150],
        [200],
        [100]
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
        { day: 30, message: "AI advancements fuel tech stock growth!" },
        { day: 60, message: "Data privacy laws are announced, increasing compliance costs." },
        { day: 100, message: "Mixed earnings season: some stocks soar, others plunge." }
    ];

    const stockSymbols = ["Tech Innovators", "Global Digi Inc.", "EcoTech Solutions"];
    const stockInfo = [
        {
            title: "Tech Innovators",
            description: "Leading in AI technology, driving growth with machine learning solutions."
        },
        {
            title: "Global Digi Inc.",
            description: "Tech conglomerate with investments in cloud services and cybersecurity."
        },
        {
            title: "EcoTech Solutions",
            description: "Pioneering eco-friendly technologies for a sustainable future."
        }
    ];

    const resetGame = () => {
        setDay(0);
        setPortfolio({
            cash: 1000,
            stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
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

    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [paused]);

    useEffect(() => {
        if (day > 0) {
            setPrices((prevPrices) => prevPrices.map((priceSeries, index) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;
                if (day < 30) {
                    newPrice = previousPrice * (1 + Math.random() * 0.03 - 0.015);
                } else if (day < 60) {
                    newPrice = previousPrice * (1 + Math.random() * 0.02 - 0.01);
                } else {
                    newPrice = previousPrice * (1 + Math.random() * 0.05 - 0.025);
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

    const openDialog = (index: number) => setActiveDialog(index);
    const closeDialog = () => setActiveDialog(null);

    const handleBuy = (index: number) => {
        const price = prices[index][day];
        if (portfolio.cash >= price) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash - price,
                stocks: prevPortfolio.stocks.map((stock, i) => i === index ? { shares: stock.shares + 1 } : stock)
            }));
        }
    };

    const handleSell = (index: number) => {
        const price = prices[index][day];
        if (portfolio.stocks[index].shares > 0) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash + price,
                stocks: prevPortfolio.stocks.map((stock, i) => i === index ? { shares: stock.shares - 1 } : stock)
            }));
        }
    };

    const createChartData = (priceSeries: number[]) => ({
        labels: Array.from({ length: day + 1 }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Stock Price',
                data: priceSeries,
                fill: false,
                borderColor: 'blue',
            },
        ],
    });

    let totalPortfolioValue = (
        portfolio.stocks.reduce((total, stock, index) => {
            const stockValue = stock.shares * (prices[index][day] || 0);
            return total + stockValue;
        }, 0)
    ).toFixed(2);

    let isGameOver = day >= 200;
    let isProfitMade = Number(totalPortfolioValue) > 1000;

    return (
        <div>
            <Header />
            <div className="grid-container-outer">
                {isGameOver && (
                    <div className="game-over-overlay">
                        <h1>GAME OVER</h1>
                        <h2>{isProfitMade ? 'YOU WIN' : 'YOU LOSE'}</h2>
                        <button className='nes-btn is-success' onClick={() => navigate('/scenario-techboom')}>Start Over</button>
                        <button className='nes-btn is-warning' onClick={() => navigate('/')}>Back to Scenarios</button>
                    </div>
                )}

                <div className="left-column">
                    <h1 className='title'>MiniGame: Tech Boom or Bust</h1>
                    <div className="nes-container">
                        <center><h2>Day: {day + 1}</h2></center>
                        <div className="nes-container is-rounded is-dark">
                            {getCurrentMessage()}
                        </div>
                        <br />
                        {prices.map((priceSeries, index) => {
                            const currentPrice = priceSeries[day]?.toFixed(2) || "0.00";

                            return (
                                <div key={index} className="chart-container">
                                    <h3>{stockSymbols[index]} ${currentPrice}</h3>
                                    <Line data={createChartData(priceSeries)} />
                                    <button className="nes-btn is-primary" onClick={() => openDialog(index)}>View Info</button>

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
                    <h4 className='title'>Goal: Maximize profit through smart tech investments.</h4>
                    <br />
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3 className='title'>Portfolio</h3></center>
                        <p><strong>Money Remaining:</strong> ${portfolio.cash.toFixed(2)}</p>
                        <p><strong>Value Invested:</strong> ${(1000 - portfolio.cash).toFixed(2)}</p>
                        <p><strong>Total Value Worth:</strong> ${totalPortfolioValue}</p>
                    </div>
                    <br />
                    <div className="nes-container" style={{ height:                    '40%' }}>
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
                        }
                    </div>
                </div>

                {alertMessage && (
                    <div className="nes-container is-rounded is-warning opaque-alert">
                        <p><strong>Alert:</strong> {alertMessage}<br /><br />Tip: Use this paused time to buy, sell, or hold onto stocks.</p>
                        <button className="nes-btn is-primary" onClick={handleCloseAlert}>I'm done. Resume!</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechBoomOrBustScenario;
