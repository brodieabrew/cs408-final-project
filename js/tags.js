import { normalizeFormData, addCard, getAllRecipes } from "./helper.js";

const searchRecipe = document.getElementById("searchRecipe");
const recipeDisplay = document.getElementById("recipeDisplay");

/**
 * Searches for a recipe with the given tag after submission.
 * @param {Event} event An HTML event
 */
async function searchRecipeSubmit(event) {
    event.preventDefault();

    const output = normalizeFormData(this);
    const response = await getAllRecipes();
    const allRecipes = JSON.parse(response);
    for(const recipe of allRecipes) {
        if(Array.isArray(recipe.recipeTags)) {
            for(const recipeTag of recipe.recipeTags) {
                if(output.recipeTag === recipeTag) {
                    addCard(recipeDisplay, recipe, "/pages/recipe.html?recipe=");
                    break;
                }
            }

        }
        else {
            if(output.recipeTag === recipe.recipeTags) {
                addCard(recipeDisplay, recipe, "/pages/recipe.html?recipe=");
            }
        }
    }
}

searchRecipe.addEventListener("submit", searchRecipeSubmit);