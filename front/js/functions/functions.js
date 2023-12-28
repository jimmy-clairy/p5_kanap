/**
 * Performs a fetch request to retrieve JSON data from a specified URL.
 *
 * @param {string} url - The URL from which to retrieve JSON data.
 * @returns {Promise<Object>} A promise resolved with the retrieved JSON data.
 * @throws {Error} An error is thrown if the request fails or if the response is not OK.
 */
export const fetchData = async (url) => {
    try {
        /**
         * The response from the fetch request.
         * @type {Response}
         */
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Server problem: ' + response.status);
        }

        /**
         * The retrieved JSON data.
         * @type {Object}
         */
        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching data from ' + url + ':', error);
        throw error; // Propagate the error so that the calling code can handle it if necessary
    }
};

// SAVE ITEMS BASKET 
export function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

// GET ITEMS BASKET 
export function getBasket() {
    const basket = localStorage.getItem("basket");

    if (basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

// ADD ITEMS BASKET 
export function addBasket(product) {
    console.log(product);
    const basket = getBasket();
    // RESEARCH IF ID AND COLOR IDENTICAL
    const foundProduct = basket.find(b => b._id + b.color == product._id + product.color);

    if (foundProduct === undefined) {
        basket.push(product);
    } else {
        foundProduct.quantity += product.quantity;
    }
    saveBasket(basket);
}