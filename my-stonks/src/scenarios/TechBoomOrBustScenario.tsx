import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioTwo.css';
import { Line } from 'react-chartjs-2';
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

const TechBoomOrBustScenario: React.FC = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [150],  // Tech Stock
        [100],  // Industrial Stock
        [90]    // Utility Stock
    ]);
    const [portfolio, setPortfolio] = useState<PortfolioI>({
        wallet: 0,
        cash: 1000,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });
    const [newsMessage, setNewsMessage] = useState<string | null>(null);
    const [isResumeEnabled, setIsResumeEnabled] = useState<boolean>(false);
    const stockSymbols = ["Tech Stock", "Industrial Stock", "Utility Stock"];

    const timelineMessages = [
        { day: 20, message: "New tech innovation sparks a rally in Tech Stock prices." },
        { day: 40, message: "Regulatory pressure builds on Tech Stocks, causing volatility." },
        { day: 60, message: "Tech sector shows resilience; Tech Stocks recover from downturn." },
        { day: 80, message: "Industrial Stocks gain due to infrastructure investments." },
        { day: 100, message: "Utility Stocks remain stable amidst sector volatility." },
        { day: 120, message: "Tech Stocks experience another surge as industry growth continues." }
    ];

    // Fetch the appropriate news message based on the day
    const getCurrentNews = () => {
        const newsEvent = timelineMessages.find(event => event.day === day);
        if (newsEvent) {
            setNewsMessage(newsEvent.message);
        }
    };

    // Increment the day count every second and check for news
    useEffect(() => {
        const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (day > 0) {
            setPrices((prevPrices) => prevPrices.map((priceSeries, index) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;

                // Sector-specific volatility based on the timeline
                if (index === 0) { // Tech Stock
                    if (day < 40) {
                        newPrice = previousPrice * (1 + Math.random() * 0.04); // Boom period
                    } else if (day < 60) {
                        newPrice = previousPrice * (1 - Math.random() * 0.05); // Regulatory pressure
                    } else {
                        newPrice = previousPrice * (1 + Math.random() * 0.03); // Recovery
                    }
                } else if (index === 1) { // Industrial Stock
                    newPrice = previousPrice * (1 + Math.random() * 0.01); // Steady growth
                } else { // Utility Stock
                    newPrice = previousPrice * (1 + Math.random() * 0.005); // Stable
                }

                return [...priceSeries, newPrice];
            }));
            getCurrentNews(); // Check for news updates based on the day
        }
    }, [day]);

    const [buyCounts, setBuyCounts] = useState<number[]>(stockSymbols.map(() => 0));
    const [sellCounts, setSellCounts] = useState<number[]>(stockSymbols.map(() => 0));

    const resetGame = () => {
        console.log("HIIII")
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

    const [paused, setPaused] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [shownAlerts, setShownAlerts] = useState<Set<number>>(new Set());
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

    const handleResume = () => {
        setPaused(false);
        setIsResumeEnabled(false)
    }

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
                borderColor: 'blue',
            },
        ],
    });

    const totalPortfolioValue = (
        portfolio.cash +
        portfolio.stocks.reduce((total, stock, index) => {
            const stockValue = stock.shares * (prices[index][day] || 0);
            return total + stockValue;
        }, 0)
    ).toFixed(2);

    var investmentMoneyLeft: Number = Math.max(portfolio.wallet, 0);
    var profit: Number = Math.max(Number(portfolio.cash) - (1000 - Number(investmentMoneyLeft)), 0);

    var isGameOver: Boolean = day >= 80;
    var isProfitMade: Boolean = Number(profit) > 0;

    return (
        <div className="grid-container-outer">

            {isGameOver && (
                <div className="game-over-overlay">
                    <h1>GAME OVER</h1>
                    <h2>{isProfitMade ? 'YOU WIN' : 'YOU LOSE'}</h2>
                    <button className='nes-btn is-success' onClick={() => window.location.reload()}>Play Again</button>
                    <button className='nes-btn is-normal' onClick={() => navigate('/scenario-one')}>Rules</button>
                    <button className='nes-btn is-warning' onClick={() => navigate('/Stonkquest')}> Back to Scenarios</button>

                </div>
            )}

            <div className="left-column">
                <div className="nes-container with-title" style={{ height: '100%' }}>
                    <h3 className='title'>Tech Boom or Bust Scenario</h3>
                    <p><strong>Current News:</strong> {newsMessage || "Simulation Running"}</p>
                    <p><strong>Cash:</strong> ${portfolio.cash.toFixed(2)}</p>
                    <p><strong>Total Portfolio Value:</strong> ${totalPortfolioValue}</p>
                    {prices.map((priceSeries, index) => {
                        const currentPrice = priceSeries[day]?.toFixed(2) || "0.00";
                        const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                        return (
                            <div key={index} className="chart-container">
                                <h3>{stockSymbols[index]}</h3>
                                <Line data={createChartData(priceSeries)} />
                                <p>Day: {day + 1}</p>
                                <p>Price: ${currentPrice}</p>
                                <p>Shares Held: {portfolio.stocks[index].shares}</p>
                                <p>Value of Shares: ${stockValue}</p>
                                <button onClick={() => handleBuy(index)} disabled={portfolio.cash < (priceSeries[day] || 0)}>
                                    Buy
                                </button>
                                <button onClick={() => handleSell(index)} disabled={portfolio.stocks[index].shares <= 0}>
                                    Sell
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="right-column">

                <div className="nes-container with-title" style={{ height: '100%' }}>
                    <h3 className='title'>Scenario</h3>
                    <p>Analyze the market trend based on sector news and decide if you want to increase exposure to tech stocks or diversify into other sectors for balance.</p>
                </div>
                <div className="nes-container with-title" style={{ height: '100%' }}>
                </div>
            </div>
        </div >
    );
};

export default TechBoomOrBustScenario;
