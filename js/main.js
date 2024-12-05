import { normalizeFormData, addCard, putRecipe, getAllRecipes, getRecipe } from "./helper.js";

const recipeDataForm = document.getElementById("recipeData");
const recipeDisplay = document.getElementById("recipeDisplay");
const createRecipe = document.getElementById("createRecipe");
const cancelRecipe = document.getElementById("cancelRecipe");
const recipeTitle = document.getElementById("recipeTitle");

let recipeCount = 0;

/**
 * Loads all recipe cards in the database on the page load.
 */
async function pageLoad() {
    const response = await getAllRecipes();
    const allRecipes = JSON.parse(response);

    for(const recipe of allRecipes) {
        recipeTitle.innerText = `${++recipeCount} Food Recipes`;
        addCard(recipeDisplay, recipe, "/pages/recipe.html?recipe=");
    }
}

document.addEventListener("DOMContentLoaded", pageLoad);

// TODO: add tests to test.js, add styling, improve about page

/**
 * Submits a recipe to the database if it doesn't exist already.
 * @param {SubmitEvent} event An HTML submit event
 */
async function submitRecipe(event) {
    event.preventDefault();

    const output = normalizeFormData(this);
    const response = await getRecipe(output.recipeName);

    if(response.length !== 0) {
        alert("A recipe with that name already exists!");
    }
    else {
        putRecipe(JSON.stringify(output));
    
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