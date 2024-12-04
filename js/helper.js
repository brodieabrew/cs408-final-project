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

export{normalizeFormData, recipeExists};