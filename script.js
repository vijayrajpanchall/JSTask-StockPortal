const table = document.getElementById("stockTable");
const popup = document.getElementById("myPopup");
const formButton = document.getElementById("myButton");
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const form = document.getElementById("myForm");
const stockSelect = document.getElementById("stock");

popup.addEventListener("click", () => {
  blurTable(true);
});

formButton.addEventListener("click", () => {
  blurTable(false);
  closeForm();
});

uploadButton.addEventListener("click", handleFileUpload);
document
  .getElementById("buyForm")
  .addEventListener("submit", handleBuyFormSubmit);

// Initialize window.stockData from the table if available
window.stockData = extractStockDataFromTable();

initializeStockSelectOptions();

function blurTable(shouldBlur) {
  table.style.filter = shouldBlur ? "blur(5px)" : "none";
}

function openForm() {
  form.style.display = "flex";
}

function closeForm() {
  form.style.display = "none";
}

function calculateTotalInvestedAmount() {
  let totalInvestedAmount = 0;
  Array.from(table.rows)
    .slice(1)
    .forEach((row) => {
      const investedAmount = parseFloat(row.cells[1].textContent);
      totalInvestedAmount += investedAmount;
    });
  return totalInvestedAmount;
}

function updateTablePrices(priceData = []) {
  let totalInvestedAmount = 0;
  let totalPLAmount = 0;
  let currentTotalValue = 0;

  Array.from(table.rows)
    .slice(1)
    .forEach((row) => {
      const stockName = row.cells[0].textContent;
      const matchingPrice = priceData.find(
        (priceObject) => priceObject.name === stockName
      );

      if (matchingPrice) {
        const currentQuantity = parseInt(row.cells[2].textContent);
        const investedAmount = parseFloat(row.cells[1].textContent);
        const newPrice = parseFloat(matchingPrice.newPrice);

        row.cells[4].textContent = newPrice.toFixed(2);

        const plAmount =
          (newPrice - investedAmount / currentQuantity) * currentQuantity;
        currentTotalValue += newPrice * currentQuantity;

        totalInvestedAmount += investedAmount;
        totalPLAmount += plAmount;
      } else {
        console.log(`Price not found for stock: ${stockName}`);
      }
    });

  const totalProfitOrLoss = currentTotalValue - totalInvestedAmount;
  const overallPLPercentage = totalInvestedAmount
    ? (totalProfitOrLoss / totalInvestedAmount) * 100
    : 0;

  const profitAmountCell = document.getElementById("profit_amount");
  const profitPercentageCell = document.getElementById("profit_percentage");

  profitAmountCell.textContent = totalProfitOrLoss.toFixed(2);

  if (totalProfitOrLoss >= 0) {
    profitAmountCell.classList.remove("loss");
    profitAmountCell.classList.add("profit");
  } else {
    profitAmountCell.classList.remove("profit");
    profitAmountCell.classList.add("loss");
  }

  // Determine the sign for the percentage
  const sign = overallPLPercentage >= 0 ? "+" : "-";

  profitPercentageCell.textContent = `${sign}${Math.abs(
    overallPLPercentage
  ).toFixed(2)}%`;

  if (overallPLPercentage >= 0) {
    profitPercentageCell.classList.remove("loss");
    profitPercentageCell.classList.add("profit");
  } else {
    profitPercentageCell.classList.remove("profit");
    profitPercentageCell.classList.add("loss");
  }

  document.getElementById("investedAmt").textContent =
    totalInvestedAmount.toFixed(2);
  document.getElementById("currentAmt").textContent =
    currentTotalValue.toFixed(2);

  console.log("Total Invested Amount:", totalInvestedAmount);
  console.log("Total P&L Amount:", totalProfitOrLoss);
  console.log("Overall P&L Percentage:", overallPLPercentage.toFixed(2) + "%");
}


function extractStockDataFromTable() {
  const data = [];
  Array.from(table.rows)
    .slice(1)
    .forEach((row) => {
      const stockName = row.cells[0].textContent;
      const newPrice = parseFloat(row.cells[4].textContent);
      data.push({ name: stockName, newPrice: isNaN(newPrice) ? 0 : newPrice });
    });
  return data;
}

function initializeStockSelectOptions() {
  stockSelect.innerHTML = ""; // Clear existing options
  Array.from(table.rows)
    .slice(1)
    .forEach((row) => {
      const stockName = row.cells[0].textContent;
      const option = document.createElement("option");
      option.value = stockName;
      option.textContent = stockName;
      stockSelect.appendChild(option);
    });
}

function handleFileUpload() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);
        console.log("Parsed data:", data);
        if (Array.isArray(data)) {
          populateDropdown(data);
          window.stockData = data;
          updateTablePrices(data); // Call updateTablePrices after populating dropdown
          console.log("File uploaded and processed successfully.");
        } else {
          throw new Error("Parsed data is not an array");
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  } else {
    alert("Please select a file to upload.");
  }
}

function populateDropdown(data) {
  stockSelect.innerHTML = ""; // Clear existing options
  data.forEach((stock) => {
    const option = document.createElement("option");
    option.value = stock.name;
    option.textContent = stock.name;
    option.setAttribute("data-price", stock.newPrice); // Store the price in a data attribute
    stockSelect.appendChild(option);
  });
}

function handleBuyFormSubmit(event) {
  event.preventDefault();
  const stockName = stockSelect.value;
  const quantity = parseInt(document.getElementById("qty").value, 10);

  const stock = window.stockData.find((s) => s.name === stockName);
  if (stock && quantity > 0) {
    updateStockTable(stockName, stock.newPrice, quantity);
    updateTablePrices(window.stockData); // Call updateTablePrices after buying stocks
  } else if (quantity > 0) {
    // Fetch the current price from the table
    const existingRow = Array.from(table.rows)
      .slice(1)
      .find((row) => row.cells[0].textContent === stockName);
    const currentPrice = existingRow
      ? parseFloat(existingRow.cells[4].textContent) || 0
      : 100; // Default price if not found
    updateStockTable(stockName, currentPrice, quantity);
    updateTablePrices(); // Call updateTablePrices without price data
  } else {
    alert("Please select a valid stock and enter a valid quantity.");
  }
}

function updateStockTable(stockName, currentPrice, quantity) {
  let existingRow = Array.from(table.rows)
    .slice(1)
    .find((row) => row.cells[0].textContent === stockName);

  if (existingRow) {
    const currentQuantity = parseInt(existingRow.cells[2].textContent);
    const currentAvgPrice = parseFloat(existingRow.cells[3].textContent);
    const newQuantity = currentQuantity + quantity;
    const newInvested = quantity * currentPrice;
    const totalInvested = currentAvgPrice * currentQuantity + newInvested;
    const newAvgPrice = totalInvested / newQuantity;
    existingRow.cells[2].textContent = newQuantity;
    existingRow.cells[1].textContent = totalInvested.toFixed(2);
    existingRow.cells[3].textContent = newAvgPrice.toFixed(2);
  } else {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td class="stocks">${stockName}</td>
      <td>${(currentPrice * quantity).toFixed(2)}</td>
      <td>${quantity}</td>
      <td>${currentPrice.toFixed(2)}</td>
      <td>${currentPrice.toFixed(2)}</td>
    `;
    table.appendChild(newRow);
  }
  closeForm();
  document.getElementById("investedAmt").textContent =
    calculateTotalInvestedAmount().toFixed(2);
}
