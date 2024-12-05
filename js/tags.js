import { normalizeFormData, addCard } from "./helper.js";

const searchRecipe = document.getElementById("searchRecipe");
const recipeDisplay = document.getElementById("recipeDisplay");

/**
 * Searches for a recipe with the given tag after submission.
 * @param {Event} event An HTML event
 */
function searchRecipeSubmit(event) {
    event.preventDefault();

    const output = normalizeFormData(this);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        const allRecipes = JSON.parse(xhr.response);

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
    });

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

searchRecipe.addEventListener("submit", searchRecipeSubmit);