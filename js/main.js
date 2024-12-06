import { normalizeFormData, addCard, putRecipe, getAllRecipes, getRecipe } from "./helper.js";

const recipeDataForm = document.getElementById("recipeData");
const recipeDisplay = document.getElementById("recipeDisplay");
const createRecipe = document.getElementById("createRecipe");
const cancelRecipe = document.getElementById("cancelRecipe");
const recipeTitle = document.getElementById("recipeTitle");
const recipePopup = document.getElementById("recipePopup");

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

/**
 * Submits a recipe to the database if it doesn't exist already.
 * @param {SubmitEvent} event An HTML submit event
 */
async function submitRecipe(event) {
    if(event != null) {
        event.preventDefault();
    }

    const output = normalizeFormData(this);
    const response = await getRecipe(output.recipeName);

    if(response.length !== 0) {
        alert("A recipe with that name already exists!");
    }
    else {
        await putRecipe(JSON.stringify(output));
    
        recipeTitle.innerText = `${++recipeCount} Food Recipes`;
        addCard(recipeDisplay, output, "/pages/recipe.html?recipe=");

        this.reset();

        recipePopup.style.display = "none";
    }
}

recipeDataForm.addEventListener("submit", submitRecipe);

/**
 * Enables the recipe submission form and hides the create recipe button.
 * @param {Event} event An HTML event
 */
function createRecipeClicked(event) {
    event.preventDefault();

    recipePopup.style.display = "block";
}

createRecipe.addEventListener("click", createRecipeClicked);

/**
 * Disables and clears the recipe submission form and shows the create recipe button.
 * @param {Event} event An HTML event
 */
function cancelRecipeClicked(event) {
    event.preventDefault();

    recipePopup.style.display = "none";
    recipeDataForm.reset();
}

cancelRecipe.addEventListener("click", cancelRecipeClicked);

export{recipeDataForm, createRecipe, cancelRecipe, recipeDisplay, recipePopup, pageLoad, submitRecipe, createRecipeClicked, cancelRecipeClicked};