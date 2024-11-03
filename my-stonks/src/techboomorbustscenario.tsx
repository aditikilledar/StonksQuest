import React, { useState, useEffect } from 'react';
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

interface Portfolio {
    cash: number;
    stocks: Stock[];
}

const TechBoomOrBust: React.FC = () => {
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100], // Stock A (general index)
        [120], // Stock B (defensive sector)
        [80]   // Stock C (tech sector)
    ]);
    const [portfolio, setPortfolio] = useState<Portfolio>({
        cash: 1000,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [alertIndex, setAlertIndex] = useState<number>(0);

    // Story-driven alerts for the "Tech Boom or Bust" scenario
    const storyAlerts = [
        {
            message: "Breaking News: A leading tech company announces advancements in artificial intelligence, promising a future of unprecedented automation and innovation. Investors are taking note, and initial reactions are optimistic.",
            impact: () => {
                setPrices((prevPrices) =>
                    prevPrices.map((priceSeries, index) =>
                        [...priceSeries, priceSeries[priceSeries.length - 1] * (index === 2 ? 1 + Math.random() * 0.05 : 1 + Math.random() * 0.01)]
                    )
                );
            }
        },
        {
            message: "Tech stocks surge as more companies join the AI revolution, releasing statements on their own developments in AI and cloud computing. Analysts predict rapid growth in the sector, leading to increased investor interest and rising stock prices.",
            impact: () => {
                setPrices((prevPrices) =>
                    prevPrices.map((priceSeries, index) =>
                        [...priceSeries, priceSeries[priceSeries.length - 1] * (index === 2 ? 1 + Math.random() * 0.08 : 1 + Math.random() * 0.02)]
                    )
                );
            }
        },
        {
            message: "New Concerns Arise: Governments consider regulations to control the rapid advancements in AI, citing potential ethical and privacy issues. Investors react with caution, and tech stocks experience volatility as regulatory uncertainties loom.",
            impact: () => {
                setPrices((prevPrices) =>
                    prevPrices.map((priceSeries, index) =>
                        [...priceSeries, priceSeries[priceSeries.length - 1] * (index === 2 ? 1 - Math.random() * 0.1 : 1 - Math.random() * 0.01)]
                    )
                );
            }
        }
    ];

    // Trigger each alert in sequence every 20 seconds
    useEffect(() => {
        if (alertIndex < storyAlerts.length) {
            const alertTimeout = setTimeout(() => {
                const alert = storyAlerts[alertIndex];
                setCurrentMessage(alert.message);
                setShowAlert(true);
                alert.impact();
                setAlertIndex(alertIndex + 1);
            }, 20000); // Trigger an alert every 20 seconds

            return () => clearTimeout(alertTimeout);
        }
    }, [alertIndex]);

    // Increment day every second
    useEffect(() => {
        const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCloseAlert = () => {
        setShowAlert(false);
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
                borderWidth: 1 // Thinner line
            }
        ]
    });

    const stockSymbols = ["Stock A", "Stock B", "Stock C"];

    // Calculate total portfolio value based on current prices and holdings
    const totalPortfolioValue = (
        portfolio.cash +
        portfolio.stocks.reduce((total, stock, index) => {
            const stockValue = stock.shares * (prices[index][day] || 0);
            return total + stockValue;
        }, 0)
    ).toFixed(2);

    return (
        <div>
            <h2>Tech Boom or Bust Simulation</h2>
            {showAlert && (
                <div className="alert">
                    <h3>Market Event</h3>
                    <p>{currentMessage}</p>
                    <button onClick={handleCloseAlert}>Close</button>
                </div>
            )}
            <p><strong>Day:</strong> {day + 1}</p>
            <p><strong>Cash:</strong> ${portfolio.cash.toFixed(2)}</p>
            <p><strong>Total Portfolio Value:</strong> ${totalPortfolioValue}</p>
            {prices.map((priceSeries, index) => {
                const currentPrice = priceSeries[day] !== undefined ? priceSeries[day].toFixed(2) : "0.00";
                const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                return (
                    <div key={index}>
                        <h3>{stockSymbols[index]}</h3>
                        <Line data={createChartData(priceSeries)} />
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
    );
};

export default TechBoomOrBust;