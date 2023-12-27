const fetchData = async (url) => {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error('Problème serveur')
        }
        const data = await res.json()
        console.table(data);
        createItems(data);
    } catch (error) {
        console.error(error);
        document.querySelector(".titles").innerHTML = "<h1 class='error'>Erreur 404<br><br>Ressource non trouvée</h1>";
    }

}

/**
 * Crée des éléments HTML à partir des données de produits et les ajoute au conteneur spécifié.
 * @param {Array} data - Les données des produits.
 */
function createItems(data) {
    const itemsContainer = document.querySelector('#items');

    for (const product of data) {


        const productLink = document.createElement('a');
        productLink.href = "product.html?_id=" + product._id;

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

fetchData('http://localhost:3000/api/products/')