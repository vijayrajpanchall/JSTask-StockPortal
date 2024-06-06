## Task
TechCrox is an application development company. They want to create a portal on
which users can buy stocks. When the user clicks the Buy Stock button, a pop-up
will open asking the user for the name and quantity of the stock. Once a stock is
purchased, an entry should be added to the stock table. If the user purchases an
already purchased stock, then the quantity will be added to the stock. There should
be a button to upload the stock prices by uploading a JSON file containing Stock
prices. Once the JSON is uploaded, the dashboard will show the Invested and
Current (Amount) along with updated P&L information like amount and percent. If the
overall investment is profitable then the P&L information.


# Stocks Buy Portal

## Overview
The "Stocks Buy Portal" web application is designed to maintain accurate stock data, including invested amounts, quantities, and average buying prices. The application allows users to add new stocks, upload new stock prices from a JSON file, and calculates profit and loss (P&L).

## Table of Contents
- [Stocks Buy Portal](#stocks-buy-portal)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Components](#components)
    - [HTML Structure](#html-structure)
    - [JavaScript Functions and Event Handlers](#javascript-functions-and-event-handlers)
  - [Flow of Operations](#flow-of-operations)
    - [Adding Stocks](#adding-stocks)
    - [Uploading Stock Prices](#uploading-stock-prices)
  - [Calculation Logic](#calculation-logic)
    - [Invested Amount](#invested-amount)
    - [Current Amount](#current-amount)
    - [Profit \& Loss (P\&L)](#profit--loss-pl)
    - [Profit \& Loss Percentage](#profit--loss-percentage)
  - [License](#license)

## Components

### HTML Structure
The HTML structure comprises:
- A table displaying the total invested amount, current amount, and profit & loss.
- Buttons to open a form for buying stocks and to upload new stock prices.
- A form to input new stock purchases.
- A table listing detailed stock information including name, invested amount, quantity, average buying price, and current stock price.

### JavaScript Functions and Event Handlers
The JavaScript file contains:
- Event listeners for handling form submissions, button clicks, and file uploads.
- Functions to open and close the stock purchase form.
- Functions to update the stock table with new purchases and prices.

## Flow of Operations

### Adding Stocks
When a user buys stocks:
1. The user opens the form using the "Buy Stocks" button.
2. The user enters the stock name and quantity in the form.
3. Upon form submission:
   - The application checks if the stock already exists in the table.
   - If the stock exists:
     - The application updates the stock's quantity and recalculates the average buying price.
     - **Average Buying Price Calculation**:
       - New Average Buying Price = (Current Invested Amount + New Invested Amount) / New Total Quantity
     - The total invested amount for the stock is updated.
   - If the stock does not exist:
     - A new row is added to the table with the stock details.
     - The current price is set as the average buying price initially.

### Uploading Stock Prices
When a user uploads new stock prices:
1. The user selects a JSON file containing the new prices and clicks the "Upload Prices" button.
2. The application reads the JSON file and updates the current prices in the stock table.
3. The average buying price remains unchanged during this process as it reflects the historical buying price, not the current market price.
4. The application recalculates the total invested amount and profit & loss based on the new current prices.

## Calculation Logic

### Invested Amount
- For a stock: 
  - **Invested Amount** = Quantity * Average Buying Price
- Total Invested Amount: 
  - **Total Invested Amount** = Sum of all individual stock invested amounts

### Current Amount
- For a stock: 
  - **Current Amount** = Quantity * Current Stock Price
- Total Current Amount: 
  - **Total Current Amount** = Sum of all individual stock current amounts

### Profit & Loss (P&L)
- For a stock: 
  - **P&L** = (Current Stock Price - Average Buying Price) * Quantity
- Total P&L Amount: 
  - **Total P&L Amount** = Sum of all individual stock P&L amounts

### Profit & Loss Percentage
- **P&L Percentage** = (Total P&L Amount / Total Invested Amount) * 100

By ensuring these calculations are correctly implemented, the application provides accurate and up-to-date information about the user's stock portfolio.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
