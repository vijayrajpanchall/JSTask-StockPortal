function openForm() {
  document.getElementById("myForm").style.display = "flex";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

const form = document.getElementById("myForm");
const table = document.getElementById("stockTable");

const popup = document.getElementById("myPopup");

popup.addEventListener("click", (event) => {
  const myTable = document.getElementById("stockTable");
  myTable.style.filter = "blur(5px)";
});

const formButton = document.getElementById("myButton");

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

const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");

uploadButton.addEventListener("click", function (event) {
  // Get the selected file from the input element
  const uploadedFile = fileInput.files[0];

  if (uploadedFile) {
    const reader = new FileReader();
    reader.readAsText(uploadedFile);
    reader.onload = function (event) {
      // Parse the uploaded JSON data
      const priceData = JSON.parse(event.target.result);

      // Update table prices based on the parsed JSON
      updateTablePrices(priceData);

      handlePandL(priceData);
    };
  } else {
    // Handle scenario where no file is selected (optional)
    console.log("No file selected");
  }
});

function updateTablePrices(priceData) {
  const table = document.getElementById("stockTable");

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const stockName = row.cells[0].textContent;

    // Find matching price data for the current stock name
    const matchingPrice = priceData.find(
      (priceObject) => priceObject.name === stockName
    );

    if (matchingPrice) {
      // Update the average price with weighted average calculation
      const currentQuantity = parseInt(row.cells[2].textContent);
      const currentInvestedAmount = parseInt(row.cells[1].textContent);
      row.cells[4].textContent = matchingPrice.newPrice;
      const newAveragePrice =
        (currentInvestedAmount + matchingPrice.newPrice * currentQuantity) /
        (currentQuantity + currentQuantity); // Consider buying same quantity again at new price
      row.cells[3].textContent = newAveragePrice.toFixed(2); // Round to 2 decimal places
    } else {
      // Handle scenario where no price is found for the stock (optional)
      console.log(`Price not found for stock: ${stockName}`);
    }
  }
}