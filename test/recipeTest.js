import { putRecipe, deleteRecipe } from "../js/helper.js";
import {pageLoad, title, recipe, addIngredient, recipeData, cancelRecipe, recipeEdit, recipeDelete} from "../js/recipe.js";

QUnit.module("Recipe Functions", function() {

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