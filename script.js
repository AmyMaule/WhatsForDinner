import API_KEY from "./apikey.js";
const searchTitlesContainer = document.querySelector(".search-titles-container");
const searchBar = document.querySelector(".search-titles");
const starterResult = document.querySelector(".starter-result");
const starterNoResult = document.querySelector(".starter-no-result");
const searchParams = document.querySelector(".search-params");
const searchByRecipeName = document.querySelector(".search-by-name");
const randomRecipe = document.querySelector(".btn-random");
const searchButton = document.querySelector(".search-btn");
const searchAgain = document.querySelector(".search-again");
const readyTimeButtons = document.querySelectorAll(".ready-input");
const includeIngredsSelector = document.querySelector("#ingreds-multiple-add");
const excludeIngredsSelector = document.querySelector("#ingreds-multiple-remove");
const includeCuisineSelector = document.querySelector("#cuisines-multiple-add");
const excludeCuisineSelector = document.querySelector("#cuisines-multiple-remove");
const maxSugarElement = document.querySelector("#max-sugar-number");
const maxFatElement = document.querySelector("#max-fat-number");
const maxCaloriesElement = document.querySelector("#max-calories-number");
const minProteinElement = document.querySelector("#min-protein-number");
const dietChecklist = document.querySelectorAll(".diet");

const api = {
  base: "https://api.spoonacular.com/recipes/complexSearch",
  key: API_KEY
};

// The syncRangeNumValues function syncs the values of each of the nutrient inputs
function syncRangeNumValues(e) {
  // e.target.value and e.target.id.max are both string values by default
  const value = parseInt(e.target.value);
  // max gets the maximum value for each of the sliders and inputs from the HTML
  const max = document.getElementById(e.target.id).max;
  let currentSlider = e.target;
  let sliderToChange;
  let numberInput;
  // if the currentSlider has a next sibling, it must be a range slider, so its partner, the number input becomes sliderToChange, and numberInput can be set to the same thing
  if (currentSlider.nextElementSibling) {
    sliderToChange = currentSlider.nextElementSibling;
    numberInput = currentSlider.nextElementSibling;
  } else {
    // if the currentSlider does not have a next sibling, it must be the number input, so its partner, the range input, becomes sliderToChange and numberInput is the currentSlider
    sliderToChange = currentSlider.previousElementSibling;
    numberInput = currentSlider;
  }
  let tooltip = new bootstrap.Tooltip(numberInput);
  // By having value < max but not equal to, if the user slides the range all the way to the right, it will clear (in the else part below) to avoid the user accidentally setting the range to 0 when they just wanted to clear the input. It is feasable that the user will intentionally slide the range bar to 0, so 0 must be left available.
  if (value < max) {
    sliderToChange.value = value;
  } else {
    // If the value chosen is the top of the range, the value goes back to being an empty string, and the placeholder text is shown. A tooltip says what the max value is, and is hidden after 700ms
    currentSlider.value = "";
    sliderToChange.value = "";
    tooltip.show();
    setTimeout(() => {
        tooltip.hide();
    }, 700);
  }
}

