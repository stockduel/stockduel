# StockList Worker
Pull financial data for all NYSE and NASDAQ stocks on a reocuring schedule

## Getting started
1. type 'npm install'
2. type 'npm run seed'
3. create cron job

### Creating the cron job
1. sudo crontab -e
2. type '\*/15 14-21 \* \* 1,2,3,4,5,6 path\_to\_worker/getStockPrices.js >> path\_to\_worker/logs.txt'

### About the cron job
- Expected Timezone: UTC
- Aligns with NYSE trading hours 9:00 to 16:00
- Example: 
  \*/15 14-21 \* \* 1,2,3,4,5,6 /Users/tatethurston/stocks/getStockPrices.js >> /Users/tatethurston/stocks/logs.txt

### About the commands
- 'npm run seed' will create the tables and then seed the stock and stock_prices tables with initial values
