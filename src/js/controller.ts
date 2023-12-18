// @ts-ignore
import { async } from 'regenerator-runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import booksmarksView from './views/booksmarksView';
import addRecipeView from './views/addRecipeView';
import sortingView from './views/sortingView';
import { MODEL_CLOSE_SEC } from './config';
import { DataUploadType, RecipeTypeCC } from './types';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { RecipeType } from './types.js';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id: string = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results to mark selected search result

    // Check if results sorted
    if (!model.state.search.sorted)
      resultsView.update(model.getSearchResultsPage());

    if (model.state.search.sorted)
      resultsView.update(model.state.search.resultsCurrentlyOnPage);

    // 1) Updating bookmarks view
    booksmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage: number): void {
  // 2) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const conrolServings = function (newServings: number) {
  // 1) Update the recipe servings (in a state)
  model.updateServings(newServings);

  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  booksmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  booksmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe: DataUploadType) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    // Upload recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);

    // Sussess message
    addRecipeView.renderMessage();

    // Render bookmark view
    booksmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const controlSort = function (property: keyof RecipeTypeCC, direction: string) {
  // Change state to sorted
  model.sortResults(property, direction);
  resultsView.update(model.state.search.resultsCurrentlyOnPage);
};

const init = function () {
  booksmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(conrolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  sortingView.addHandlerSortingClicks(controlSort);
};
init();
