from flask import Flask
from service import fetchStocksData

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/fetchstocksdata')
def fetch_stocks_data():
    fetchStocksData()
    return True

if __name__ == '__main__':
    app.run(debug=True)