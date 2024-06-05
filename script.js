const form = document.getElementById("myForm");
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
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  const stock = document.querySelector('input[name="text"]').value;
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
    const newQuantity = currentQuantity + quantity;
    existingRow.cells[2].textContent = newQuantity;
    // Simulate price retrieval (replace with actual price logic based on uploaded JSON data)
    const currentPrice = existingRow.cells[4].textContent;
    let totalInvested = currentQuantity * existingRow.cells[4].textContent;

    const newInvested = quantity * currentPrice;
    totalInvested += newInvested;
    existingRow.cells[3].textContent = totalInvested / newQuantity;
    existingRow.cells[1].textContent = totalInvested;
  } else {
    // Create a new table row for the new stock
    const newRow = document.createElement("tr");
    const stockCell = document.createElement("td");
    stockCell.textContent = stock;
    const investedCell = document.createElement("td");
    const quantityCell = document.createElement("td");
    quantityCell.textContent = quantity;
    const avgPriceCell = document.createElement("td");

    // Simulate price retrieval (replace with actual price logic based on uploaded JSON data)
    const currentPrice = 100; // Replace with actual price retrieval
    avgPriceCell.textContent = currentPrice;
    const investedAmount = quantity * currentPrice;
    investedCell.textContent = investedAmount;
    newRow.appendChild(stockCell);
    newRow.appendChild(investedCell);
    newRow.appendChild(quantityCell);
    newRow.appendChild(avgPriceCell);
    table.appendChild(newRow);
  }

  // Clear form after successful submission (optional)
  //   form.reset();
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
      const currentInvestedAmount = parseInt(row.cells[1].textContent);
      row.cells[4].textContent = matchingPrice.newPrice;
      const newAveragePrice =
        (currentInvestedAmount + matchingPrice.newPrice * currentQuantity) /
        (currentQuantity + currentQuantity);
      row.cells[3].textContent = newAveragePrice.toFixed(2);

      const investedAmount = parseInt(row.cells[1].textContent);
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

  document.getElementById("profit_amount").textContent = totalProfitOrLoss;
  document.getElementById("investedAmt").textContent = totalInvestedAmount;
  document.getElementById("currentAmt").textContent = totalPLAmount;

  overallPLPercentageCell.textContent = overallPLPercentage.toFixed(2) + "%";

  console.log("Total Invested Amount:", totalInvestedAmount);
  console.log("Total P&L Amount:", totalProfitOrLoss);
  console.log("Overall P&L Percentage:", overallPLPercentage.toFixed(2) + "%");
}
