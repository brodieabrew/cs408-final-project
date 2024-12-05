import { normalizeFormData, putRecipe, deleteRecipe, getAllRecipes, getRecipe } from "./helper.js";

const recipeEdit = document.getElementById("recipeEdit");
const recipeDelete = document.getElementById("recipeDelete");
const title = document.getElementById("title");
const recipeData = document.getElementById("recipeData");

const cancelRecipe = document.getElementById("cancelRecipe");
const addIngredient = document.getElementById("addIngredient");
const ingredientTemplate = document.getElementById("ingredientTemplate");
const recipeIngredients = document.getElementById("recipeIngredients");
const ingredients = document.getElementById("ingredients");
const tags = document.getElementById("tags");
const recipePopup = document.getElementById("recipePopup"); 

let recipe = null;

/**
 * Fills out the page dynamically with the recipe data.
 */
function filloutPage() {
    document.title = recipe.recipeName;
    title.innerText = recipe.recipeName;
    document.querySelector('meta[name="description"]').setAttribute("content", recipe.recipeDescription);

    const description = document.getElementById("description");
    description.innerText = recipe.recipeDescription;

    if(recipe.recipeInstructions != null) {
        const instructions = document.getElementById("instructions");
        instructions.innerText = recipe.recipeInstructions;
    }

    if(recipe.recipeTags != null) {
        if(Array.isArray(recipe.recipeTags)) {
            for(let i = 0; i < recipe.recipeTags.length; ++i) {
                const tag = document.createElement("li");
                tag.innerText = recipe.recipeTags[i];
                tags.appendChild(tag);
            }
        }
        else {
            const tag = document.createElement("li");
            tag.innerText = recipe.recipeTags;
            tags.appendChild(tag);
        }
    }

    if(recipe.ingredientQuantity == null || 
        recipe.ingredientMeasurement == null || 
        recipe.ingredientName == null) {
        
        return;
    }

    if(Array.isArray(recipe.ingredientQuantity)) {
        for(let i = 0; i < recipe.ingredientQuantity.length; ++i) {
            const ingredient = document.createElement("li");
            ingredient.innerText = recipe.ingredientQuantity[i] + " " + recipe.ingredientMeasurement[i] + " " + recipe.ingredientName[i];
            ingredients.appendChild(ingredient);
        }
    }
    else {
        const ingredient = document.createElement("li");
        ingredient.innerText = recipe.ingredientQuantity + " " + recipe.ingredientMeasurement + " " + recipe.ingredientName;
        ingredients.appendChild(ingredient);
    }

}

// Credits: https://stackoverflow.com/a/69362263 

/**
 * Adds a new ingredient to the recipe form.
 * @param {number} id A number representing part of the ingredient ID
 */
function newIngredient(id, quantity, measurement, name) {
    let div = document.createElement("div");
    div.classList.add("ingredient");
    div.appendChild(ingredientTemplate.content.cloneNode(true));

    div.innerHTML = div.innerHTML.replaceAll("{i}", id);
    recipeIngredients.append(div);

    const ingredientQuantity = document.getElementById(`ingredientQuantity${id}`);
    ingredientQuantity.value = quantity;

    const ingredientMeasurement = document.getElementById(`ingredientMeasurement${id}`);
    ingredientMeasurement.value = measurement;

    const ingredientName = document.getElementById(`ingredientName${id}`);
    ingredientName.value = name;

    const ingredientDelete = document.getElementById(`ingredientDelete${id}`);
    ingredientDelete.addEventListener("click", function() {
        recipeIngredients.removeChild(div);
    });
}

let ingredientCounter = 0;

/**
 * Fills out the recipe form with existing data.
 */
function filloutForm() {
    const recipeName = document.getElementById("recipeName");
    recipeName.value = recipe.recipeName;

    const recipeDescription = document.getElementById("recipeDescription");
    recipeDescription.value = recipe.recipeDescription;

    if(recipe.recipeInstructions != null) {
        const recipeInstructions = document.getElementById("recipeInstructions");
        recipeInstructions.value = recipe.recipeInstructions;
    }
    
    if(recipe.ingredientQuantity == null || 
        recipe.ingredientMeasurement == null || 
        recipe.ingredientName == null) {
        
        return;
    }

    let i = 0;
    if(Array.isArray(recipe.ingredientQuantity)) {
        for(; i < recipe.ingredientQuantity.length; ++i) {
            newIngredient(i, recipe.ingredientQuantity[i], recipe.ingredientMeasurement[i], recipe.ingredientName[i]);
        }
    }
    else {
        newIngredient(i++, recipe.ingredientQuantity, recipe.ingredientMeasurement, recipe.ingredientName);
    }

    ingredientCounter = i;
}

/**
 * Loads the recipe data when the page loads.
 */
async function pageLoad() {
    const searchParams = new URLSearchParams(window.location.search);
    const response = await getRecipe(searchParams.get("recipe"));
    recipe = JSON.parse(response);
    filloutPage(recipe);
}

document.addEventListener("DOMContentLoaded", pageLoad);

/**
 * Adds a new ingredient to the form when clicked.
 * @param {Event} event An HTML event
 */
function addIngredientClicked(event) {
    event.preventDefault();
    newIngredient(ingredientCounter++, null, null, null);
}

addIngredient.addEventListener("click", addIngredientClicked);

/**
 * Submits the current recipe form to the server and updates the page.
 * @param {Event} event An HTML event
 */
function confirmRecipeClicked(event) {
    event.preventDefault();

    const output = normalizeFormData(this);
    putRecipe(JSON.stringify(output));

    recipePopup.style.display = "none";
    this.reset();

    tags.innerHTML = "";
    recipeIngredients.innerHTML = "";
    ingredients.innerHTML = "";
    recipe = output;

    filloutPage();
}

recipeData.addEventListener("submit", confirmRecipeClicked);

/**
 * Clears the form and reverts the page to normal.
 * @param {Event} event An HTML event
 */
function cancelRecipeClicked(event) {
    event.preventDefault();

    recipePopup.style.display = "none";
    recipeData.reset();
    recipeIngredients.innerHTML = "";
}

cancelRecipe.addEventListener("click", cancelRecipeClicked);

/**
 * Enables the recipe submission form.
 * @param {Event} event An HTML event
 */
function recipeEditClicked(event) {
    event.preventDefault();

    filloutForm();

    recipePopup.style.display = "block";
}

recipeEdit.addEventListener("click", recipeEditClicked);

/**
 * Deletes the recipe from the server and redirects to the home page.
 * @param {Event} event An HTML event
 */
function recipeDeleteClicked(event) {
    event.preventDefault();

    let res = confirm("Are you sure you want to delete this recipe?");

    if(res === true) {
        deleteRecipe(recipe.recipeName, function() {
            window.location.href = "/";
        });
    }
}

recipeDelete.addEventListener("click", recipeDeleteClicked);