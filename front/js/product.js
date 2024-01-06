import { fetchData, saveBasket, getBasket } from './functions/functions.js'

const url = new URL(window.location);
const id = url.searchParams.get("_id");
const apiUrl = `http://localhost:3000/api/products/${id}`

const product = {
  id,
  color: '',
  quantity: 0
}

const containerPopup = document.querySelector('.container__popup')

const getData = async () => {
  try {
    const data = await fetchData(apiUrl);
    document.title = data.name
    createItem(data)
  } catch (error) {
    handleDataFetchError();
    console.error('Error fetching data:', error)
  }
}


/**
 * Handles errors that occur during data fetching.
 */
const handleDataFetchError = () => {
  document.querySelector("article").remove();
  document.querySelector(".item").innerHTML = "<h1 class='error'>Error 404<br><br>Resource not found</h1>";
};

/**
 * Creates and displays the product details on the page.
 * @param {Object} data - The product data.
 */
function createItem(data) {
  product.name = data.name
  const itemImage = document.querySelector('.item__img');

  const productImg = document.createElement('img');
  productImg.src = data.imageUrl;
  productImg.alt = data.altTxt;
  productImg.title = data.altTxt;

  document.querySelector('#title').textContent = data.name;
  document.querySelector('#price').textContent = data.price;
  document.querySelector('#description').textContent = data.description;

  const productColors = document.getElementById('colorsSelect');

  for (const color of data.colors) {
    const optionColor = document.createElement('option');

    optionColor.textContent = color;
    optionColor.value = color;

    productColors.append(optionColor);
  }

  itemImage.append(productImg);
}

const colorsSelect = document.getElementById('colorsSelect');
colorsSelect.addEventListener('change', (e) => {
  product.color = e.target.value;
});


const productQuantity = document.getElementById('itemQuantity');
productQuantity.addEventListener('change', (e) => {
  product.quantity = Number(e.target.value);
});


const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', () => {
  checkSetColorAndNumber(product)
})

/**
 * Checks the color and quantity conditions before adding the product to the basket.
 * @param {Object} product - The product to be added to the basket.
 */
const checkSetColorAndNumber = () => {
  const { color, quantity } = product;

  if (color === "" || quantity <= 0 || quantity >= 101) {
    handleInvalidProductInput()
  } else {
    checkQuantityUnder100()
  }
};

/**
 * Handles invalid input when adding the product to the basket.
 */
const handleInvalidProductInput = () => {
  const { color, quantity } = product;
  let errorMessage = '';

  if (color === "") {
    errorMessage = 'Veuillez choisir une couleur';
  } else if (quantity <= 0) {
    errorMessage = 'Veuillez choisir un nombre supérieur à zéro';
  } else if (quantity >= 100) {
    errorMessage = 'Veuillez choisir un nombre inférieur à 100';
  } else {
    errorMessage = 'Veuillez remplir tous les champs';
  }

  alert(errorMessage);
};

/**
 * Checks if the quantity of the product added to the basket exceeds the limit of 100.
 * @param {object} product - The object representing the product to be added to the basket.
 * @param {string} product.id - The product identifier.
 * @param {string} product.color - The color of the product.
 * @param {number} product.quantity - The quantity of the product to be added to the basket.
 */
function checkQuantityUnder100() {
  const basket = getBasket()
  const foundProduct = basket.find(p => p.id + p.color === product.id + product.color)
  if (foundProduct && (foundProduct.quantity + product.quantity) > 100) {
    if (foundProduct.quantity === 100) {
      alert(`Quantité du produit maximal ${foundProduct.quantity} dans le panier. Impossible d'ajouter plus d'articles.`)
      return
    }
    alert(`Quantité du produit trop élevée dans le panier avec ${foundProduct.quantity + product.quantity} articles pour un maximum de 100 par article.\n\nVeuillez sélectionner une quantité inférieure ou égale à ${100 - foundProduct.quantity}.`);
  } else {
    addBasket();
    openPopup();
  };
}

/**
 * Adds the product to the basket and updates the basket storage.
 */
function addBasket() {
  const basket = getBasket()
  const findProduct = basket.find(b => b.id === product.id && b.color === product.color)

  if (findProduct === undefined) {
    basket.push(product)
  } else if (confirm('Même produit et même couleur voulait vous ajouter au panier')) {
    findProduct.quantity += product.quantity
  }

  saveBasket(basket)
}

/**
 * Creates and displays a popup confirming the addition of the product to the basket.
*/
function openPopup() {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.id = 'popup';

  const popupTitle = document.createElement('h3');
  popupTitle.innerHTML = `Produit ajouté<br> ${product.name}`;

  const popupContent = document.createElement('p');
  popupContent.innerHTML = `Quantité ${product.quantity}<br>Couleur ${product.color}`;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Fermer';
  closeButton.addEventListener('click', () => popup.remove())

  containerPopup.appendChild(popup);
  popup.append(popupTitle, popupContent, closeButton);

  setTimeout(() => popup.remove(), 4000)
}

// Fetch data when the page loads
getData()