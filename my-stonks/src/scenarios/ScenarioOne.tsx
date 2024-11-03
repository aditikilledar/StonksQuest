import React, { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './ScenarioOne.css';
import Portfolio from '../components/Portfolio';
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

const FinancialCrisisScenario: React.FC = () => {
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

    const timelineMessages = [
        { day: 20, message: "Housing market weakens as home prices start to fall." },
        { day: 40, message: "Mortgage defaults rise, hitting banks with losses." },
        { day: 60, message: "Lehman Brothers collapses, triggering panic." },
        { day: 80, message: "Global markets plunge as fears of recession grow." },
        { day: 100, message: "Government bailouts aim to stabilize the market." },
        { day: 120, message: "Early signs of recovery as market stabilizes." }
    ];

    const stockSymbols = ["Stock A", "Stock B", "Stock C"];

    const getCurrentMessage = () => {
        const phase = timelineMessages.find(event => day < event.day);
        return phase ? phase.message : timelineMessages[timelineMessages.length - 1].message;
    };

    // Check for alert based on the current day
    const checkForAlert = () => {
        const alert = timelineMessages.find(event => event.day === day);
        if (alert && !shownAlerts.has(alert.day)) {
            setAlertMessage(alert.message);
            setPaused(true); // Pause the day counter only
            setShownAlerts(new Set(shownAlerts).add(alert.day)); // Track this alert as shown
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

                if (day < 50) {
                    newPrice = previousPrice * (1 - Math.random() * 0.02);
                } else if (day < 150) {
                    newPrice = previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 200) {
                    newPrice = previousPrice * (1 + Math.random() * 0.005);
                } else {
                    newPrice = previousPrice * (1 + Math.random() * 0.01);
                }

                return [...priceSeries, newPrice];
            }));
            checkForAlert(); // Check for alerts every time the day updates
        }
    }, [day]); // No dependency on paused state for price updates

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

    const handleCloseAlert = () => {
        setAlertMessage(null); // Clear the alert message
        setPaused(false); // Resume the day counter
    };

    return (
        <div className="grid-container-outer">
            <div className="left-column">
                <div className="nes-container with-title" style={{ height: '100%' }}>
                    <h3 className='title'>2008 Financial Crisis Scenario</h3>
                    <p><strong>Current Phase:</strong> {getCurrentMessage()}</p>
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
                </div>
                <div className="nes-container with-title" style={{ height: '100%' }}>
                    <Portfolio />
                </div>
            </div>

            {/* Alert Popup */}
            {alertMessage && (
                <div className="nes-container is-rounded is-warning opaque-alert">
                    <p><strong>Alert:</strong> {alertMessage}</p>
                    <button className="nes-btn is-primary" onClick={handleCloseAlert}>Close Alert and Resume</button>
                </div>
            )}
        </div>
    );
};

export default FinancialCrisisScenario;
