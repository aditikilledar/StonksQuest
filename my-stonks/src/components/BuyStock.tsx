import React, { useState } from 'react';

type StockItemProps = {
    symbol: string;
    onBuy: (symbol: string, quantity: number) => void;
};

const StockItem: React.FC<StockItemProps> = ({ symbol, onBuy }) => {
    const [quantity, setQuantity] = useState<number>(0);

    const handleBuy = () => {
        if (quantity > 0) {
            onBuy(symbol, quantity);
            setQuantity(0);  // Reset quantity after purchase
        } else {
            alert('Please enter a valid quantity.');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>{symbol}</span>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ marginRight: '10px', width: '50px' }}
            />
            <button onClick={handleBuy}>Buy</button>
        </div>
    );
};

export default StockItem;
