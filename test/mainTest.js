import { putRecipe, deleteRecipe, getAllRecipes } from "../js/helper.js";
import {recipeDataForm, createRecipe, cancelRecipe, recipeDisplay, recipePopup, pageLoad, submitRecipe} from "../js/main.js";

QUnit.module("Main Functions", function() {

    QUnit.test("Ensure that page loading works", async function(assert) {
        let output = {};
        output.recipeName = "QUnitPageLoadTestOne";
        await putRecipe(JSON.stringify(output));

        let output2 = {};
        output2.recipeName = "QUnitPageLoadTestTwo";
        await putRecipe(JSON.stringify(output2));

        pageLoad();

        const response = await getAllRecipes();
        const recipes = JSON.parse(response);

        assert.equal(recipeDisplay.children.length, recipes.length);

        await deleteRecipe(output.recipeName);
        await deleteRecipe(output2.recipeName);
    });

    QUnit.test("Eunsure submitting recipe works", async function(assert) {
        const testForm = document.getElementById("testForm");
        testForm.onsubmit = submitRecipe;
        
        const testData = testForm[0];
        const savedValue = testData.value;
        testData.value = "QUnitSubmitTest";

        recipePopup.style.display = "block"; 

        let count = recipeDisplay.children.length + 1;
        await testForm.onsubmit(null);
        assert.equal(recipeDisplay.children.length, count);
        assert.equal(recipePopup.style.display, "none");
        assert.equal(testData.value, "testName");

        testData.value = "QUnitSubmitTest";
        recipePopup.style.display = "block";

        let alerted = false;

        const savedAlert = window.alert;
        window.alert = function() {
            alerted = true;
            window.alert = savedAlert;
        }

        await testForm.onsubmit(null);

        assert.equal(recipeDisplay.children.length, count);
        assert.equal(recipePopup.style.display, "block");
        assert.equal(testData.value, "QUnitSubmitTest");
        assert.true(alerted);

        recipeDisplay.removeChild(recipeDisplay.lastChild);
        testData.value = savedValue;
        await deleteRecipe("QUnitSubmitTest");
    });

    QUnit.test("Ensure creating a recipe works", function(assert) {
        recipePopup.style.display = "none";
        createRecipe.click();
        assert.equal(recipePopup.style.display, "block");
    });

    QUnit.test("Ensure canceling a recipe works", function(assert) {
        recipePopup.style.display = "block";
        const testData = recipeDataForm[0];

        testData.value = "something";

        cancelRecipe.click();

        assert.equal(recipePopup.style.display, "none");
        assert.equal(testData.value, "");
    });
});

document.removeEventListener("DOMContentLoaded", pageLoad);