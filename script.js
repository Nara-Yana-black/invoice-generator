// Select the relevant elements
const addRowButton = document.getElementById('addRow');
const invoiceNumberInput = document.getElementById('invoice-number');
const invoiceDateInput = document.getElementById('invoice-date');
const dueDateInput = document.getElementById('due-date');
const customerNameInput = document.getElementById('customer-name');
const customerEmailInput = document.getElementById('customer-email');
const customerPhoneInput = document.getElementById('customer-phone');
const taxInput = document.querySelector('.tax');
const discountInput = document.querySelector('.discount');
const shipmentCostInput = document.querySelector('.shipment-cost');
const amountPaidInput = document.querySelector('.amount-paid');
const subtotalSpan = document.querySelector('.subtotal-value');
const totalSpan = document.querySelector('.total-value');
const balanceDueSpan = document.querySelector('.balance-due');
const logoUploadInput = document.getElementById('logo-upload'); // Hidden file input
const logoContainer = document.getElementById('logo-container'); // Circle for logo
const logoImage = document.getElementById('invoice-logo'); // Image inside the circle
const printButton = document.getElementById('print-invoice');
const saveButton = document.getElementById('save-invoice');

// Handle logo upload
logoUploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoImage.src = e.target.result;
            logoImage.style.display = 'block';
            logoContainer.classList.add('uploaded'); // Add class to indicate an uploaded logo
        };
        reader.readAsDataURL(file);
    }
});

// Click on the circle to trigger file input
logoContainer.addEventListener('click', function() {
    logoUploadInput.click();
});

// Add event listener to the "Add Item" button
addRowButton.addEventListener('click', () => {
    const tableBody = document.querySelector('table tbody');

    // Create a new row
    const newRow = document.createElement('tr');

    // Add cells to the new row
    newRow.innerHTML = `
        <td><input type="text" placeholder="Item Description"></td>
        <td><input type="number" placeholder="0.00" class="unit-price"></td>
        <td><input type="number" placeholder="1" class="quantity"></td>
        <td><span class="subtotal-value">0.00</span></td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Add event listeners for the new row inputs to update subtotal when changed
    const unitPriceInput = newRow.querySelector('.unit-price');
    const quantityInput = newRow.querySelector('.quantity');
    const subtotalValueSpan = newRow.querySelector('.subtotal-value');

    unitPriceInput.addEventListener('input', updateRowSubtotal);
    quantityInput.addEventListener('input', updateRowSubtotal);

    function updateRowSubtotal() {
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 1;
        const subtotal = unitPrice * quantity;
        subtotalValueSpan.textContent = subtotal.toFixed(2);
        updateInvoiceSummary();
    }
});

// Update the invoice summary (subtotal, total, etc.)
function updateInvoiceSummary() {
    const rows = document.querySelectorAll('table tbody tr');
    let subtotal = 0;

    // Calculate subtotal for all items
    rows.forEach(row => {
        const subtotalValue = parseFloat(row.querySelector('.subtotal-value').textContent) || 0;
        subtotal += subtotalValue;
    });

    // Update subtotal display
    subtotalSpan.textContent = subtotal.toFixed(2);

    // Get tax, discount, and shipping cost values
    const tax = parseFloat(taxInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const shippingCost = parseFloat(shipmentCostInput.value) || 0;

    // Calculate tax and discount
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;

    // Calculate total
    const total = subtotal + taxAmount - discountAmount + shippingCost;
    totalSpan.textContent = total.toFixed(2);

    // Calculate balance due
    const amountPaid = parseFloat(amountPaidInput.value) || 0;
    const balanceDue = total - amountPaid;
    balanceDueSpan.textContent = balanceDue.toFixed(2);
}

// Add event listeners to inputs that affect the summary
taxInput.addEventListener('input', updateInvoiceSummary);
discountInput.addEventListener('input', updateInvoiceSummary);
shipmentCostInput.addEventListener('input', updateInvoiceSummary);
amountPaidInput.addEventListener('input', updateInvoiceSummary);

// Initialize the summary on page load
updateInvoiceSummary();

// Handle print invoice
printButton.addEventListener('click', function() {
    window.print();
});

// Handle save invoice (as a PDF)
saveButton.addEventListener('click', function() {
    window.print(); // Save as PDF using the print dialog
});