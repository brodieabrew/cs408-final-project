const recipeInfo = document.getElementById("recipeInfo");
const recipeEdit = document.getElementById("recipeEdit");
const recipeDelete = document.getElementById("recipeDelete");
const recipeTitle = document.getElementById("recipeTitle");

let recipeName = "";

function pageLoad() {
    const searchParams = new URLSearchParams(window.location.search);
    recipeName = searchParams.get("recipe");
    document.title = recipeName;
    recipeTitle.innerText = recipeName;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function() {
        const recipe = JSON.parse(xhr.response);

        document.querySelector('meta[name="description"]').setAttribute("content", recipe.recipeDescription);

        const recipeDescription = document.createElement("p");
        recipeDescription.innerText = recipe.recipeDescription;
        recipeInfo.appendChild(recipeDescription);

        if(recipe.recipeInstructions != null) {
            const recipeInstructions = document.createElement("p");
            recipeInstructions.innerText = recipe.recipeInstructions;
            recipeInfo.appendChild(recipeInstructions);
        }

        if(recipe.ingredientQuantity == null || 
            recipe.ingredientMeasurement == null || 
            recipe.ingredientName == null) {
            
            return;
        }

        if(Array.isArray(recipe.ingredientQuantity)) {
            for(let i = 0; i < recipe.ingredientQuantity.length; ++i) {
                const ingredient = document.createElement("p");
                ingredient.innerText = recipe.ingredientQuantity[i] + " " + recipe.ingredientMeasurement[i] + " " + recipe.ingredientName[i];
                recipeInfo.appendChild(ingredient);
            }
        }
        else {
            const ingredient = document.createElement("p");
            ingredient.innerText = recipe.ingredientQuantity + " " + recipe.ingredientMeasurement + " " + recipe.ingredientName;
            recipeInfo.appendChild(ingredient);
        }
    });

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + recipeName);
    xhr.send();
}

document.addEventListener("DOMContentLoaded", pageLoad);

function recipeEditClicked(event) {
    event.preventDefault();


}

recipeEdit.addEventListener("click", recipeEditClicked);

function recipeDeleteClicked(event) {
    event.preventDefault();

    let res = confirm("Are you sure you want to delete this recipe?");

    if(res === true) {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + recipeName);
        xhr.send();
    
        window.location.href = "/";
    }
}

recipeDelete.addEventListener("click", recipeDeleteClicked);