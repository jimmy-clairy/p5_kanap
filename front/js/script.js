import { fetchData } from "./functions/functions.js";

const apiUrl = 'http://localhost:3000/api/products/'

/**
 * Asynchronously fetches data from the specified API endpoint and calls the createItems function.
 * Handles errors by displaying an error message and logging the error to the console.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const getData = async () => {
    try {
        /**
         * The retrieved data from the API.
         * @type {Object[]}
         */
        const data = await fetchData(apiUrl);
        createItems(data)
    } catch (error) {
        document.querySelector(".titles").innerHTML = `<h1 class='error'>${error}<br><br>Ressource non trouvée</h1>`;
        console.error('Error fetching data:', error)
    }
}
getData()

/**
 * Creates HTML elements for each product and appends them to the items container.
 * @param {Object[]} data - The product data to display.
 * @function
 * @returns {void}
 */
function createItems(data) {
    const itemsContainer = document.querySelector('#items');

    for (const product of data) {

        const productLink = document.createElement('a');
        productLink.href = `product.html?_id=${product._id}`;

        const productArticle = document.createElement('article');

        const productImg = document.createElement('img');
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;
        productImg.title = product.altTxt;

        const productName = document.createElement('h3');
        productName.textContent = product.name;

        const productDescription = document.createElement('p');
        productDescription.className = 'productDescription';
        productDescription.textContent = product.description;


        itemsContainer.append(productLink);
        productLink.append(productArticle);
        productArticle.append(productImg, productName, productDescription);
    }
}