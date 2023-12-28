import { fetchData } from "./functions/functions.js";

const apiUrl = 'http://localhost:3000/api/products/'

const getData = async () => {
    try {
        const data = await fetchData(apiUrl);
        createItems(data)
    } catch (error) {
        document.querySelector(".titles").innerHTML = `<h1 class='error'>${error}<br><br>Ressource non trouvée</h1>`;
        console.error('Error fetching data:', error)
    }
}
getData()

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