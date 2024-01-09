import { getBasket } from "./functions/functions.js";

const contactObject = {
    firstName: {
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        msgError: "Le prénom doit contenir uniquement des lettres."
    },
    lastName: {
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        msgError: "Le nom doit contenir uniquement des lettres."
    },
    address: {
        regex: /^[0-9A-Za-zÀ-ÖØ-öø-ÿ\s,'-]+$/u,
        msgError: "Adresse invalide."
    },
    city: {
        regex: /^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/,
        msgError: "Ville invalide."
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        msgError: "Email invalide."
    }
};

export function handleForm() {
    const form = document.querySelector('.cart__order__form')
    form.addEventListener('input', setValueAndShowError)

    const btnOrder = document.getElementById('order')
    btnOrder.addEventListener('click', (e) => {
        e.preventDefault()
        if (checkAllValidates()) {
            postData('http://localhost:3000/api/products/order', createObjetForSend())
                .then((data) => {
                    document.location = `confirmation.html?orderId=${data.orderId}`
                    localStorage.clear()
                }).catch((e) => console.error(e))

        } else {
            alert('Veulliez remplir tous les champs')
        }
    })
}

/**
 * Sets the value, performs validation, and displays error messages for an input field.
 * @param {InputEvent} e - The input event.
 * @private
 */
function setValueAndShowError(e) {
    const target = e.target
    const targetNext = target.nextElementSibling
    const value = target.value.trim()
    const contactKey = contactObject[target.name]

    contactKey.value = value

    if (contactKey.regex.test(value)) {
        contactKey.validate = true
        targetNext.textContent = ""
    } else {
        contactKey.validate = false
        targetNext.textContent = value.length === 0 ? 'Veulliez remplir le champ' : contactKey.msgError
    }
}

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Problème postData')
    }
    return response.json();
}

/**
 * Creates an object with user input and basket data for sending to the server.
 * @returns {Object} - The object containing user input and basket data.
 * @private
 */
function createObjetForSend() {
    const basket = getBasket()
    const products = basket.map(b => b.id)

    const contact = {
        firstName: contactObject.firstName.value,
        lastName: contactObject.lastName.value,
        address: contactObject.address.value,
        city: contactObject.city.value,
        email: contactObject.email.value,
    }

    return { contact, products }
}

/**
 * Checks if all fields have been validated.
 * @returns {boolean} True if all fields are validated, otherwise False.
 */
function checkAllValidates() {
    const arrayAllValidate = []
    for (const key in contactObject) {
        if (contactObject.hasOwnProperty.call(contactObject, key)) {
            const element = contactObject[key];
            arrayAllValidate.push(element.validate)
        }
    }
    return arrayAllValidate.every(v => v)
}