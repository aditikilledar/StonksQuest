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
    stocks: Stock[]; // Array for managing shares of each stock
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

    // Crisis story timeline
    const timelineMessages = [
        "Housing market weakens as home prices start to fall.",
        "Mortgage defaults rise, hitting banks with losses.",
        "Lehman Brothers collapses, triggering panic.",
        "Global markets plunge as fears of recession grow.",
        "Government bailouts aim to stabilize the market.",
        "Early signs of recovery as market stabilizes."
    ];

    // Get the current story message based on the day
    const getCurrentMessage = () => {
        if (day < 50) return timelineMessages[0];
        if (day < 100) return timelineMessages[1];
        if (day < 150) return timelineMessages[2];
        if (day < 200) return timelineMessages[3];
        if (day < 250) return timelineMessages[4];
        return timelineMessages[5];
    };

    // Increment day every second
    useEffect(() => {
        const interval = setInterval(() => setDay((prevDay) => prevDay + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Update stock prices based on the day, simulating crisis phases
    useEffect(() => {
        if (day > 0) {
            setPrices((prevPrices) => prevPrices.map((priceSeries, index) => {
                const previousPrice = priceSeries[day - 1];
                let newPrice;

                if (day < 50) { // Early downturn
                    newPrice = previousPrice * (1 - Math.random() * 0.02);
                } else if (day < 150) { // Crisis deepens
                    newPrice = previousPrice * (1 - Math.random() * 0.01);
                } else if (day < 200) { // Stabilization
                    newPrice = previousPrice * (1 + Math.random() * 0.005);
                } else { // Recovery phase
                    newPrice = previousPrice * (1 + Math.random() * 0.01);
                }

                return [...priceSeries, newPrice];
            }));
        }
    }, [day]);

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

    const stockSymbols = ["Stock A", "Stock B", "Stock C"];

    // Calculate single portfolio value based on current prices and holdings
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
            <p><strong>Current Phase:</strong> {getCurrentMessage()}</p>
            <p><strong>Cash:</strong> ${portfolio.cash.toFixed(2)}</p>
            <p><strong>Total Portfolio Value:</strong> ${totalPortfolioValue}</p>
            {prices.map((priceSeries, index) => {
                const currentPrice = priceSeries[day] !== undefined ? priceSeries[day].toFixed(2) : "0.00";
                const stockValue = (portfolio.stocks[index].shares * (priceSeries[day] || 0)).toFixed(2);

                return (
                    <div key={index}>
                        <h3>{stockSymbols[index]}</h3>
                        <div className="nes-container with-title">
                            <h3 className='title'>Charts</h3><p className='nes-text is-primary'>Scenario</p>

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
                    </div>
                );
            })}
        </div>
    );
};

export default FinancialCrisisScenario;