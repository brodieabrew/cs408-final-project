import { normalizeFormData, recipeExists } from "./helper.js";

const recipeDataForm = document.getElementById("recipeData");
const recipeDisplay = document.getElementById("recipeDisplay");
const createRecipe = document.getElementById("createRecipe");
const cancelRecipe = document.getElementById("cancelRecipe");

function pageLoad() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        const allRecipes = JSON.parse(xhr.response);
        for(const recipe of allRecipes) {
            let newLink = document.createElement("a");
            newLink.setAttribute("href", "pages/recipe.html?recipe=" + recipe.recipeName);
            newLink.innerText = recipe.recipeName;

            recipeDisplay.appendChild(newLink);
            recipeDisplay.appendChild(document.createElement("br"));
        }
    });

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

document.addEventListener("DOMContentLoaded", pageLoad);

// TODO: Add function comments, add more pages,
// make the first page only display the recipe name and description
// add tests to test.js, add styling

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
    
        let newLink = document.createElement("a");
        newLink.setAttribute("href", "pages/recipe.html?recipe=" + output.recipeName);
        newLink.innerText = output.recipeName;

        recipeDisplay.appendChild(newLink);
        recipeDisplay.appendChild(document.createElement("br"));

        this.reset();

        recipeDataForm.setAttribute("hidden", true);
        createRecipe.removeAttribute("hidden");
    }
}

recipeDataForm.addEventListener("submit", submitRecipe);

function createRecipeClicked(event) {
    event.preventDefault();

    recipeDataForm.removeAttribute("hidden");
    createRecipe.setAttribute("hidden", true);
}

createRecipe.addEventListener("click", createRecipeClicked);

function cancelRecipeClicked(event) {
    event.preventDefault();

    recipeDataForm.setAttribute("hidden", true);
    recipeDataForm.reset();

    createRecipe.removeAttribute("hidden");
}

cancelRecipe.addEventListener("click", cancelRecipeClicked);