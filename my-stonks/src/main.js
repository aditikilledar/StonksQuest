// src/main.js
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let stockPrices = {
    'AAPL': 150,
    'GOOGL': 2800,
    'AMZN': 3400
};

let stockText;
let lastUpdateTime = 0;

function preload() {
    this.load.image('background', 'path/to/background/image.png'); // Optional background
}

function create() {
    this.add.image(400, 300, 'background').setScale(2); // Optional

    stockText = this.add.text(20, 20, '', { font: '32px Arial', fill: '#ffffff' });

    // Initialize stock prices display
    updateStockPrices();

    // Set a timer to update prices every second
    this.time.addEvent({
        delay: 1000,
        callback: updateStockPrices,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // You can add interactions or animations here
}

function updateStockPrices() {
    // Randomly change stock prices
    for (let stock in stockPrices) {
        const change = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 5);
        stockPrices[stock] += change;
        stockPrices[stock] = Math.max(stockPrices[stock], 0); // Ensure prices don't go negative
    }

    // Update the text display
    stockText.setText(
        `Stock Prices:\n` +
        `AAPL: $${stockPrices['AAPL'].toFixed(2)}\n` +
        `GOOGL: $${stockPrices['GOOGL'].toFixed(2)}\n` +
        `AMZN: $${stockPrices['AMZN'].toFixed(2)}`
    );
}
