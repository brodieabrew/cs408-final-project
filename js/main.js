const addIngredientButton = document.getElementById("addIngredient");
const recipeDataForm = document.getElementById("recipeData");
const ingredientTemplate = document.getElementById("ingredientTemplate");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeDisplay = document.getElementById("recipeDisplay");
const refreshButton = document.getElementById("refreshButton");

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

// TODO: Add function comments, add more pages, add recipe description,
// make the first page only display the recipe name and description, add
// ability to delete and edit recipes, add error handling for conflicting recipe name,
// force the user to always have at least one ingredient for each recipe

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

// Credits: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json/49826736#49826736
function normalizeFormData(formElement) {
    const entries = new FormData(formElement).entries();
    let output = {};
    let item = null;

    while(item = entries.next().value) {
        // Remove the unique number in the form ID (if it exists)
        let key = item[0];
        key = key.replace(/\d+/g, '');

        let value = item[1];

        // Check if the property already exists
        if(Object.prototype.hasOwnProperty.call(output, key)) {

            // If it's not an array already convert it to one
            let current = output[key];
            if(!Array.isArray(current)) {
                current = output[key] = [current];
            }

            // Push the new value to the end of the array
            current.push(value);
        }
        else {
            output[key] = value;
        }
        
    }

    return output;
}

function submitRecipe(event) {
    event.preventDefault();

    let output = normalizeFormData(this);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(output));

    this.reset();
}

function refresh() {
    window.location.reload();
}

refreshButton.addEventListener("click", refresh);
addIngredientButton.addEventListener("click", addIngredient);
recipeDataForm.addEventListener("submit", submitRecipe);