// The cuisine list comes directly from the API, though isn't available as a downloadable file, format so I just made it into an array
const allCuisines = ["African", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", "French", "German", "Greek", ,"Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"];
let cuisineListObj = [];

function createCuisineObject(arr) {
  arr.forEach(cuisine => {
    cuisineListObj.push(
      {
        value: cuisine,
        label: cuisine,
        selected: false
      });
    });
}
createCuisineObject(allCuisines);


let cuisinesAdd = new Choices('#cuisines-multiple-add', {
  removeItemButton: true,
  duplicateItemsAllowed: false,
  searchResultLimit: 20,
  noChoicesText: 'No items to choose from',
  itemSelectText: "",
  resetScrollPosition: false,
  choices: cuisineListObj
});

let cuisinesRemove = new Choices('#cuisines-multiple-remove', {
  removeItemButton: true,
  duplicateItemsAllowed: false,
  searchResultLimit: 20,
  noChoicesText: 'No items to choose from',
  itemSelectText: "",
  resetScrollPosition: false,
  choices: cuisineListObj
});

let ingredientsAdd = new Choices('#ingreds-multiple-add', {
  removeItemButton: true,
  duplicateItemsAllowed: false,
  noChoicesText: 'No items to choose from',
  searchResultLimit: 50,
  itemSelectText: "",
  resetScrollPosition: false
});

let ingredientsRemove = new Choices('#ingreds-multiple-remove', {
  removeItemButton: true,
  duplicateItemsAllowed: false,
  noChoicesText: 'No items to choose from',
  searchResultLimit: 50,
  itemSelectText: "",
  resetScrollPosition: false
});

let mostCommonIngreds = [];
// The gatherIngredients function creates an XHR object to get the csv file for the 1000 most common ingredients, to display them in the "include ingredients" and "exclude ingredients" boxes - the other ingredients will be searchable and addable, but only the top 1000 ingreds will be displayed as options
(function gatherIngredients() {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => processIngreds(xhr.responseText);
  // the true refers to whether or not the request will be asynchronous
  xhr.open("GET", "top-1k-ingredients.csv", true);
  // xhr.send() actually sends the request
  xhr.send();
})();

function processIngreds(allText) {
  let all1000Lines = allText.split(/\r\n|\n/);
  all1000Lines.forEach(line => {
    let ingredientArray = line.split(";");
    let ingredient = ingredientArray[0];
    let capitalisedIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
    mostCommonIngreds.push(
      {
        value: capitalisedIngredient,
        label: capitalisedIngredient,
        selected: false,
        disabled: false
      });
  });
  ingredientsRemove.setChoices(
    [
      { choices: mostCommonIngreds, },
    ],
    'value',
    'label',
    false
  );
  ingredientsAdd.setChoices(
    [
      { choices: mostCommonIngreds, },
    ],
    'value',
    'label',
    false
  );
}

// sliderSelectors is an array of 8 inputs, one for each range and one for each number input for the nutrients section
const sliderSelectors = Array.from(document.querySelectorAll(".slider-selector"));
sliderSelectors.forEach(selector => {
    selector.addEventListener('input', syncRangeNumValues);
});

function disableCuisines(e) {
  let currentCuisine;
  let otherCuisine;
  // If the clicked selector was for including a cuisine, then currentCuisine is set to the include selector and otherCuisine is set to the remove selector, and vice versa if the clicked selector was for excluding a cuisine
  if (e.target.id == "cuisines-multiple-add") {
    currentCuisine = cuisinesAdd;
    otherCuisine = cuisinesRemove;
  } else if (e.target.id == "cuisines-multiple-remove") {
    currentCuisine = cuisinesRemove;
    otherCuisine = cuisinesAdd;
  }
  // For some reason, the selectedCuisinesOuter array doesn't get smaller as cuisines are removed, it stays the same length and even grows when the same cuisine is added and removed, so the forEach pushes only the active (currently selected) cuisines to the selectedCuisines array, which is redeclared as empty each time the function runs
  let selectedCuisines = [];
  let selectedCuisinesOuter = currentCuisine._currentState.items;
  selectedCuisinesOuter.forEach(cuisine => {
    // if cuisine.active is true, then at least one cuisine has been selected, so its name (cuisine.label) is pushed to selectedCuisines
    if (cuisine.active) {
      selectedCuisines.push(cuisine.label);
    }
  });
  // It is set up so that if there are any active (chosen) cuisines in either selector, the other will immediately disable
  if (selectedCuisines.length > 0) {
    otherCuisine.disable();
  } else {
    otherCuisine.enable();
  }
}
// The 2 elements with the class of cuisine are includeCuisineSelector and excludeCuisineSelector
document.querySelectorAll(".cuisine").forEach(cuisineSelector => cuisineSelector.addEventListener("change", disableCuisines));

// populateIngredInputs edits the choices for each of the ingredient select bars (using choices.js) as ingredients are added and removed
function populateIngredInputs(e) {
  let selector;
  let choicesObj;
  if (e.target.id == "ingreds-multiple-add") {
      selector = excludeIngredsSelector;
      choicesObj = ingredientsRemove;
  } else if (e.target.id == "ingreds-multiple-remove") {
      selector = includeIngredsSelector;
      choicesObj = ingredientsAdd;
  }
  // Make an array using the current selected options for the include selector, to make sure the included items stay included - declaring selectedOptions in this way means that it will always be updated with the current selected items
  let selectedOptions = Array.from(selector.selectedOptions);
  for (let i = 0; i < mostCommonIngreds.length; i++) {
    selectedOptions.forEach(option => {
      // Find the selected options in the mostCommonIngreds array, where all of the selected ingredients are set to false, because both the include and exclude inputs share the mostCommonIngreds array. Briefly set selected to be true, because before re-setting the choices, the selected items must be removed (.removeActiveItems()) or else they will be duplicated when .setChoices() is run.
      if (mostCommonIngreds[i].value == option.value) {
        mostCommonIngreds[i].selected = true;
      }
    });
  }
  // .clearChoices() removes all 1000 most common ingredients from choices, as otherwise .setChoices() acts as a += operator and keeps all the old choices
  choicesObj.clearChoices();
  // .removeActiveItems() removes the selected items from the top bar, so they can be re-added without duplicating by .setChoices()
  choicesObj.removeActiveItems();
  choicesObj.setChoices(
      [
        { choices: mostCommonIngreds, },
      ],
      'value',
      'label',
      false
  );
  // The items that were set to to selected = true must have that value reset to false, or the mostCommonIngreds array can populate the exclude input with the selected items as well
  for (let i = 0; i < mostCommonIngreds.length; i++) {
    selectedOptions.forEach(option => {
      if (mostCommonIngreds[i].value == option.value) {
        mostCommonIngreds[i].selected = false;
      }
    });
  }
}

function includeIngreds(e) {
  // This function runs for both the include and exclude ingredient inputs, so clickedSelector distinguishes which one will be acted on based on what was clicked
  let clickedSelector;
  if (e.target.id == "ingreds-multiple-add") {
      clickedSelector = includeIngredsSelector;
  } else if (e.target.id == "ingreds-multiple-remove") {
      clickedSelector = excludeIngredsSelector;
  }
  // optionsArray contains a list of all of the food items currently selected as ingredients to be included (if excluded was clicked) or excluded if included was clicked
  let optionsArray = [];
  for (let i = 0; i < clickedSelector.length; i++) {
      optionsArray.push(clickedSelector.options[i].value);
  }

  if (optionsArray.length > 0) {
    for (let i = 0; i < mostCommonIngreds.length; i++) {
      optionsArray.forEach(() => {
        if (optionsArray.includes(mostCommonIngreds[i].value)) {
          mostCommonIngreds[i].disabled = true;
        } else {
          mostCommonIngreds[i].disabled = false;
          }
        });
      }
  } else {
    // for some reason, the above for loop works only when at least 1 ingredient remains after de-selecting ingredients, when none remain, it cannot undo the ingredients that were removed in the most recent change
    mostCommonIngreds.forEach(ingred => {
        ingred.disabled = false;
    });
  }
  populateIngredInputs(e);
}

// The 2 elements with the class of ingreds are includeIngredsSelector and excludeIngredsSelector
document.querySelectorAll(".ingreds").forEach(ingredSelector => ingredSelector.addEventListener("change", includeIngreds));

// getFinalReadyTime is called as the user presses the search button, and is the first in a series of functions that gets the final data before fetching it all from the API
function getFinalReadyTime() {
  // readyTime will be the max number of minutes chosen - if no radio button is selected, readyTime should be set as the highest number of minutes, which is 190
  let readyTime = "190";
  // Check to see which of the radio buttons was selected, if any
  readyTimeButtons.forEach(button => {
    if (button.checked) {
      readyTime = button.id;
      // The button id will be ready-XX with XX being the max number of minutes, so slice starts at position 6 and removes ready-
      readyTime = readyTime.slice(6, readyTime.length);
    }
  });
  getFinalCuisines(readyTime);
}

function getFinalCuisines(readyTime) {
  // These variables are the final strings that will be sent in the API request
  let includeCuisineList = "";
  let excludeCuisineList = "";

  for (let i = 0; i < includeCuisineSelector.options.length; i++) {
    // Set the cuisine to be all lower case as this is how they present it in the API docs
    includeCuisineSelector.options[i].value = includeCuisineSelector.options[i].value.toLowerCase();
    // Add each cuisine to cuisineList, separated by a comma
    includeCuisineList += `${includeCuisineSelector.options[i].value},`;
  }
  // To remove any spaces in cuisines with 2 or more words, use .replace() - cuisineList.replace(searchvalue, newvalue) only replaces the first searchValue it comes across, so / /g globally replaces whatever is between the forward slashes (here, a space) with the 2nd value, then .slice(0, -1) removes the final comma from the list
  includeCuisineList = includeCuisineList.replace(/ /g, "%20").slice(0, -1);

  for (let i = 0; i < excludeCuisineSelector.options.length; i++) {
    // Set the cuisine to be all lower case as this is how they present it in the API docs
    excludeCuisineSelector.options[i].value = excludeCuisineSelector.options[i].value.toLowerCase();
    // Add each cuisine to cuisineList, separated by a comma
    excludeCuisineList += `${excludeCuisineSelector.options[i].value},`;
  }
  excludeCuisineList = excludeCuisineList.replace(/ /g, "%20").slice(0, -1);
  getFinalDietsAndNutrients(readyTime, includeCuisineList, excludeCuisineList);
}

function getFinalDietsAndNutrients(readyTime, includeCuisineList, excludeCuisineList) {
  let dietList = "";

  dietChecklist.forEach(diet => {
    if (diet.checked) {
      dietList += `${diet.value},`;
    }
  });
  dietList = dietList.replace(/ /g, "%20").slice(0, -1);

  let maxSugar = maxSugarElement.value;
  let maxFat = maxFatElement.value;
  let maxCalories = maxCaloriesElement.value;
  let minProtein = minProteinElement.value;
  getFinalIngredients(readyTime, includeCuisineList, excludeCuisineList, dietList, maxSugar, maxFat, maxCalories, minProtein);
}

function getFinalIngredients(readyTime, includeCuisineList, excludeCuisineList, dietList, maxSugar, maxFat, maxCalories, minProtein) {
  // includeIngList and excludeIngList are the strings that will be sent to the API
  let includeIngList = "";
  let excludeIngList = "";
  // Add the ingredients currently active in the include ingredients selector to a final ingredsToInclude array, before turning it into a string with each ingredient separated by a comma (as the API requires) to pass to the API call
  let ingredsToInclude = [];
  let ingredsToExclude = [];

  if (includeIngredsSelector.length > 0) {
    for (let i = 0; i < includeIngredsSelector.options.length; i++) {
      ingredsToInclude.push(includeIngredsSelector.options[i].value);
    }
    ingredsToInclude.forEach(ingred => {
      ingred = ingred.toLowerCase();
      includeIngList+= `${ingred},`;
    });
    // To remove any spaces in ingredients with 2 or more words, use .replace() - includeIngList.replace(searchvalue, newvalue) only replaces the first searchValue it comes across, so / /g globally replaces whatever is between the forward slashes (here, a space) with the 2nd value, then .slice(0, -1) removes the final comma from the list
    includeIngList = includeIngList.replace(/ /g, "%20").slice(0, -1);
  }

  // Add the ingredients currently active in the exclude ingredients selector to the final ingredsToExclude array, as above
  if (excludeIngredsSelector.length > 0) {
    for (let i = 0; i < excludeIngredsSelector.length; i++) {
      ingredsToExclude.push(excludeIngredsSelector.options[i].value);
    }
    ingredsToExclude.forEach(ingred => {
      ingred = ingred.toLowerCase();
      excludeIngList+= `${ingred},`;
    });
    excludeIngList = excludeIngList.replace(/ /g, "%20").slice(0, -1);
  }
  // Call displayRecipes using all of the criteria established in this function
  fetchRecipes(includeIngList, excludeIngList, includeCuisineList, excludeCuisineList, readyTime, dietList, maxSugar, maxFat, maxCalories, minProtein);
}

function fetchRecipes(includeIngList, excludeIngList, includeCuisineList, excludeCuisineList, readyTime, dietList, maxSugar, maxFat, maxCalories, minProtein) {
  // Full API call with all parameters included:
  // fetch(`${api.base}?apiKey=${api.key}&includeIngredients=${includeIngList}&excludeIngredients=${excludeIngList}&cuisine=${includeCuisineList}&excludeCuisine=${excludeCuisineList}&maxReadyTime=${readyTime}&diet=${dietList}&minProtein=${minProtein}&maxFat=${maxFat}&maxCalories=${maxCalories}&maxSugar=${maxSugar}&addRecipeInformation=true&number=10)
  let apiCall = `${api.base}?apiKey=${api.key}&maxReadyTime=${readyTime}&addRecipeInformation=true&sort=random&number=10`;
  if (includeIngList) apiCall += `&includeIngredients=${includeIngList}`;
  if (excludeIngList) apiCall += `&excludeIngredients=${excludeIngList}`;
  if (includeCuisineList) apiCall += `&cuisine=${includeCuisineList}`;
  if (excludeCuisineList) apiCall += `&excludeCuisine=${excludeCuisineList}`;
  if (dietList) apiCall += `&diet=${dietList}`;
  if (minProtein) apiCall += `&minProtein=${minProtein}`;
  if (maxFat) apiCall += `&maxFat=${maxFat}`;
  if (maxCalories) apiCall += `&maxCalories=${maxCalories}`;
  if (maxSugar) apiCall += `&maxSugar=${maxSugar}`;
  fetch(apiCall)
  .then(results => results.json())
  .then(recipes => {
    displayRecipes(recipes);
  });
}

// The displayRecipes() function hides the search parameter container and shows the recipes from the API
function displayRecipes(recipes) {
  window.scrollTo(0,0);
  // recipeResults is an array of recipes that match the search criteria
  let recipeResults = recipes.results;
  if (recipeResults.length == 0) {
    starterNoResult.innerHTML += `
    <div class="jumbotron no-results-container">
      <div class="no-results text-center">No recipes matched your criteria</div>
      <div class="no-results text-center"><button class="search-again top-marg" onclick="amend()">Amend search</button></div>
      <div class="no-results text-center"><button class="search-again top-marg" onclick="reset()">Start again</button></div>
    </div>`;
  } else {
  recipeResults.forEach(recipe => {
    // I can't decide whether to let recipes pass without a cuisine or not, so if I do decide that a recipe without a cuisine is not ok, I'll uncomment this if else statement
    // if (recipe.cuisines.length > 0) {
    let cardTitle;
    // Some recipes have really long titles (up to 58 characters during testing) which causes the recipe card to elongate, so if the recipe is too long for 2 lines (roughly 35 characters), the font size decreases to stop it taking up too much space
    if (recipe.title.length > 35) {
      cardTitle = "card-title-small";
    } else {
      cardTitle = "card-title";
    }
    starterResult.innerHTML += `
    <div class="card col align-items-center">
      <div class="img-div">
        <img class="card-img-top" src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="card-body">
        <h5 class="${cardTitle}">${recipe.title}</h5>
        <hr>
        <div class="row row-end">
          <div class="col">
            <span class="card-text"><i class="far fa-clock"></i> ${recipe.readyInMinutes} mins</span>
          </div>
          <div class="col no-padding-left">
            <span class="card-text"><i class="fas fa-utensils"></i> Serves ${recipe.servings}</span>
          </div>
        </div>
        <a href="${recipe.spoonacularSourceUrl}" class="btn btn-go"  target="_blank">Go to recipe</a>
      </div>
    </div>`;
    });
    starterNoResult.innerHTML += `
    </div>
    <div class="jumbotron container no-results-container">
      <div class="no-results text-center"><button class="search-again" onclick="amend()">Amend search</button></div>
      <div class="no-results text-center"><button class="search-again top-marg" onclick="reset()">Start again</button></div>
    </div>`;
  }
  if (!searchParams.classList.contains("hide")) searchParams.classList.add("hide");
}
searchButton.addEventListener("click", getFinalReadyTime);

function getRandomRecipe() {
  window.scrollTo(0,0);
  starterResult.innerHTML = "";
  starterNoResult.innerHTML = "";
  fetch(`${api.base}?apiKey=${api.key}&addRecipeInformation=true&sort=random&number=1`)
  .then(result => result.json())
  .then(results => {
    let randomResult = results.results[0];
      starterResult.innerHTML += `
      <div class="card col align-items-center">
      <div class="img-div">
        <img class="card-img-top" src="${randomResult.image}" alt="${randomResult.title}">
      </div>
      <div class="card-body">
        <h5 class="card-title">${randomResult.title}</h5>
        <hr>
        <div class="row row-end">
          <div class="col">
            <span class="card-text"><i class="far fa-clock"></i> ${randomResult.readyInMinutes} mins</span>
          </div>
          <div class="col no-padding-left">
            <span class="card-text"><i class="fas fa-utensils"></i> Serves ${randomResult.servings}</span>
          </div>
        </div>
        <a href="${randomResult.spoonacularSourceUrl}" class="btn btn-go" target="_blank">Go to recipe</a>
      </div>
    </div>`;
  });
  if (!searchParams.classList.contains("hide")) searchParams.classList.add("hide");
}
randomRecipe.addEventListener("click", getRandomRecipe);

function amend() {
  window.scrollTo(0,0);
  if (searchParams.classList.contains("hide")) searchParams.classList.remove("hide");
  starterResult.innerHTML = "";
  starterNoResult.innerHTML = "";
}

// The reset function is called when the title or "start again" button is clicked, and it rests all the search parameters
function reset() {
    // This seemed to be the easiest way to reset everything
    window.location = window.location;
}
document.querySelector(".title").addEventListener("click", reset);

function hide() {
  searchTitlesContainer.classList.add("hide");
}

searchByRecipeName.addEventListener("click", function() {
  if (searchTitlesContainer.classList.contains("hide")) {
    searchTitlesContainer.classList.remove("hide");
  } else {
    searchTitlesContainer.classList.add("hide");
  }
});

function searchQueryRecipeName() {
  window.scrollTo(0,0);
  starterResult.innerHTML = "";
  starterNoResult.innerHTML = "";
  fetch(`${api.base}?apiKey=${api.key}&titleMatch=${searchBar.value}&addRecipeInformation=true&sort=random&number=10`)
  .then(results => results.json())
  .then(recipes => displayRecipes(recipes));
  searchTitlesContainer.classList.add("hide");
}

searchBar.addEventListener("keypress", e => {
  if (e.keyCode == 13) searchQueryRecipeName();
});