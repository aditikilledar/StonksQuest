import yfinance as yf
import matplotlib.pyplot as plt

def fetchStocksData():
    # Define the stock symbol and time period
    stock_symbol = "AAPL"  # Example: Apple Inc.
    start_date = "2023-01-01"
    end_date = "2023-12-31"

    try:
        stock = yf.Ticker("AAPL")
        print(stock.history(period="5d"))  # Get the last 5 days of data
    except Exception as e:
        print(f"Failed to fetch data: {e}")
    # Fetch historical data
    #stock_data = yf.download(stock_symbol, start=start_date, end=end_date)

    # Display the first few rows
    # print(stock_data.head())

    # plt.figure(figsize=(10, 5))
    # plt.plot(stock_data.index, stock_data['Close'], label='Close Price')
    # plt.title(f'{stock_symbol} Stock Price')
    # plt.xlabel('Date')
    # plt.ylabel('Price in USD')
    # plt.legend()
    # plt.grid(True)
    # plt.show()
