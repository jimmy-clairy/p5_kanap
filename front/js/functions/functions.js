/**
 * Performs a fetch request to retrieve JSON data from a specified URL.
 *
 * @param {string} url - The URL from which to retrieve JSON data.
 * @returns {Promise<Object>} A promise resolved with the retrieved JSON data.
 * @throws {Error} An error is thrown if the request fails or if the response is not OK.
 */
export const fetchData = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Server problem: ' + response.status);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching data from ' + url + ':', error);
        throw error; // Propagate the error so that the calling code can handle it if necessary
    }
};

/**
* Saves the basket to local storage by converting it to a JSON string.
* @param {Product[]} basket - The basket of products to be saved.
*/
export const saveBasket = (basket) => {
    /**
     * Convert the basket to a JSON string.
     * @type {string}
     */
    const basketJSON = JSON.stringify(basket);

    // Save the JSON string to local storage
    localStorage.setItem("basket", basketJSON);
};

/**
 * Retrieves the current basket from localStorage.
 * @returns {Product[]} An array representing the current basket.
 */
export const getBasket = () => {
    /**
     * The basket data retrieved from localStorage.
     * @type {string | null}
     */
    const basket = localStorage.getItem("basket");

    /**
     * Parses the basket data as JSON or returns an empty array if null.
     * @type {Product[]}
     */
    return basket === null ? [] : JSON.parse(basket);
};