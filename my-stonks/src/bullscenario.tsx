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

interface Portfolio {
    cash: number;
    shares: number;
}

const BullMarketScenario: React.FC = () => {
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[]>([100]);
    const [portfolio, setPortfolio] = useState<Portfolio>({ cash: 1000, shares: 0 });

    useEffect(() => {
        if (day > 0) {
            const previousPrice = prices[day - 1];
            const newPrice = previousPrice * (1 + Math.random() * 0.01 + 0.0005); // Small upward trend
            setPrices((prevPrices) => [...prevPrices, newPrice]);
        }
    }, [day]);

    const handleBuy = () => {
        const price = prices[day];
        if (portfolio.cash >= price) {
            setPortfolio((prevPortfolio) => ({
                cash: prevPortfolio.cash - price,
                shares: prevPortfolio.shares + 1,
            }));
        }
    };

    const handleSell = () => {
        const price = prices[day];
        if (portfolio.shares > 0) {
            setPortfolio((prevPortfolio) => ({
                cash: prevPortfolio.cash + price,
                shares: prevPortfolio.shares - 1,
            }));
        }
    };

    const nextDay = () => setDay(day + 1);

    const data = {
        labels: Array.from({ length: day + 1 }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Stock Price',
                data: prices,
                fill: false,
                borderColor: 'blue',
            },
        ],
    };

    // Only display `prices[day]` if it exists; otherwise, use a default value of 0
    const currentPrice = prices[day] !== undefined ? prices[day].toFixed(2) : "0.00";
    const portfolioValue = (portfolio.cash + (portfolio.shares * (prices[day] || 0))).toFixed(2);

    return (
        <div>
            <h2>Bull Market Scenario</h2>
            <Line data={data} />
            <p>Day: {day + 1}</p>
            <p>Price: ${currentPrice}</p>
            <p>Cash: ${portfolio.cash.toFixed(2)}</p>
            <p>Shares: {portfolio.shares}</p>
            <p>Portfolio Value: ${portfolioValue}</p>
            <button onClick={handleBuy} disabled={portfolio.cash < (prices[day] || 0)}>
                Buy
            </button>
            <button onClick={handleSell} disabled={portfolio.shares <= 0}>
                Sell
            </button>
            <button onClick={nextDay}>Next Day</button>
        </div>
    );
};

export default BullMarketScenario;
