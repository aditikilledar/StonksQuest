import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioFour.css';
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
    wallet: number;
    cash: number;
    stocks: Stock[];
}

const ScenarioFour: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100], // Global BankCorp
        [120], // SafeHold Realty Trust
        [80]   // GreenEnergy Innovations Inc.
    ]);

    const [portfolio, setPortfolio] = useState<PortfolioI>({
        wallet: 1000,
        cash: 0,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });

    const [paused, setPaused] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [shownAlerts, setShownAlerts] = useState<Set<number>>(new Set());
    const [activeDialog, setActiveDialog] = useState<number | null>(null);
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const [isResumeEnabled, setIsResumeEnabled] = useState<boolean>(false);

    // Earnings report phases and messages
    const timelineMessages = [
        { day: 10, message: "Anticipation builds ahead of Global BankCorp's quarterly earnings report." },
        { day: 20, message: "Global BankCorp's earnings beat expectations, driving stock prices higher." },
        { day: 30, message: "SafeHold Realty Trust's earnings report reveals a surprising revenue drop." },
        { day: 40, message: "GreenEnergy Innovations reports mixed earnings, causing volatility." }
    ];

    const hints = [
        { dayStart: 0, dayEnd: 10, hint: "Market is stable; monitor upcoming earnings reports for potential movements." },
        { dayStart: 11, dayEnd: 20, hint: "Consider buying Global BankCorp shares as earnings beat expectations." },
        { dayStart: 21, dayEnd: 30, hint: "SafeHold Realty Trust might face declines due to unexpected revenue drop." },
        { dayStart: 31, dayEnd: 40, hint: "GreenEnergy Innovations is volatile; buying or selling depends on your risk tolerance." }
    ];

    const stockSymbols = ["TechWave Solutions", "Urban AgroGrowth", "AeroNex Industries"];
    const stockInfo = [
        {
            title: "TechWave Solutions",
            description: "Medium Risk. A rising star in the software and AI sector, with strong growth but facing increasing competition from established tech giants."
        },
        {
            title: "Urban AgroGrowth",
            description: "High Potential! Specializes in sustainable agriculture and urban farming, sensitive to regulatory changes and environmental conditions."
        },
        {
            title: "AeroNex Industries",
            description: "High Risk. Known for pioneering aerospace technology, but impacted by high R&D costs and unpredictable production cycles."
        }
    ];


    const resetGame = () => {
        setDay(0);
        setPortfolio({
            wallet: 1000,
            cash: 0,
            stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
        });
        setPaused(false);
        setShownAlerts(new Set());
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
            const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 500);
            return () => clearInterval(interval);
        }
    }, [paused]);

    // Update stock prices based on earnings phases
    useEffect(() => {
        if (day > 0 && day <= 40) {
            setPrices((prevPrices) => prevPrices.map((priceSeries, index) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;

                if (day < 10) { // Phase 1: Anticipation, slight stability
                    newPrice = previousPrice * (1 + Math.random() * 0.01);
                } else if (day < 20) { // Phase 2: Global BankCorp beats expectations
                    newPrice = index === 0 ? previousPrice * (1 + Math.random() * 0.05) : previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 30) { // Phase 3: SafeHold Realty reports revenue drop
                    newPrice = index === 1 ? previousPrice * (1 - Math.random() * 0.03) : previousPrice * (1 + Math.random() * 0.01);
                } else if (day < 40) { // Phase 4: GreenEnergy Innovations volatility
                    newPrice = index === 2 ? previousPrice * (1 + Math.random() * 0.05 - 0.025) : previousPrice * (1 + Math.random() * 0.01);
                } else { // Post-report stability
                    newPrice = previousPrice * (1 + Math.random() * 0.01 - 0.005);
                }

                return [...priceSeries, newPrice];
            }));
            checkForAlert();
        }
    }, [day]);

    const handleCloseAlert = () => {
        setAlertMessage(null);
        setIsResumeEnabled(true);
    };

    const handleResume = () => {
        setPaused(false);
        setIsResumeEnabled(false);
    };

    const openDialog = (index: number) => setActiveDialog(index);
    const closeDialog = () => setActiveDialog(null);

    const handleBuy = (index: number) => {
        const price = prices[index][day];
        if (portfolio.wallet + portfolio.cash >= price) {
            setPortfolio((prevPortfolio) => {
                let newWallet = prevPortfolio.wallet;
                let newCash = prevPortfolio.cash;

                if (newWallet >= price) {
                    newWallet -= price;
                } else {
                    const remainingAmount = price - newWallet;
                    newWallet = 0;
                    newCash -= remainingAmount;
                }

                const updatedStocks = prevPortfolio.stocks.map((stock, i) =>
                    i === index ? { shares: stock.shares + 1 } : stock
                );

                return {
                    ...prevPortfolio,
                    wallet: newWallet,
                    cash: newCash,
                    stocks: updatedStocks,
                };
            });
        }
    };

    const handleSell = (index: number) => {
        const price = prices[index][day] || 0;
        const sharesToSell = 1;

        if (portfolio.stocks[index].shares >= sharesToSell) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash + (price * sharesToSell),
                stocks: prevPortfolio.stocks.map((stock, i) =>
                    i === index ? { ...stock, shares: stock.shares - sharesToSell } : stock
                )
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
                borderColor: 'green',
            },
        ],
    });

    let totalPortfolioValue = portfolio.stocks.reduce((total, stock, index) => {
        const stockValue = stock.shares * (prices[index][day] || 0);
        return total + stockValue;
    }, 0).toFixed(2);

    const totalStockValue = portfolio.stocks.reduce((total, stock, index) => {
        const currentPrice = prices[index][day];
        return total + (stock.shares * (currentPrice || 0));
    }, 0);

    const requestHint = () => {
        const dayHint = hints.find(hint => hint.dayStart <= day && day <= hint.dayEnd);
        setCurrentHint(dayHint ? dayHint.hint : "Consider watching for opportunities.");
    };

    const closeHint = () => {
        setCurrentHint(null);
    };

    var investmentMoneyLeft: Number = Math.max(portfolio.wallet, 0);
    var profit: Number = Math.max(Number(portfolio.cash) - (1000 - Number(investmentMoneyLeft)), -9999);
    var isGameOver: Boolean = day >= 40;
    var isProfitMade: Boolean = Number(profit) > 0;

    return (
        <div>
            <Header />
            <div className="grid-container-outer">
                {isGameOver && (
                    <div className="game-over-overlay">
                        <h1>GAME OVER</h1>
                        <h2>{isProfitMade ? 'YOU WIN' : 'YOU LOSE'}</h2>
                        <button className='nes-btn is-success' onClick={() => window.location.reload()}>Play Again</button>
                        <button className='nes-btn is-normal' onClick={() => navigate('/scenario-four')}>Rules</button>
                        <button className='nes-btn is-warning' onClick={() => navigate('/Stonkquest')}>Back to Scenarios</button>
                    </div>
                )}

                <div className="left-column">
                    <h1 className='title'>MiniGame: Earnings Report Simulation</h1>
                    <div className="nes-container">
                        <br />Tip: Use paused time to make investment decisions, then click the Resume button.
                        <center><h2>Day: {day + 1}</h2></center>
                        <div className="nes-container is-rounded is-dark">
                            {getCurrentMessage()}
                        </div>
                        <br />
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
                    <h4 className='title'>Goal: Try to make a profit by buying/selling/holding stocks based on earnings reports.</h4>
                    <button className={`nes-btn ${!isResumeEnabled ? 'is-disabled' : 'is-error'}`} onClick={handleResume}>Resume!</button>
                    <br />
                    <div className="nes-container is-dark" style={{ height: '40%' }}>
                        <center><h3 className='title'>Investment Portfolio</h3></center>
                        <br />
                        <p><strong>Amount Left in Bank:</strong> ${investmentMoneyLeft.toFixed(2)}</p>
                        <p><strong>Amount Spent from Bank:</strong> ${(1000 - Number(investmentMoneyLeft)).toFixed(2)}</p>
                        <p><strong>Value in Cash:</strong> ${(portfolio.cash).toFixed(2)}</p>
                        <p><strong>Total Shares Value Worth:</strong> ${totalPortfolioValue}</p>
                        <p><strong>Net Gain:</strong> ${profit.toFixed(2)}</p>
                        <p><strong>Profit Status:</strong> {isProfitMade ? 'Profit Made' : 'No Profit'}</p>
                    </div>
                    <br />
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3>Buy/Sell Stocks</h3></center>
                        {stockSymbols.map((item, index) => (
                            <div key={index} className="stock-control">
                                <p>{item} - Shares: {portfolio.stocks[index].shares}</p>
                                <button onClick={() => handleBuy(index)} className="nes-btn is-success">Buy</button>
                                <button onClick={() => handleSell(index)} className={`nes-btn ${portfolio.stocks[index].shares === 0 ? 'is-disabled' : 'is-error'}`} disabled={portfolio.stocks[index].shares === 0}>Sell</button>
                                {(portfolio.stocks[index].shares * (prices[index][day] || 0)).toFixed(2)}
                            </div>
                        ))}
                        <button className="nes-btn is-primary" onClick={requestHint}>Request Hint</button>
                    </div>
                </div>

                {alertMessage && (
                    <div className="nes-container is-rounded is-warning opaque-alert">
                        <p><strong>Alert:</strong> {alertMessage}</p>
                        <button className="nes-btn is-error" onClick={handleCloseAlert}>Close</button>
                    </div>
                )}
                {currentHint && (
                    <div className="nes-container is-rounded is-info opaque-alert">
                        <p><strong>Hint:</strong> {currentHint}</p>
                        <button className="nes-btn is-error" onClick={closeHint}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScenarioFour;

