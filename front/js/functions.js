



// TRY BASKET
function tryBasket(tryBasket) {
  tryBasket.sort(function compare(a, b) {
    if (a._id < b._id)
      return -1;
    if (a._id > b._id)
      return 1;
    if (a._id = b._id) {
      if (a.color < b.color)
        return -1;
      if (a.color > b.color)
        return 1;
    }
    return 0;
  });
}

// TOTAL PRICE ITEM
function totalPriceItem(pPrice, product) {
  pPrice.textContent = ("Prix total : " + product.quantity * product.price + " €");
}

// TOTAL QUANTITY BASKET
function totalQuantityBasket() {
  let basket = getBasket();
  let result = 0;
  for (const product of basket) {
    result += product.quantity;
  }
  totalQuantity.textContent = result
}

// TOTAL PRICE BASKET
function totalPriceBasket() {
  let result = 0;
  for (const product of basketOther) {
    result += product.quantity * product.price;
  }
  totalPrice.textContent = result;
}

// REMOVE ITEMS 
function removeFromBasket(product, articleCartItem) {

  let basket = getBasket();
  basket = basket.filter(p => p._id + p.color != product._id + product.color);
  saveBasket(basket);

  basketOther = basketOther.filter(p => p._id + p.color != product._id + product.color);

  articleCartItem.remove();

  if (basket.length === 0) {
    document.querySelector("h1").textContent = "Votre panier est vide";
    // cart.remove();
    cart.style.display = "none";
  }
}

// CHANGE QUANTITY 
function changeQuantity(product, quantity, articleCartItem, input) {
  let basket = getBasket();

  let foundProduct = basket.find(p => p._id + p.color == product._id + product.color);
  let foundProductOther = basketOther.find(p => p._id + p.color == product._id + product.color);

  if (foundProduct != undefined && foundProductOther != undefined) {
    foundProduct.quantity = quantity;
    foundProductOther.quantity = quantity;
    saveBasket(basket);

    if (foundProduct.quantity <= 0 && foundProductOther.quantity <= 0) {
      if (confirm("Quantité " + quantity + " non accepter!\nVoulez-vous supprimer l'article ?\nOu annuler pour retourner a une quantité de 1.")) {
        removeFromBasket(product, articleCartItem);
      } else {
        foundProduct.quantity = 1;
        foundProductOther.quantity = 1;
        input.value = 1;

        saveBasket(basket);
      }
    }
  }
}
