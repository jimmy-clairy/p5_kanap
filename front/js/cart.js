import { fetchData, getBasket, saveBasket } from "./functions/functions.js";

/**
 * Fetches product details from the specified API endpoint.
 * @returns {Promise<Array>} A promise that resolves to an array of product details.
 * @throws {Error} If there is an error fetching the products.
 */
async function fetchProductsDetails() {
    try {
        const data = await fetchData(`http://localhost:3000/api/products/`);
        return data;
    } catch (error) {
        console.error(`Error fetching products`, error);
        handleError(error);
        throw error;
    }
}
// Fetch product details and store them in detailsProducts
const detailsProducts = await fetchProductsDetails()

/**
 * Initializes the shopping cart application.
 * Fetches the current basket, displays products with details,
 * and sets up event listeners for quantity changes and item removal.
 */
function start() {
    const basket = getBasket()

    if (basket.length === 0) {
        ifBasketEmpty()
        return
    }

    const basketWithAllDetails = getBasketWithAllDetails(basket, detailsProducts)

    showProducts(basketWithAllDetails)
    handleBtnDelete()
    handleChangeQuantity()
    updateTotalArticlesAndPrice()
}
start()

/**
 * Enhances the basket with detailed product information.
 * @param {Array} basket - The current basket of products.
 * @param {Array} detailsProducts - The array of detailed product information.
 * @returns {Array} The enhanced basket with detailed product information.
 */
function getBasketWithAllDetails(basket, detailsProducts) {

    for (const product of basket) {
        const foundProduct = detailsProducts.find(detailsProduct => detailsProduct._id === product.id)
        if (foundProduct) {
            product.name = foundProduct.name
            product.price = foundProduct.price
            product.imageUrl = foundProduct.imageUrl
            product.altTxt = foundProduct.altTxt
            product.description = foundProduct.description
        }
    }

    return basket
}

/**
 * Displays the products in the shopping cart.
 * @param {Array} basketWithAllDetails - The basket with detailed product information.
 */
function showProducts(basketWithAllDetails) {
    const cartItems = document.getElementById('cart__items');

    let cartItemsHTML = '';
    for (const product of basketWithAllDetails) {

        cartItemsHTML += `  <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                                <div class="cart__item__img">
                                <img src="${product.imageUrl}" alt="${product.description}">
                                </div>
                                <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>${product.color}</p>
                                    <p>${product.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                                </div>
                            </article>`;
    }

    cartItems.innerHTML = cartItemsHTML;
}

/**
 * Sets up event listeners for quantity changes.
 */
function handleChangeQuantity() {
    const itemsQuantity = document.querySelectorAll('.itemQuantity');
    itemsQuantity.forEach(item => item.addEventListener('change', changeQuantity));
}

/**
 * Handles the change in quantity for a product.
 * @param {Event} e - The change event.
 */
function changeQuantity(e) {
    const element = e.target;
    const cartItem = element.closest('.cart__item');

    const product = {
        quantity: Number(element.value),
        id: cartItem.dataset.id,
        color: cartItem.dataset.color
    };

    const basket = getBasket();
    const foundProduct = basket.find(b => b.id + b.color === product.id + product.color);
    if (product.quantity < 1) {
        if (confirm("Quantité " + product.quantity + " non accepter!\nVoulez-vous supprimer l'article ?\nOu annuler pour retourner a une quantité de 1.")) {
            removeElement(e)
        } else {
            element.value = 1;
            foundProduct.quantity = 1;
            saveBasket(basket);
        }
    } else if (product.quantity > 100) {
        alert("Quantité " + product.quantity + " non accepter!\nRetour a une quantité de 100 maximun.")
        element.value = 100;
        foundProduct.quantity = 100;
        saveBasket(basket);
    } else {
        foundProduct.quantity = product.quantity;
        saveBasket(basket);
    }
    updateTotalArticlesAndPrice()
}

/**
 * Sets up event listeners for item removal.
 */
