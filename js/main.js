import { normalizeFormData, recipeExists, addCard } from "./helper.js";

const recipeDataForm = document.getElementById("recipeData");
const recipeDisplay = document.getElementById("recipeDisplay");
const createRecipe = document.getElementById("createRecipe");
const cancelRecipe = document.getElementById("cancelRecipe");
const recipeTitle = document.getElementById("recipeTitle");

let recipeCount = 0;

/**
 * Loads all recipe cards in the database on the page load.
 */
function pageLoad() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        const allRecipes = JSON.parse(xhr.response);

        for(const recipe of allRecipes) {
            recipeTitle.innerText = `${++recipeCount} Food Recipes`;
            addCard(recipeDisplay, recipe, "/pages/recipe.html?recipe=");
        }
    });

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

document.addEventListener("DOMContentLoaded", pageLoad);

// TODO: add tests to test.js, add styling

/**
 * Submits a recipe to the database if it doesn't exist already.
 * @param {SubmitEvent} event An HTML submit event
 */
async function submitRecipe(event) {
    event.preventDefault();

    let output = normalizeFormData(this);
    let exists = await recipeExists(output.recipeName);

    if(exists) {
        alert("A recipe with that name already exists!");
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(output));
    
        recipeTitle.innerText = `${++recipeCount} Food Recipes`;
        addCard(recipeDisplay, output, "/pages/recipe.html?recipe=");

        this.reset();

        recipeDataForm.setAttribute("hidden", true);
        createRecipe.removeAttribute("hidden");
    }
}

recipeDataForm.addEventListener("submit", submitRecipe);

/**
 * Enables the recipe submission form and hides the create recipe button.
 * @param {Event} event An HTML event
 */
function createRecipeClicked(event) {
    event.preventDefault();

    recipeDataForm.removeAttribute("hidden");
    createRecipe.setAttribute("hidden", true);
}

createRecipe.addEventListener("click", createRecipeClicked);

/**
 * Disables and clears the recipe submission form and shows the create recipe button.
 * @param {Event} event An HTML event
 */
function cancelRecipeClicked(event) {
    event.preventDefault();

    recipeDataForm.setAttribute("hidden", true);
    recipeDataForm.reset();

    createRecipe.removeAttribute("hidden");
}

cancelRecipe.addEventListener("click", cancelRecipeClicked);