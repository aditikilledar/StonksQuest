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

const FinancialCrisisScenario: React.FC = () => {
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [100], // Stock A
        [120], // Stock B
        [80]   // Stock C
    ]);
    const [portfolio, setPortfolio] = useState<Portfolio>({
        cash: 1000,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });
    const [isPaused, setIsPaused] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Crisis story timeline with associated news article messages
    const timelineMessages = [
        { day: 50, message: "Housing market weakens as home prices start to fall." },
        { day: 100, message: "Mortgage defaults rise, hitting banks with losses." },
        { day: 150, message: "Lehman Brothers collapses, triggering panic." },
        { day: 200, message: "Global markets plunge as fears of recession grow." },
        { day: 250, message: "Government bailouts aim to stabilize the market." },
        { day: 300, message: "Early signs of recovery as market stabilizes." },
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        const currentEvent = timelineMessages.find((event) => event.day === day);
        if (currentEvent) {
            setIsPaused(true);
            setAlertMessage(currentEvent.message);
        }
    }, [day]);

    useEffect(() => {
        if (day > 0 && !isPaused) {
            setPrices((prevPrices) => prevPrices.map((priceSeries, index) => {
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
        }
    }, [day, isPaused]);

    const handleCloseAlert = () => {
        setIsPaused(false);
        setAlertMessage(null);
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
                borderWidth: 1,
            },
        ],
    });

    const stockSymbols = ["Stock A", "Stock B", "Stock C"];

    const totalPortfolioValue = (
        portfolio.cash +
        portfolio.stocks.reduce((total, stock, index) => {
            const stockValue = stock.shares * (prices[index][day] || 0);
            return total + stockValue;
        }, 0)
    ).toFixed(2);

    return (
        <div>
            <h2>2008 Financial Crisis Scenario</h2>
            <p><strong>Cash:</strong> ${portfolio.cash.toFixed(2)}</p>
            <p><strong>Total Portfolio Value:</strong> ${totalPortfolioValue}</p>

            {alertMessage && (
                <div className="alert">
                    <h3>News Alert</h3>
                    <p>{alertMessage}</p>
                    <button onClick={handleCloseAlert}>Close</button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                {prices.map((priceSeries, index) => {
                    const currentPrice = priceSeries[day] !== undefined ? priceSeries[day].toFixed(2) : "0.00";
                    const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                    return (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '200px', height: '150px' }}>
                                <Line data={createChartData(priceSeries)} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                            <h3>{stockSymbols[index]}</h3>
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
    );
};

export default FinancialCrisisScenario;