function handleBtnDelete() {
    const buttonsDelete = document.querySelectorAll('.deleteItem');
    buttonsDelete.forEach(btn => btn.addEventListener('click', removeElement));
}

/**
 * Removes a product from the shopping cart.
 * @param {Event} e - The click event.
 */
function removeElement(e) {
    const element = e.target;
    const cartItem = element.closest('.cart__item');
    const product = {
        id: cartItem.dataset.id,
        color: cartItem.dataset.color
    };

    const basket = getBasket();

    const newBasket = basket.filter(b => b.id + b.color !== product.id + product.color);

    saveBasket(newBasket);
    cartItem.remove();
    updateTotalArticlesAndPrice()
}

/**
 * Displays a message when the shopping cart is empty.
 * @param {string} message - The message to be displayed.
 */
function ifBasketEmpty(message = 'Panier vide') {
    const cart = document.querySelector('.cart');
    const title = document.querySelector('h1');

    cart.innerHTML = "";
    title.innerText = message;
}

/**
 * Displays an error message.
 * @param {string} message - The error message to be displayed.
 */
function handleError(message = 'Error') {
    const cart = document.querySelector('.cart');
    const title = document.querySelector('h1');

    cart.innerHTML = "";
    title.innerText = message;
    title.className = 'error';
}

/**
 * Updates the total quantity and price display in the shopping cart.
 */
function updateTotalArticlesAndPrice() {
    const basket = getBasket()
    if (basket.length === 0) {
        ifBasketEmpty();
        return
    }
    const basketWithAllDetails = getBasketWithAllDetails(basket, detailsProducts)
    let totalPrice = 0
    let totalArticles = 0

    for (const product of basketWithAllDetails) {
        totalPrice += product.quantity * product.price
        totalArticles += product.quantity
    }
    document.getElementById('totalPrice').textContent = totalPrice
    document.getElementById('totalQuantity').textContent = totalArticles
}

// Formulaire
const fields = [
    {
        name: 'firstName',
        element: document.getElementById('firstName'),
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        validate: false,
        errorMessage: 'Le prénom doit contenir uniquement des lettres.'
    },
    {
        name: 'lastName',
        element: document.getElementById('lastName'),
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        validate: false,
        errorMessage: 'Le nom doit contenir uniquement des lettres.'
    },
    {
        name: 'address',
        element: document.getElementById('address'),
        regex: /^[0-9A-Za-zÀ-ÖØ-öø-ÿ\s,'-]+$/u,
        validate: false,
        errorMessage: 'Adresse invalide.'
    },
    {
        name: 'city',
        element: document.getElementById('city'),
        regex: /^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/,
        validate: false,
        errorMessage: 'Ville invalide.'
    },
    {
        name: 'email',
        element: document.getElementById('email'),
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        validate: false,
        errorMessage: 'Email invalide.'
    }
];

fields.forEach(field => {
    field.element.addEventListener('input', (e) => checkRegex(e, field));
});

function checkRegex(e, field) {
    const element = e.target;
    const msgError = element.nextElementSibling;

    const isValid = field.regex.test(element.value);
    field.validate = isValid;
    field.value = element.value;

    msgError.textContent = isValid ? '' : field.errorMessage;
}


const btnOrder = document.getElementById('order')
btnOrder.addEventListener('click', (e) => {
    e.preventDefault()
    const allFieldsValid = fields.every(field => field.validate)

    if (allFieldsValid) {
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createObjetForSend())
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                window.location = "confirmation.html?orderId=" + data.orderId;
            });


    } else {
        console.log("Au moins une propriété 'validate' n'est pas à true.");
    }
})

function createObjetForSend(params) {
    let products = [];
    const basket = getBasket()
    for (const product of basket) {
        products.push(product.id)
    }
    // console.log(basket);
    const contact = {
        firstName: fields[0].value,
        lastName: fields[1].value,
        address: fields[2].value,
        city: fields[3].value,
        email: fields[4].value
    }
    // console.log(contact);
    return { products, contact }
}