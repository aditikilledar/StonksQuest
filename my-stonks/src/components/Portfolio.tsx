// src/Portfolio.tsx
import React from 'react';

interface Stock {
    symbol: string;
    name: string;
    price: number;
}

const Portfolio: React.FC = () => {
    const stocks: Stock[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.56 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.25 },
    ];

    return (
        <div>
            <h2>Stock Portfolio</h2>
            <ul>
                {stocks.map(stock => (
                    <li key={stock.symbol}>
                        <strong>{stock.name}</strong> ({stock.symbol}): ${stock.price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Portfolio;
