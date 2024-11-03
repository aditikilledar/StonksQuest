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
    const [day, setDay] = useState<number>(0);
    const [prices, setPrices] = useState<number[][]>([
        [150],  // Tech Stock
        [100],  // Industrial Stock
        [90]    // Utility Stock
    ]);
    const [portfolio, setPortfolio] = useState<PortfolioI>({
        cash: 1000,
        stocks: [{ shares: 0 }, { shares: 0 }, { shares: 0 }]
    });
    const [newsMessage, setNewsMessage] = useState<string | null>(null);

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

    return (
        <div className="grid-container-outer">
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
        </div>
    );
};

export default TechBoomOrBustScenario;
