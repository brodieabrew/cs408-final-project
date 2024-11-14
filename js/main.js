const addIngredientButton = document.getElementById("add-ingredient");
const recipeDataForm = document.getElementById("recipe-data");
const ingredientTemplate = document.getElementById("ingredient-template");
const recipeIngredients = document.getElementById("recipe-ingredients");

let counter = 0;

// Credits: https://stackoverflow.com/a/69362263 
function addIngredient(event) {
    event.preventDefault();

    let div = document.createElement("div");
    div.classList.add("ingredient");
    div.appendChild(ingredientTemplate.content.cloneNode(true));

    div.innerHTML = div.innerHTML.replaceAll("{i}", ++counter);
    recipeIngredients.append(div);
}

function submitRecipe(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const xhr = new XMLHttpRequest();

    // TODO: Convert formData to JSON with proper arrays for ingredients
    // Perhaps create an object to represent an ingredient
    let d = Object.fromEntries(formData);
    this.reset();
}

addIngredientButton.addEventListener("click", addIngredient);
recipeDataForm.addEventListener("submit", submitRecipe);