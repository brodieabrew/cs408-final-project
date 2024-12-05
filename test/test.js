import { normalizeFormData, addCard, putRecipe, deleteRecipe, getAllRecipes, getRecipe } from "../js/helper.js";

QUnit.module("Helper Functions", function() {
    QUnit.test("Ensure that normalizing form data works", function(assert) {
        const testForm = document.getElementById("testForm");

        const output = normalizeFormData(testForm);

        assert.equal(output.recipeName, "testName");
        assert.equal(output.recipeDescription, "testDesc");
        assert.equal(output.recipeInstructions, "testInstr");

        assert.true(Array.isArray(output.ingredientQuantity));
        assert.true(Array.isArray(output.ingredientMeasurement));
        assert.true(Array.isArray(output.ingredientName));

        assert.equal(output.ingredientQuantity.length, 2);
        assert.equal(output.ingredientMeasurement.length, 2);
        assert.equal(output.ingredientName.length, 2);

        assert.equal(output.ingredientQuantity[0], 123);
        assert.equal(output.ingredientMeasurement[0], "testMeas1");
        assert.equal(output.ingredientName[0], "testIngName1");

        assert.equal(output.ingredientQuantity[1], 245);
        assert.equal(output.ingredientMeasurement[1], "testMeas2");
        assert.equal(output.ingredientName[1], "testIngName2");
    });

    QUnit.test("Ensure that adding cards work", function(assert) {
        const recipeDisplay = document.getElementById("recipeDisplay");
        let output = {};
        output.recipeName = "QUnitCardTestOne";
        output.recipeDescription = "QUnitCardTestTwo";

        addCard(recipeDisplay, output, "/");

        const mainDiv = recipeDisplay.children[0];
        const newLink = mainDiv.children[0];

        assert.equal(newLink.getAttribute("href"), "/" + output.recipeName);

        const innerDiv = newLink.children[0];
        const header = innerDiv.children[0];
        const paragraph = innerDiv.children[1];

        assert.equal(output.recipeName, header.innerText);
        assert.equal(output.recipeDescription, paragraph.innerText);
    });

    QUnit.test("Ensure that putting a recipe works", async function(assert) {
        let output = {};
        output.recipeName = "QUnitPutTest";
        await putRecipe(JSON.stringify(output));

        const response = await getRecipe(output.recipeName);
        const recipe = JSON.parse(response);

        assert.equal(output.recipeName, recipe.recipeName);

        await deleteRecipe(output.recipeName, null);
    });

    QUnit.test("Ensure that deleting a recipe works", async function(assert) {
        let output = {};
        output.recipeName = "QUnitDeleteTest";
        await putRecipe(JSON.stringify(output));

        await deleteRecipe(output.recipeName, null);

        const response = await getRecipe(output.recipeName);
        assert.equal(0, response.length);
    });

    QUnit.test("Ensure that getting all recipes works", async function(assert) {
        let output = {};
        output.recipeName = "QUnitGetAllTestOne";
        await putRecipe(JSON.stringify(output));

        let output2 = {};
        output2.recipeName = "QUnitGetAllTestTwo";
        await putRecipe(JSON.stringify(output2));

        const response = await getAllRecipes();
        const recipes = JSON.parse(response);

        let count = 0;
        for(const recipe of recipes) {
            if(recipe.recipeName === output.recipeName ||
                recipe.recipeName === output2.recipeName) {
                
                ++count;
            }
        }
        assert.equal(2, count);

        await deleteRecipe(output.recipeName, null);
        await deleteRecipe(output2.recipeName, null)
    });

    QUnit.test("Ensure that getting a recipe works", async function(assert) {
        let output = {};
        output.recipeName = "QUnitGetTest";
        await putRecipe(JSON.stringify(output));

        const response = await getRecipe(output.recipeName);
        const recipe = JSON.parse(response);

        assert.equal(output.recipeName, recipe.recipeName);

        await deleteRecipe(output.recipeName, null);
    });
});

