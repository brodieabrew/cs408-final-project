import { normalizeFormData } from "./helper.js";

const recipeInfo = document.getElementById("recipeInfo");
const recipeEdit = document.getElementById("recipeEdit");
const recipeDelete = document.getElementById("recipeDelete");
const title = document.getElementById("title");
const recipeData = document.getElementById("recipeData");

const cancelRecipe = document.getElementById("cancelRecipe");
const addIngredient = document.getElementById("addIngredient");
const ingredientTemplate = document.getElementById("ingredientTemplate");
const recipeIngredients = document.getElementById("recipeIngredients");
const ingredients = document.getElementById("ingredients");

let recipe = null;

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
function newIngredient(id) {
    let div = document.createElement("div");
    div.classList.add("ingredient");
    div.appendChild(ingredientTemplate.content.cloneNode(true));

    div.innerHTML = div.innerHTML.replaceAll("{i}", id);
    recipeIngredients.append(div);
}

let ingredientCounter = 0;

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
            newIngredient(i);
            const ingredientQuantity = document.getElementById(`ingredientQuantity${i}`);
            ingredientQuantity.value = recipe.ingredientQuantity[i];

            const ingredientMeasurement = document.getElementById(`ingredientMeasurement${i}`);
            ingredientMeasurement.value = recipe.ingredientMeasurement[i];

            const ingredientName = document.getElementById(`ingredientName${i}`);
            ingredientName.value = recipe.ingredientName[i];
        }
    }
    else {
        newIngredient(i);
        const ingredientQuantity = document.getElementById(`ingredientQuantity${i}`);
        ingredientQuantity.value = recipe.ingredientQuantity;

        const ingredientMeasurement = document.getElementById(`ingredientMeasurement${i}`);
        ingredientMeasurement.value = recipe.ingredientMeasurement;

        const ingredientName = document.getElementById(`ingredientName${i}`);
        ingredientName.value = recipe.ingredientName;

        ++i;
    }

    ingredientCounter = i;
}

function pageLoad() {
    const searchParams = new URLSearchParams(window.location.search);
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function() {
        recipe = JSON.parse(xhr.response);
        filloutPage(recipe);
    });

    xhr.open("GET", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + searchParams.get("recipe"));
    xhr.send();
}

document.addEventListener("DOMContentLoaded", pageLoad);

function addIngredientClicked(event) {
    event.preventDefault();
    newIngredient(ingredientCounter++);
}

addIngredient.addEventListener("click", addIngredientClicked);

function confirmRecipeClicked(event) {
    event.preventDefault();

    let output = normalizeFormData(this);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(output));

    recipeData.setAttribute("hidden", true);
    this.reset();
    recipeIngredients.innerHTML = "";
    ingredients.innerHTML = "";
    recipe = output;

    filloutPage();

    recipeEdit.removeAttribute("hidden");
    recipeDelete.removeAttribute("hidden");
}

recipeData.addEventListener("submit", confirmRecipeClicked);

function cancelRecipeClicked(event) {
    event.preventDefault();

    recipeData.setAttribute("hidden", true);
    recipeData.reset();
    recipeIngredients.innerHTML = "";

    recipeEdit.removeAttribute("hidden");
    recipeDelete.removeAttribute("hidden");
}

cancelRecipe.addEventListener("click", cancelRecipeClicked);

function recipeEditClicked(event) {
    event.preventDefault();

    filloutForm();

    recipeEdit.setAttribute("hidden", true);
    recipeDelete.setAttribute("hidden", true);
    recipeData.removeAttribute("hidden");
}

recipeEdit.addEventListener("click", recipeEditClicked);

function recipeDeleteClicked(event) {
    event.preventDefault();

    let res = confirm("Are you sure you want to delete this recipe?");

    if(res === true) {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", "https://83wvrq58ja.execute-api.us-east-2.amazonaws.com/items/" + recipe.recipeName);
        xhr.send();
    
        window.location.href = "/";
    }
}

recipeDelete.addEventListener("click", recipeDeleteClicked);