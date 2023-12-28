import { fetchData, saveBasket, getBasket } from './functions/functions.js'

const url = new URL(window.location);
const id = url.searchParams.get("_id");

const apiUrl = `http://localhost:3000/api/products/${id}`


const getData = async () => {
  try {
    /**
     * The retrieved data from the API.
     * @type {Object[]}
     */
    const data = await fetchData(apiUrl);
    document.querySelector('title').textContent = data.name
    createItem(data)
  } catch (error) {
    document.querySelector("article").remove();
    document.querySelector(".item").innerHTML = "<h1 class='error'>Erreur 404<br><br>Ressource non trouvée</h1>";
    console.error('Error fetching data:', error)
  }
}
getData()

const product = {
  id,
  color: '',
  quantity: 0
}

function createItem(data) {
  const itemImage = document.querySelector('.item__img');

  const productImg = document.createElement('img');
  productImg.src = data.imageUrl;
  productImg.alt = data.altTxt;
  productImg.title = data.altTxt;

  const productTitle = document.querySelector('#title');
  productTitle.textContent = data.name;

  const productPrice = document.querySelector('#price');
  productPrice.textContent = data.price;

  const productDescription = document.querySelector('#description');
  productDescription.textContent = data.description;

  const productColors = document.querySelector('#colorsSelect');

  for (const color of data.colors) {

    const optionColor = document.createElement('option');

    optionColor.textContent = color;
    optionColor.value = color;

    productColors.append(optionColor);
  }

  itemImage.append(productImg);
}

const colorsSelect = document.querySelector('#colorsSelect');
colorsSelect.addEventListener('change', (e) => {
  product.color = e.target.value;
});


const productQuantity = document.querySelector('#itemQuantity');
productQuantity.addEventListener('change', (e) => {
  product.quantity = Number(e.target.value);
});


const addToCart = document.querySelector('#addToCart');
addToCart.addEventListener('click', () => {
  checkSetColorAndNumber(product)
})

/**
 * Checks the color and quantity conditions before adding the product to the basket.
 * @param {Product} product - The product to be added to the basket.
 */
const checkSetColorAndNumber = (product) => {
  const { color, quantity } = product;

  if (color === "" || quantity <= 0 || quantity >= 101) {
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
  } else {
    addBasket(product);
  }
};

/**
 * Adds the product to the basket and updates the basket storage.
 * @param {product} product - The product to be added to the basket.
 */
const addBasket = (product) => {
  const basket = getBasket()
  const findProduct = basket.find(b => b.id === product.id && b.color === product.color)

  if (findProduct === undefined) {
    basket.push(product)
  } else if (confirm('Même produit et même couleur voulait vous ajouter au panier')) {
    findProduct.quantity += product.quantity
  }

  saveBasket(basket)
}