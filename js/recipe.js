const recipeInfo = document.getElementById("recipeInfo");

function pageLoad() {
    const searchParams = new URLSearchParams(window.location.search);
    document.title = searchParams.get("recipe");
    document.querySelector('meta[name="description"]').setAttribute("content", "TODO: Replace with recipe description");

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function() {
        const recipe = JSON.parse(xhr.response);

        const recipeName = document.createElement("p");
        recipeName.innerText = recipe.recipeName;
        recipeInfo.appendChild(recipeName);

        const recipeInstructions = document.createElement("p");
        recipeInstructions.innerText = recipe.recipeInstructions;
        recipeInfo.appendChild(recipeInstructions);

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

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + searchParams.get("recipe"));
    xhr.send();
}

document.addEventListener("DOMContentLoaded", pageLoad);