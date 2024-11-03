import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioOne.css';
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

const IPOScenario: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100],  // Stock A
        [120],  // Stock B
        [50]    // IPO Stock
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

    const timelineMessages = [
        { day: 5, message: "A hot new IPO has launched! Be cautious, as IPOs can be highly volatile." },
        { day: 15, message: "IPO prices can experience sharp swings. Consider the risk before investing." },
        { day: 50, message: "Remember, new companies often have unproven track records." }
    ];

    const hints = [
        // Days 0-10: Initial IPO Launch
        {
            dayStart: 0,
            dayEnd: 10,
            hint: "The IPO market can be unpredictable. Start small if you’re interested in the IPO, and watch for initial price swings."
        },

        // Days 11-20: Increased Volatility
        {
            dayStart: 11,
            dayEnd: 20,
            hint: "IPO prices often spike or drop sharply. Stay cautious and consider selling if the stock value rises quickly—profits may be short-lived."
        },

        // Days 21-40: Market Reaction and Potential Price Correction
        {
            dayStart: 21,
            dayEnd: 40,
            hint: "As the market adjusts to the IPO, prices may stabilize or correct downward. Reassess your investment, especially if you’ve seen high volatility."
        },

        // Days 41-60: Evaluating the IPO’s Long-Term Potential
        {
            dayStart: 41,
            dayEnd: 60,
            hint: "New companies can face challenges as the excitement wears off. Look for signs of stability before deciding to hold long-term."
        }
    ];

    const stockSymbols = ["Global BankCorp", "SafeHold Realty Trust", "IPO TechCorp"];

    const [buyCounts, setBuyCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const [sellCounts, setSellCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const stockInfo = [
        {
            title: "Global BankCorp",
            description: "Medium Risk. Global BankCorp is a prominent international banking institution with innovation initiatives but undergoing market fluctuations."
        },
        {
            title: "SafeHold Realty Trust",
            description: "Good performer! SafeHold Realty Trust is a premier REIT specializing in top-tier commercial properties. Stable year-over-year growth."
        },
        {
            title: "IPO TechCorp",
            description: "High volatility! IPO TechCorp is a new and exciting tech startup. While it shows great promise, it comes with significant risks due to lack of track record."
        }
    ];
    const [isResumeEnabled, setIsResumeEnabled] = useState<boolean>(false);

    const resetGame = () => {
        // Reset state when the component mounts
        setDay(0);
        setPortfolio({
            wallet: 1000,
            cash: 0,
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
            const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 500);
            return () => clearInterval(interval);
        }
    }, [paused]);

    // Update stock prices, independent of paused state
    useEffect(() => {
        if (day > 0 && day <= 80) {
            setPrices((prevPrices) => prevPrices.map((priceSeries) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;
                if (day === 3) {
                    newPrice = previousPrice * (1 + (Math.random() - 0.5) * 0.1); // High volatility for IPO
                } else {
                    newPrice = previousPrice * (1 + (Math.random() - 0.5) * 0.03); // Regular volatility for other stocks
                }

                return [...priceSeries, newPrice];
            }));
            checkForAlert();
        }
    }, [day]);

    const handleCloseAlert = () => {
        setAlertMessage(null);
        setIsResumeEnabled(true)
    };

    const handleResume = () => {
        setPaused(false);
        setIsResumeEnabled(false)
    }

    const openDialog = (index: number) => {
        setActiveDialog(index);
    };

    const closeDialog = () => {
        setActiveDialog(null);
    };

    const handleBuy = (index: number) => {
        const price = prices[index][day];
        // Check if there are enough funds in wallet + cash
        if (portfolio.wallet + portfolio.cash >= price) {
            setPortfolio((prevPortfolio) => {
                let newWallet = prevPortfolio.wallet;
                let newCash = prevPortfolio.cash;

                // Deduct from wallet first, then cash if necessary
                if (newWallet >= price) {
                    newWallet -= price; // Wallet has enough, so only deduct from wallet
                } else {
                    const remainingAmount = price - newWallet; // Calculate the remainder needed
                    newWallet = 0; // Set wallet to zero
                    newCash -= remainingAmount; // Deduct the remaining amount from cash
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
            setBuyCounts((prevCounts) =>
                prevCounts.map((count, i) => i === index ? count + 1 : count)
            );
        }
    };

    const handleSell = (index: number) => {
        const price = prices[index][day] || 0;
        const sharesToSell = 1; // Define how many shares to sell in each click

        // Check if there are enough shares to sell
        if (portfolio.stocks[index].shares >= sharesToSell) {
            setPortfolio((prevPortfolio) => ({
                ...prevPortfolio,
                // Update cash by adding the price of each share sold (price * sharesToSell)
                cash: prevPortfolio.cash + (price * sharesToSell),
                // Update stocks by reducing the sold shares
                stocks: prevPortfolio.stocks.map((stock, i) =>
                    i === index ? { ...stock, shares: stock.shares - sharesToSell } : stock
                )
            }));

            setSellCounts((prevCounts) =>
                prevCounts.map((count, i) => (i === index ? count + sharesToSell : count))
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

    const totalStockValue = portfolio.stocks.reduce((total, stock, index) => {
        // Assuming prices is an array of current stock prices
        const currentPrice = prices[index][day]; // Get current price based on your logic
        return total + (stock.shares * (currentPrice || 0));
    }, 0);

    const requestHint = () => {
        const dayHint = hints.find(hint => hint.dayStart <= day && day <= hint.dayEnd);

        setCurrentHint(dayHint ? dayHint.hint : "Consider watching for opportunities.");
    };

    const closeHint = () => {
        setCurrentHint(null);
    };

    // const initialInvestment = 1000
    // const totalWalletValue = portfolio.cash + totalStockValue; // Total value of portfolio
    // const valueInvested = (initialInvestment - portfolio.cash).toFixed(2); // Calculate value invested
    // const gains = (Number(totalWalletValue) - initialInvestment).toFixed(2);


    //var MoneyUnused: Number = 1000 - Number(totalPortfolioValue);
    var investmentMoneyLeft: Number = Math.max(portfolio.wallet, 0);
    var profit: Number = Math.max(Number(portfolio.cash) - (1000 - Number(investmentMoneyLeft)), -9999);

    var isGameOver: Boolean = day >= 80;
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
                        <button className='nes-btn is-normal' onClick={() => navigate('/scenario-one')}>Rules</button>
                        <button className='nes-btn is-warning' onClick={() => navigate('/')}> Back to Scenarios</button>

                    </div>
                )}

                <div className="left-column">
                    <h1 className='title'>IPO Excitement Scenario</h1>
                    <div className="nes-container">

                        <br></br>Tip: Use paused time to make investment decisions, then click the Resume button.
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
                    <h4 className='title'>Goal: Try to make a profit, by buying/selling/holding stocks.</h4>
                    {/* <h4 className='title'></h4> */}
                    <button className={`nes-btn ${!isResumeEnabled ? 'is-disabled' : 'is-error'}`} onClick={handleResume}>Resume!</button>
                    <br></br>
                    <div className="nes-container is-dark" style={{ height: '40%' }}>
                        <center><h3 className='title'>Investment Portfolio</h3></center>
                        <br></br>
                        <p><strong>Amount Left in Bank:</strong> ${investmentMoneyLeft.toFixed(2)}</p>
                        <p><strong>Amount Spent from Bank:</strong> ${(1000 - Number(investmentMoneyLeft)).toFixed(2)}</p>
                        <p><strong>Value in Cash:</strong> ${(portfolio.cash).toFixed(2)}</p>
                        <p><strong>Total Shares Value Worth:</strong> ${totalPortfolioValue}</p>
                        <p><strong>Net Gain: </strong> ${profit.toFixed(2)} </p>
                        <p><strong>Profit Status:</strong> {isProfitMade ? 'Profit Made' : 'No Profit'}</p>
                        {/* <p><strong>Money Remaining:</strong> ${portfolio.wallet.toFixed(2)}</p>
                        <p><strong>Total invested:</strong> ${(1000 - portfolio.wallet).toFixed(2)}</p>
                        <p><strong>Total Value Worth:</strong> ${totalPortfolioValue}</p>
                        <p><strong>Gains (Profit):</strong> ${getProfit()}</p>
                        <p><strong>Profit Status:</strong> {isProfitMade ? 'Profit Made' : 'No Profit'}</p> */}
                    </div>
                    <br></br>
                    <div className="nes-container" style={{ height: '40%' }}>
                        <center><h3>Buy/Sell Stocks</h3></center>
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
                                    {(portfolio.stocks[index].shares * (prices[index][day] || 0)).toFixed(2)}
                                </div>
                            ))
                            // stockSymbols.map((item, index) => (
                            //     <p key={index}>{item} </p>
                            // ))

                        }
                        <button className="nes-btn is-primary" onClick={requestHint}>Request Hint</button>
                    </div>

                </div>

                {alertMessage && (
                    <div className="nes-container is-rounded is-warning opaque-alert">
                        <p><strong>Alert:</strong> {alertMessage}</p>
                        <button className="nes-btn is-error" onClick={handleCloseAlert}>Close </button>
                    </div>
                )}
                {currentHint && (
                    <div className="nes-container is-rounded is-info opaque-alert">
                        <p><strong>Hint:</strong> {currentHint}</p>
                        <button className="nes-btn is-error" onClick={closeHint}>Close</button>
                    </div>
                )}
            </div>

        </div >

    );
};

export default IPOScenario;

