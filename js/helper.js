// Credits: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json/49826736#49826736

/**
 * Normalizes form data by creating a JavaScript JSON object with
 * certain properties combined into arrays.
 * 
 * @param {HTMLFormElement} formElement The form element to normalize
 * @returns {*} The normalized form data
 */
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

/**
 * Checks if a recipe exists in the AWS database.
 * 
 * @param {String} recipeName The name of the recipe to check for
 * @returns {boolean} True if the recipe exists, false otherwise
 */
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

/**
 * Adds a recipe card to the recipe display with a custom link.
 * 
 * @param {HTMLElement} recipeDisplay An HTML element for the recipe display
 * @param {*} recipe The recipe data to display
 * @param {String} link The link to redirect to
 */
function addCard(recipeDisplay, recipe, link) {
    let newLink = document.createElement("a");
    newLink.setAttribute("href", link + recipe.recipeName);
    newLink.classList.add("noDecoration");

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("card");

    let innerDiv = document.createElement("div");
    let header = document.createElement("h2");
    header.innerText = recipe.recipeName;

    let paragraph = document.createElement("p");
    paragraph.innerText = recipe.recipeDescription;

    innerDiv.appendChild(header);
    innerDiv.appendChild(paragraph);
    newLink.appendChild(innerDiv);

    mainDiv.appendChild(newLink);
    recipeDisplay.appendChild(mainDiv);
}

export{normalizeFormData, recipeExists, addCard};