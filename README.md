# What's For Dinner

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#demo--screenshots">Demo & Screenshots</a></li>
    <li><a href="#current-issues">Current Issues</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>
<br>


<!-- ABOUT THE PROJECT -->
## About The Project

What’s For Dinner uses the [Spoonacular API](https://spoonacular.com/food-api) to search for recipes using various search parameters including macronutrients, diets, prep/cook time, cuisines and specific ingredients. Each of these parameters is optional. It is also possible to search for recipes directly using keywords in the title, and to generate random recipes.
Due to some issues with the Spoonacular API outlined below, What’s For Dinner is more proof of concept than a tool for reliable recipe searching.

The "include cuisine" and "exclude cuisine" dropdown lists are populated using the cuisines listed [here](https://spoonacular.com/food-api/docs#Cuisines) and are styled using [Choices JS](https://github.com/jshjohnson/Choices).<br>
The "include ingredients" and "exclude ingredients" dropdown lists are populated using Spoonacular's top 1000 ingredients, downloadable [here](https://spoonacular.com/application/frontend/downloads/top-1k-ingredients.csv), also styled using [Choices JS](https://github.com/jshjohnson/Choices).

## Live version [here](https://amy-whatsfordinner.netlify.app/).
<br>

### Built With

* HTML5
* CSS
* JavaScript
* [jQuery](https://jquery.com/) - a JavaScript library designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, and Ajax.
* [Bootstrap](https://getbootstrap.com/) - the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins. 
* [Choices JS](https://github.com/jshjohnson/Choices) - A vanilla, lightweight, configurable select box/text input plugin.
<br>

## Demo & Screenshots
<div align="center">
  <img src="./images/whatsfordinner-fullpage.jpg" width="85%">
</div>
<br><br>
What’s For Dinner can be viewed from any screen size :<br><br>

<div align="center">
  <img src="./images/whatsfordinner-search-small.jpg" height="410px">
  <img src="./images/whatsfordinner-search-medium.jpg" height="410px"><br>
  <img src="./images/whatsfordinner-search-lg.jpg" height="410px">
</div>
<br><br>

<!--  CURRENT ISSUES -->
## Current Issues
There are several issues caused by the inconsistency of the Spoonacular API data. The examples given below are bugs that affect What's For Dinner, but are related to the Spoonacular API.

* Many Spoonacular recipes do not have cuisines included, which makes the “Search by cuisine” feature a little unreliable.

* The calorie and macronutrient data for some recipes has been incorrectly estimated (some examples of <15 calorie meals [here](https://spoonacular.com/alouette-crumbled-goat-cheese-provencal-mini-tacos-632246), [here](https://spoonacular.com/my-favourite-ricotta-sandwich-652861), [here](https://spoonacular.com/truffle-linguine-with-tomatoes-and-pancetta-663885) and [here](https://spoonacular.com/grilled-salmon-salad-with-blood-orange-cilantro-vinaigrette-645849).

* Despite the API listing a set number of [diet types](https://spoonacular.com/food-api/docs#Diets), a search produces other “hidden” diet types that cannot be found in the Spoonacular API documentation. For example:
  - “Dairy free” is not listed as a diet type, but is present in many searches
  - “Paleo” is listed as a diet type, but is present in very few searches, whereas “Paleolithic” is not listed as a diet type, but has been present in many searches

* The serving size data for some recipes is oddly large, making calorie and nutrient data unreliable (for example, a recipe for [apple crumble](https://spoonacular.com/apple-crumble-632522) with 1 cup of flour that serves 100, or a [bread recipe](https://spoonacular.com/2-hour-no-knead-bread-631852) with 1 tablespoon of yeast that serves 96).

* There are multiple issues with the “include ingredients” feature – any ingredients selected must be included in the recipe for it to show up (unlike a “What’s in my fridge” style recipe search). Sometimes a search using 2 ingredients known to be in a Spoonacular recipe will produce no results. For example:
  - A “search recipes by title” search for Raspberry produces a recipe [Strawberry-Raspberry Cobbler](https://spoonacular.com/strawberry-raspberry-cobbler-661930), but an “include ingredients” search for "strawberries" and "raspberries" produces no results at all. It is possible that as the ingredients for this recipe ask for “fresh strawberries” and “fresh raspberries”, the API is not matching “strawberries” or “raspberries” to this recipe.
  - There are many other examples like the one above; the include ingredients feature seems overall to not be well supported by the Spoonacular API.
<br>

<!-- CONTRIBUTING -->
## Contributing

If you find a bug, please open an issue [here](https://github.com/AmyMaule/WhatsForDinner/issues/new), including as much information as you can.<br>
You can request new features or modify current features [here](https://github.com/AmyMaule/WhatsForDinner/issues/new) - please include search queries and expected results.
<br>
<!-- LICENSE -->
## License

MIT © [Amy Maule](https://github.com/AmyMaule)
