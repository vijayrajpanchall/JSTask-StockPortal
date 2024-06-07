
const table = document.getElementById("stockTable");
const popup = document.getElementById("myPopup");
const formButton = document.getElementById("myButton");
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");

popup.addEventListener("click", (event) => {
  const myTable = document.getElementById("stockTable");
  myTable.style.filter = "blur(5px)";
});

formButton.addEventListener("click", (event) => {
  const myTable = document.getElementById("stockTable");
  myTable.style.filter = "none";

  closeForm();
});

const form = document.getElementById("myForm");
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const stock = document.querySelector('select[name="Select Stock"]').value;
  console.log(stock,"stock")
  const quantity = parseInt(document.querySelector('input[name="qty"]').value); // Ensure quantity is a number

  // Check if stock already exists in the table
  let existingRow = null;
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    if (row.cells[0].textContent === stock) {
      existingRow = row;
      break;
    }
  }

  if (existingRow) {
    // Update existing stock quantity and average price
    const currentQuantity = parseInt(existingRow.cells[2].textContent);
    const currentAvgPrice = parseFloat(existingRow.cells[3].textContent);
    const newQuantity = currentQuantity + quantity;

    // Simulate price retrieval (replace with actual price logic based on uploaded JSON data)
    const currentPrice = parseFloat(existingRow.cells[4].textContent);
    const newInvested = quantity * currentPrice;
    const totalInvested = currentAvgPrice * currentQuantity + newInvested;
    const newAvgPrice = totalInvested / newQuantity;

    existingRow.cells[2].textContent = newQuantity;
    existingRow.cells[1].textContent = totalInvested.toFixed(2);
    existingRow.cells[3].textContent = newAvgPrice.toFixed(2);
  } else {
    // Create a new table row for the new stock
    const newRow = document.createElement("tr");
    const stockCell = document.createElement("td");
    stockCell.textContent = stock;
    const investedCell = document.createElement("td");
    const quantityCell = document.createElement("td");
    quantityCell.textContent = quantity;
    const avgPriceCell = document.createElement("td");
    const stockPriceCell = document.createElement("td");

    // Simulate price retrieval (replace with actual price logic based on uploaded JSON data)
    const currentPrice = 100; // Replace with actual price retrieval
    const stockPrice = 200;
    avgPriceCell.textContent = currentPrice;
    const investedAmount = quantity * currentPrice;
    investedCell.textContent = investedAmount.toFixed(2);
    stockPriceCell.textContent = stockPrice;
    newRow.appendChild(stockCell);
    newRow.appendChild(investedCell);
    newRow.appendChild(quantityCell);
    newRow.appendChild(avgPriceCell);
    newRow.appendChild(stockPriceCell);
    table.appendChild(newRow);
  }
});

uploadButton.addEventListener("click", function (event) {
  const uploadedFile = fileInput.files[0];

  if (uploadedFile) {
    const reader = new FileReader();
    reader.readAsText(uploadedFile);
    reader.onload = function (event) {
      const priceData = JSON.parse(event.target.result);
      updateTablePrices(priceData);
    };
  } else {
    console.log("No file selected");
  }
});

function openForm() {
  document.getElementById("myForm").style.display = "flex";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function updateTablePrices(priceData) {
  const table = document.getElementById("stockTable");

  let totalInvestedAmount = 0;
  let totalPLAmount = 0;

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const stockName = row.cells[0].textContent;
    const matchingPrice = priceData.find(
      (priceObject) => priceObject.name === stockName
    );

    if (matchingPrice) {
      const currentQuantity = parseInt(row.cells[2].textContent);
    //   const currentInvestedAmount = parseFloat(row.cells[1].textContent);
      row.cells[4].textContent = matchingPrice.newPrice;
    //   const newAveragePrice =
    //     (currentInvestedAmount + matchingPrice.newPrice * currentQuantity) /
    //     (currentQuantity + currentQuantity);
    //   row.cells[3].textContent = newAveragePrice.toFixed(2);

      const investedAmount = parseFloat(row.cells[1].textContent);
      const currentPrice = parseFloat(row.cells[4].textContent);

      const plAmount =
        (currentPrice - investedAmount / currentQuantity) * currentQuantity;

      totalInvestedAmount += investedAmount;
      totalPLAmount += plAmount;
    } else {
      console.log(`Price not found for stock: ${stockName}`);
    }
  }
  const overallPLPercentage = (totalPLAmount / totalInvestedAmount) * 100;
  const overallPLPercentageCell = document.getElementById("profit_percentage");

  const totalProfitOrLoss = totalPLAmount - totalInvestedAmount;

  document.getElementById("profit_amount").textContent =
    totalProfitOrLoss.toFixed(2);
  document.getElementById("investedAmt").textContent =
    totalInvestedAmount.toFixed(2);
  document.getElementById("currentAmt").textContent = totalPLAmount.toFixed(2);

  overallPLPercentageCell.textContent = overallPLPercentage.toFixed(2) + "%";

  console.log("Total Invested Amount:", totalInvestedAmount);
  console.log("Total P&L Amount:", totalProfitOrLoss);
  console.log("Overall P&L Percentage:", overallPLPercentage.toFixed(2) + "%");
}

const stockSelect = document.getElementById("stock");

// Loop through the stock table rows (skip the header row)
for (let i = 1; i < table.rows.length; i++) {
  const row = table.rows[i];
  const stockName = row.cells[0].textContent;

  // Create a new option element for the dropdown
  const option = document.createElement("option");
  option.value = stockName;
  option.textContent = stockName;

  // Add the option to the dropdown
  stockSelect.appendChild(option);
}

document.getElementById("uploadButton").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    console.log("object", reader);
    reader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      console.log("data", data);
      populateDropdown(data);
      window.stockData = data; // Store the stock data for later use
    };
    reader.readAsText(file);
  } else {
    alert("Please select a file to upload.");
  }
});

function populateDropdown(data) {
  const select = document.getElementById("stock");
  select.innerHTML = ""; // Clear existing options

  data.forEach((stock) => {
    const option = document.createElement("option");
    option.value = stock.name;
    option.textContent = stock.name;
    option.setAttribute("data-price", stock.newPrice); // Store the price in a data attribute
    select.appendChild(option);
  });
}

document.getElementById("buyForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const stockName = document.getElementById("stock").value;
  const quantity = parseInt(document.getElementById("qty").value, 10);
  const stock = window.stockData.find((s) => s.name === stockName);

  if (stock && quantity > 0) {
    const currentPrice = stock.newPrice;
    const investedAmount = currentPrice * quantity;
    const avgBuyingPrice = currentPrice; // Assuming the current price as the buying price

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td class="stocks">${stockName}</td>
      <td>${investedAmount.toFixed(2)}</td>
      <td>${quantity}</td>
      <td>${avgBuyingPrice.toFixed(2)}</td>
      <td>${currentPrice.toFixed(2)}</td>
    `;

    document.getElementById("stockTable").appendChild(newRow);
    closeForm();
  } else {
    alert("Please select a valid stock and enter a valid quantity.");
  }
});