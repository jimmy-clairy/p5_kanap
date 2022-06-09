// RESEARCH IN URL ID KANAP
const url = new URL(window.location);
const idKanap = url.searchParams.get("_id");

fetch('http://localhost:3000/api/products/'+ idKanap)
.then(reponse => reponse.json())
.then(data => {
  createItem(data);
})
.catch((e) => {
  console.log(e);
  document.querySelector("article").remove();
  document.querySelector(".item").innerHTML = "<h1>Erreur 404<br><br>Ressource non trouvée</h1>";
});

// CREATE OBJET PRODUCT
let product = {
  _id : idKanap
}
// FUNCTIONS START ************************************************************************
// CREATE Item
function createItem(data) {
  // SELECTED OR CREATE ELEMENT
  let itemImage     = document.querySelector('.item__img');
  let img           = document.createElement('img');
  let title         = document.querySelector('#title');
  let price         = document.querySelector('#price');
  let description   = document.querySelector('#description');
  let colors        = document.querySelector('#colors');

  // PERSONNALIZE ELEMENT
  img.src                 = data.imageUrl;
  img.alt                 = data.altTxt;
  img.title               = data.altTxt;

  title.textContent       = data.name;

  price.textContent       = data.price;

  description.textContent = data.description;

  // ADD ELEMENT
  itemImage.append(img);

  // BOUCLE FOR OF CREATE EACH COLOR
  for (const color of data.colors) {
    
    // CREATE ELEMENT
    let optionColor = document.createElement('option');
    // PERSONNALIZE ELEMENT
    optionColor.textContent = color;
    optionColor.value       = color;
    // ADD ELEMENT
    colors.append(optionColor);
  }
}

// LITENER COLORS
colors.addEventListener("change", ()=>{ 
  product.color         = colors.value;
  addToCart.style.color = "white";
  addToCart.textContent = "Ajouter au panier";
})

// LISTENER QUANTITY
quantity.addEventListener("change", () => {
  product.quantity      = Number(quantity.value);
  addToCart.style.color = "white";
  addToCart.textContent = "Ajouter au panier";
})

// LISTENER ADD TO CART
addToCart.addEventListener("click", () => {
  if (product.color === undefined || product.color === "" || product.quantity === undefined || product.quantity > 100 || product.quantity < 1){
    alert("Veuillez sélectioner une couleur\n ou choisir une quantité entre 1 - 100 articles.");
  }else {
    
    if (compare(product)) {
      
      if (confirm("Article de même couleur déjà au panier !\n\n Voulez-vous confirmer ou annuler ?")) {
        addBasket(product);
        addToCart.style.color = "lightgreen";
        addToCart.textContent = "L'article a été ajouter au panier";
      } else {
        addToCart.style.color = "red";
        addToCart.textContent = "L'article a été annuler";
      }

    } else {
      addBasket(product);
      addToCart.style.color = "lightgreen";
      addToCart.textContent = "L'article a été ajouter au panier";
    }
  }
})

// SAVE ITEMS BASKET 
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

// GET ITEMS BASKET 
function getBasket() {
    let basket = localStorage.getItem("basket");

    if (basket == null){
      return [];
    } else {
      return JSON.parse(basket);
    }
}

// ADD ITEMS BASKET 
function addBasket(product) {
  let basket = getBasket();
  // RESEARCH IF ID AND COLOR IDENTICAL
  let foundProduct = basket.find(p => p._id+p.color == product._id+product.color);

  if (foundProduct == undefined) {
    basket.push(product);
  } else {
    foundProduct.quantity += product.quantity;
  }
  tryBasket(basket);
  saveBasket(basket);
}

// TRY BASKET
function tryBasket(tryBasket) {
  tryBasket.sort(function compare(a, b) {
    if (a._id < b._id)
    return -1;
    if (a._id > b._id)
    return 1;
    if (a._id = b._id) {
      if (a.color < b.color)
      return -1;
      if (a.color > b.color)
      return 1;
    }
    return 0;
  });
}

// COMPARE PRODUCT
function compare(product) {
  let basket = getBasket();
  // RESEARCH IF ID AND COLOR IDENTICAL
  let foundProduct = basket.find(p => p._id+p.color == product._id+product.color);
  if (foundProduct != undefined) {
    return true
  }
}
// FUNCTIONS END ************************************************************************