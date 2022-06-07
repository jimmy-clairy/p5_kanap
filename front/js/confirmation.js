// RESEARCH IN URL ID KANAP
const url = new URL(window.location);
const getOrderId = url.searchParams.get("orderId");

orderId.innerHTML += `<br><br>${getOrderId}<br><br>Merci pour vôtre commande.`;