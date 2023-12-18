// @ts-ignore
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX, fetchDelete } from './helpers';
import {
  Ingredient,
  RecipeType,
  RecipeSimpleType,
  RecipeTypeCC,
  RecipeSimpleTypeAJAX,
  DataUploadType,
  SearchType,
} from './types';

type StateType = {
  recipe?: RecipeTypeCC;
  search: SearchType;
  bookmarks?: RecipeTypeCC[];
};

export const state: StateType = {
  recipe: undefined,
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    resultsCurrentlyOnPage: [],
    sorted: false,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipe: RecipeType): RecipeTypeCC {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

type DataDataType = {
  recipe: RecipeType;
};

type DataType = {
  data: DataDataType;
  success: string;
};

export const loadRecipe = async function (id: string) {
  try {
    const data: DataType = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data.data.recipe);

    if (state.bookmarks?.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

type DataDataSearch = {
  recipes: RecipeSimpleTypeAJAX[];
};

type DataSearch = {
  data: DataDataSearch;
  results: number;
  status: string;
};

export const loadSearchResults = async function (query: string) {
  try {
    state.search.query = query;
    const data: DataSearch = await AJAX(
      `${API_URL}?search=${query}&key=${KEY}`
    );

    // Short results with no description
    const shortResults = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // AJAX call for loading full results
    const fullResults: DataType[] = await Promise.all(
      shortResults.map(rec => AJAX(`${API_URL}${rec.id}?key=${KEY}`))
    );

    state.search.results = fullResults.map(data =>
      createRecipeObject(data.data.recipe)
    );

    state.search.page = 1;
  } catch (err) {
    console.log(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  state.search.sorted = false;

  const start: number = (page - 1) * state.search.resultsPerPage; //0
  const end: number = page * state.search.resultsPerPage; // 9
  // if (!state.search.results) return;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings: number) {
  const newRecipe = state?.recipe ? { ...state.recipe } : undefined;
  if (!newRecipe?.servings) return;
  state.recipe?.ingredients.forEach(ing => {
    if (!ing.quantity) return;
    ing.quantity = (ing.quantity * newServings) / newRecipe.servings;
  });

  newRecipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe: RecipeTypeCC) {
  const newRecipe = state.recipe ? { ...state.recipe } : undefined;
  if (!newRecipe?.servings) return;

  // Add bookmark
  state.bookmarks?.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe?.id) newRecipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id: string) {
  const bookmarks = state.bookmarks;
  if (!bookmarks) return;

  // Delete bookmark
  const index = bookmarks.findIndex(recipeBookmark => recipeBookmark.id === id);
  state.bookmarks?.splice(index, 1);

  // Mark current recipe as not bookmark
  if (id === state.recipe?.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear();
};

// clearBookmarks()

export const uploadRecipe = async function (newRecipe: DataUploadType) {
  try {
    console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe: RecipeType = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data: DataType = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const sortResults = function (
  property: keyof RecipeTypeCC,
  direction: string
) {
  // Take results array according to current pagination
  const resultsDisplayedOnPage = getSearchResultsPage();
  if (!resultsDisplayedOnPage) return;

  // Sorting array ASC and DSC
  if (direction === 'up')
    resultsDisplayedOnPage.sort((a: RecipeTypeCC, b: RecipeTypeCC) => {
      // #TODO
      return a[property] < b[property] ? 1 : -1;
    });
  if (direction === 'down') {
    resultsDisplayedOnPage.sort((a, b) => (a[property] > b[property] ? 1 : -1));
  }
  // Change state object for being sorted and assigning sorted array to 'resultsCurrentlyOnPage' property
  state.search.sorted = true;
  state.search.resultsCurrentlyOnPage = resultsDisplayedOnPage;
};

// fetchDelete(`${API_URL}65577bbaa239dd001459371d?key=${KEY}`);
