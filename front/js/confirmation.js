// RESEARCH IN URL ID KANAP
const url = new URL(window.location);
const getOrderId = url.searchParams.get("orderId");

// Find the orderId element
const orderIdElement = document.getElementById('orderId');

// Check if orderId element is found and getOrderId is not null
if (orderIdElement && getOrderId !== null) {
    // Display orderId using template literals
    orderIdElement.innerHTML = `
        <br><br>${getOrderId}<br><br>
        Merci pour votre commande.
    `;
} else {
    // Handle error if orderId element is not found or getOrderId is null
    console.error("Error: orderId element not found or orderId parameter is null");
}
