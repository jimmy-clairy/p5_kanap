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
        throw error; // Propager l'erreur pour que le code appelant puisse la gérer si nécessaire
    }
};
