import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioTwo.css';

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

const ScenarioTwo: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100], // TechWave Solutions
        [120], // Urban AgroGrowth
        [80]   // AeroNex Industries
    ]);

    const [portfolio, setPortfolio] = useState<PortfolioI>({
        wallet: 1000,
        cash: 0,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });

    const stockInfo = [
        {
            title: "TechWave Solutions",
            description: "Medium Risk. TechWave Solutions is a rapidly growing software company known for its AI-driven cloud solutions. Strong market presence but facing competition from larger tech giants."
        },
        {
            title: "Urban AgroGrowth",
            description: "High Potential! Urban AgroGrowth specializes in sustainable agriculture and urban farming. Consistent performance but sensitive to regulatory changes and weather patterns."
        },
        {
            title: "AeroNex Industries",
            description: "High Risk! AeroNex Industries is a cutting-edge aerospace company investing heavily in next-gen aircraft tech. Promising innovation, though high R&D costs and slow production cycles present risks."
        }
    ];

    const [paused, setPaused] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [shownAlerts, setShownAlerts] = useState<Set<number>>(new Set());
    const [activeDialog, setActiveDialog] = useState<number | null>(null);
    const [currentHint, setCurrentHint] = useState<string | null>(null);

    const timelineMessages = [
        { day: 10, message: "Rumors suggest TechWave Solutions might merge with a larger tech firm! Investors react cautiously." },
        { day: 20, message: "Breaking News: TechWave Solutions officially announces a merger with Urban AgroGrowth. Market shows mixed reactions." },
        { day: 40, message: "Concerns over integration challenges are impacting the merged company’s performance." },
        { day: 60, message: "The merged company reports either strong synergies or mounting issues—market responds accordingly." }
    ];

    const hints = [
        { dayStart: 0, dayEnd: 10, hint: "Stay cautious with TechWave Solutions as merger rumors circulate." },
        { dayStart: 11, dayEnd: 20, hint: "The merger announcement has driven TechWave Solutions’s stock up—consider your next move carefully." },
        { dayStart: 21, dayEnd: 39, hint: "With integration challenges, holding or selling TechWave Solutions could be beneficial." },
        { dayStart: 40, dayEnd: 60, hint: "The merged company’s outcome will determine future stock trends; prepare accordingly." }
    ];

    const stockSymbols = ["TechWave Solutions", "Urban AgroGrowth", "AeroNex Industries"];
    const [buyCounts, setBuyCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const [sellCounts, setSellCounts] = useState<number[]>(stockSymbols.map(() => 0));

    const resetGame = () => {
        setDay(0);
        setPortfolio({
            wallet: 1000,
            cash: 0,
            stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
        });
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
            const interval = setInterval(() => setDay(prevDay => prevDay + 1), 500);
            return () => clearInterval(interval);
        }
    }, [paused]);

    useEffect(() => {
        if (day > 0 && day <= 60) {
            setPrices(prevPrices => prevPrices.map((priceSeries, index) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;

                if (day < 10) {
                    newPrice = index === 0 ? previousPrice * (1 + Math.random() * 0.02) : previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 20) {
                    newPrice = index === 0 ? previousPrice * (1 + Math.random() * 0.05) : previousPrice * (1 + Math.random() * 0.01);
                } else if (day < 40) {
                    newPrice = previousPrice * (1 + Math.random() * 0.03 - 0.015);
                } else if (day < 60) {
                    newPrice = index === 0 ? previousPrice * (1 + Math.random() * 0.04) : previousPrice * (1 + Math.random() * 0.01 - 0.005);
                } else {
                    newPrice = previousPrice * (1 + Math.random() * 0.01 - 0.005);
                }

                return [...priceSeries, newPrice];
            }));
            checkForAlert();
        }
    }, [day]);

    const handleCloseAlert = () => setAlertMessage(null);

    const handleResume = () => setPaused(false);

    const openDialog = (index: number) => setActiveDialog(index);
    const closeDialog = () => setActiveDialog(null);

    const handleBuy = (index: number) => {
        const price = prices[index][day];
        if (portfolio.wallet + portfolio.cash >= price) {
            setPortfolio(prevPortfolio => {
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
                    stocks: updatedStocks
                };
            });
            setBuyCounts(prevCounts => prevCounts.map((count, i) => i === index ? count + 1 : count));
        }
    };

    const handleSell = (index: number) => {
        const price = prices[index][day];
        const sharesToSell = 1;

        if (portfolio.stocks[index].shares >= sharesToSell) {
            setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                cash: prevPortfolio.cash + (price * sharesToSell),
                stocks: prevPortfolio.stocks.map((stock, i) =>
                    i === index ? { ...stock, shares: stock.shares - sharesToSell } : stock
                )
            }));

            setSellCounts(prevCounts => prevCounts.map((count, i) => (i === index ? count + sharesToSell : count)));
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

    const requestHint = () => {
        const dayHint = hints.find(hint => hint.dayStart <= day && day <= hint.dayEnd);
        setCurrentHint(dayHint ? dayHint.hint : "Consider watching for opportunities.");
    };

    const closeHint = () => setCurrentHint(null);

    const initialInvestment = 1000;
    const totalWalletValue = portfolio.cash + Number(totalPortfolioValue); // Total value of portfolio
    const valueInvested = (initialInvestment - portfolio.cash).toFixed(2); // Calculate value invested
    const gains = (totalWalletValue - initialInvestment).toFixed(2);

    const investmentMoneyLeft = Math.max(portfolio.wallet, 0);
    const profit = Math.max(Number(portfolio.cash) - (1000 - investmentMoneyLeft), -9999);

    const isGameOver = day >= 60;
    const isProfitMade = Number(profit) > 0;

    return (
        <div>
            <Header />
            <div className="grid-container-outer">
                {isGameOver && (
                    <div className="game-over-overlay">
                        <h1>GAME OVER</h1>
                        <h2>{isProfitMade ? 'YOU WIN' : 'YOU LOSE'}</h2>
                        <button className='nes-btn is-success' onClick={() => window.location.reload()}>Play Again</button>
                        <button className='nes-btn is-normal' onClick={() => navigate('/scenario-two')}>Rules</button>
                        <button className='nes-btn is-warning' onClick={() => navigate('/')}> Back to Scenarios</button>
                    </div>
                )}

                <div className="left-column">
                    <h1 className='title'>MiniGame: Mergers & Acquisitions Simulation</h1>
                    <div className="nes-container">
                        <br />Tip: Use paused time to make investment decisions, then click the Resume button.

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
                    <h4 className='title'>Goal: Try to make a profit, by buying/selling/holding stocks.</h4>
                    <button className="nes-btn is-error" onClick={handleResume}>Resume!</button>
                    <br /> <center><h2>Day: {day + 1}</h2></center>
                    <div className="nes-container is-dark" style={{ height: '40%' }}>
                        <center><h3 className='title'>Investment Portfolio</h3></center>
                        <br />
                        <p><strong>Amount Left in Bank:</strong> ${investmentMoneyLeft.toFixed(2)}</p>
                        <p><strong>Amount Spent from Bank:</strong> ${(1000 - investmentMoneyLeft).toFixed(2)}</p>
                        <p><strong>Value in Cash:</strong> ${portfolio.cash.toFixed(2)}</p>
                        <p><strong>Total Shares Value Worth:</strong> ${totalPortfolioValue}</p>
                        <p><strong>Net Gain:</strong> ${profit.toFixed(2)} </p>
                        <p><strong>Profit Status:</strong> {isProfitMade ? 'Profit Made' : 'No Profit'}</p>
                    </div>
                    <br />
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3>Buy/Sell Stocks</h3></center>
                        {stockSymbols.map((item, index) => (
                            <div key={index} className="stock-control">
                                <p>{item} - Shares: {portfolio.stocks[index].shares}</p>
                                <button onClick={() => handleBuy(index)} className="nes-btn is-success">
                                    Buy
                                </button>
                                <button onClick={() => handleSell(index)} className={`nes-btn ${portfolio.stocks[index].shares === 0 ? 'is-disabled' : 'is-error'}`} disabled={portfolio.stocks[index].shares === 0}>
                                    Sell
                                </button>
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

export default ScenarioTwo;
