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
// make the first page only display the recipe name and description, add
// ability to delete and edit recipes,
// force the user to always have at least one ingredient for each recipe,
// add tests to test.js

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
        value = value.trim();

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

async function recipeExists(recipeName) {
    const xhr = new XMLHttpRequest();

    return new Promise(function(resolve) {
        xhr.addEventListener("load", function() {
            if(xhr.response.length !== 0) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });

        xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + recipeName);
        xhr.send();
    });
}

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