import { putRecipe, deleteRecipe } from "../js/helper.js";
import {pageLoad, title, recipe, tags, addIngredient, recipeData, cancelRecipe, recipeEdit, recipeDelete} from "../js/recipe.js";

QUnit.module("Recipe Functions", function() {

    function checkFilloutForm(assert) {
        assert.equal(document.title, recipe.recipeName);
        assert.equal(title.innerText, recipe.recipeName);

        assert.equal(document.querySelector('meta[name="description"]').getAttribute("content"), recipe.recipeDescription);

        if(recipe.recipeInstructions != null) {
            const instructions = document.getElementById("instructions");
            assert.equal(instructions.innerText, recipe.recipeInstructions);
        }
        

        if(recipe.recipeTags != null) {
            if(Array.isArray(recipe.recipeTags)) {
                let counter = 0;

                for(let i = (tags.children.length - 1); i >= 0; --i) {
                    for(const tag of recipe.recipeTags) {
                        if(tag === tags.children[i].innerText) {
                            ++counter;
                            break;
                        }
                    }

                    tags.removeChild(tags.children[i]);
                }

                assert.equal(counter, recipe.recipeTags.length);
            }
            else {
                assert.equal(recipe.recipeTags, tags.children[0]);
                tags.removeChild(tags.children[0]);
            }
        }
    }

    QUnit.test("Ensure recipe page loading works", async function(assert) {
        const searchParams = new URLSearchParams(window.location.search);

        if(searchParams.get("recipe") == null) {
            window.location.search = "?recipe=" + output.recipeName;
        }

        let output = {};
        output.recipeName = "QUnitRecipePageLoadTest";
        output.recipeDescription = "QUnitRecipePageLoadTestDesc";

        await putRecipe(JSON.stringify(output));
        await pageLoad();

        assert.equal(document.title, output.recipeName);
        assert.equal(title.innerText, output.recipeName);

        assert.equal(document.querySelector('meta[name="description"]').getAttribute("content"), output.recipeDescription);

        await deleteRecipe(output.recipeName);
    });

    document.removeEventListener("DOMContentLoaded", pageLoad);
});