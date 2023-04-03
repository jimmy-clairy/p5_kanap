let basket = getBasket();
let basketOther = [];
let cart = document.querySelector(".cart");

// CHECK LENGTH BASKET
if (basket.length === 0) {
  document.querySelector("h1").textContent = "Votre panier est vide";
  // cart.remove();
  cart.style.display = "none";
} else {

  fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => {
      sortingBasket(data);
    })
    .catch((e) => {
      console.log(e);
      // cart.remove();
      cart.style.display = "none";
      document.querySelector("h1").innerHTML = "<h1>Erreur 404<br><br>Ressource non trouvée</h1>";
    });
}

// SORTING BASKET
function sortingBasket(data) {
  basketOther = getBasket();

  for (let product of basketOther) {
    for (let i = 0; i < data.length; i++) {
      if (product._id === data[i]._id) {

        product.name = data[i].name;
        product.price = data[i].price;
        product.imageUrl = data[i].imageUrl;
        product.description = data[i].description;
        product.altTxt = data[i].altTxt;
      }
    }
  }
  createItems(basketOther);
}

// CREATE ITEMS
function createItems(basketOther) {

  for (const product of basketOther) {

    let sectionCartItems = document.querySelector("#cart__items");

    let articleCartItem = document.createElement("article");
    articleCartItem.className = "cart__item";
    articleCartItem.setAttribute("data-id", product._id);
    articleCartItem.setAttribute("data-color", product.color);
    sectionCartItems.append(articleCartItem);

    let divCartItemImg = document.createElement("div");
    divCartItemImg.className = "cart__item__img";
    articleCartItem.append(divCartItemImg);

    let img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    divCartItemImg.append(img);

    let divCartItenContent = document.createElement("div");
    divCartItenContent.className = "cart__item__content";
    articleCartItem.append(divCartItenContent);

    let divCartItenContentDescription = document.createElement("div");
    divCartItenContentDescription.className = "cart__item__content__description";
    divCartItenContent.append(divCartItenContentDescription);

    let h2 = document.createElement("h2");
    h2.textContent = product.name;
    divCartItenContentDescription.append(h2);

    let pColor = document.createElement("p");
    pColor.textContent = product.color;
    divCartItenContentDescription.append(pColor);

    let pPrice = document.createElement("p");
    // pPrice.textContent  = ("Prix unitaire : " + product.price + " €");  //OPTION 1 UNIT PRICE 
    totalPriceItem(pPrice, product);                                       //OPTION 2 TOTAL PRICE
    divCartItenContentDescription.append(pPrice);

    let divCartItemContentSettings = document.createElement("div");
    divCartItemContentSettings.className = "cart__item__content__settings";
    divCartItenContent.append(divCartItemContentSettings);

    let divCartItemContentSettingsQuantity = document.createElement("div");
    divCartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
    divCartItemContentSettings.append(divCartItemContentSettingsQuantity);

    let pQuantity = document.createElement("p");
    pQuantity.textContent = "Qté : ";
    divCartItemContentSettingsQuantity.append(pQuantity);

    let input = document.createElement("input");
    input.type = "number";
    input.className = "itemQuantity";
    input.name = "itemQuantity";
    input.min = 1;
    input.max = 100;
    input.setAttribute("value", product.quantity);
    divCartItemContentSettingsQuantity.append(input);

    let divCartItemContentSettingsDelete = document.createElement("div");
    divCartItemContentSettingsDelete.className = "cart__item__content__settings__delete";
    divCartItemContentSettings.append(divCartItemContentSettingsDelete);

    let pDeleteItems = document.createElement("p");
    pDeleteItems.className = "deleteItem";
    pDeleteItems.textContent = "Supprimer";
    divCartItemContentSettingsDelete.append(pDeleteItems);

    input.addEventListener("change", () => {
      changeQuantity(product, input.valueAsNumber, articleCartItem, input);
      totalQuantityBasket();
      totalPriceBasket();
      totalPriceItem(pPrice, product);
    })

    pDeleteItems.addEventListener("click", () => {
      removeFromBasket(product, articleCartItem);
      totalQuantityBasket();
      totalPriceBasket();
    })
  }
  totalQuantityBasket();
  totalPriceBasket();
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function alertStyle(element, verif) {
  console.dir(element);
  const colorTrue = "white";
  const colorFalse = "#ffb8b8";
  if (verif) {
    element.style.backgroundColor = colorTrue;
    element.nextElementSibling.textContent = "";
  } else {
    element.nextElementSibling.textContent = `${capitalizeFirstLetter(element.name)} No Valid`;
    element.style.backgroundColor = colorFalse;
  }
}
// FORMULAIRE *********************************************************************************
const form = document.querySelector(".cart__order__form");
// FORM FIRST NAME --------------------------------------------------------
form.firstName.addEventListener("input", () => {
  testFirstName = /^[A-Za-z][A-Za-z\é\è\ê\ë\ä\à\ï\ç\ \-]+$/.test(firstName.value.trim());
  alertStyle(firstName, testFirstName)
})
// FORM LAST NAME ---------------------------------------------------------
form.lastName.addEventListener("input", () => {
  testLastName = /^[A-Za-z][A-Za-z\é\è\ê\ë\ä\à\ï\ç\ \-]+$/.test(lastName.value.trim());
  alertStyle(lastName, testLastName)
})
// FORM ADDRESS -----------------------------------------------------------
form.address.addEventListener("input", () => {
  testAddress = /^[A-Za-z0-9\é\è\ê\ë\ä\à\ï\ç\ \,\'\-]+$/.test(address.value.trim());
  alertStyle(address, testAddress)
})
// FORM CITY --------------------------------------------------------------
form.city.addEventListener("input", () => {
  testCity = /^[A-Za-z][A-Za-z\é\è\ê\ë\ä\à\ï\ç\ \-]+$/.test(city.value.trim());
  alertStyle(city, testCity)
})
// FORM EMAIL --------------------------------------------------------------
form.email.addEventListener("input", () => {
  testEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value.trim());
  alertStyle(email, testEmail)
})

// ORDER FINAL -------------------------------------------------------------
let orderFinal;
let productId = [];

form.addEventListener("submit", (e) => {
  e.preventDefault()
  // CHECK IF ALL TRUE
  if (testFirstName && testLastName && testAddress && testCity && testEmail) {

    for (const product of basket) {
      productId.push(product._id)
    }

    orderFinal = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      },
      products: productId
    };

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderFinal)
    })
      .then(response => response.json())
      .then(data => {
        window.location = "confirmation.html?orderId=" + data.orderId;
      });
    localStorage.clear(basket);

  } else {
    document.querySelector("#order").value = "Veuillez valider tous les champs.";
  }
})