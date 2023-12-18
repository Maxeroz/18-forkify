export type Ingredient = {
  description: string;
  quantity: number | null;
  unit: string;
};

export type RecipeSimpleTypeAJAX = {
  id: string;
  image_url: string;
  publisher: string;
  title: string;
  key?: string;
};

export type RecipeSimpleType = {
  id: string;
  image: string;
  publisher: string;
  title: string;
  key?: string;
};

export type RecipeTypeCC = {
  id?: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  key?: string;
  bookmarked?: boolean;
};

export type RecipeType = {
  id?: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
  key?: string;
  bookmarked?: boolean;
};

export type DataUploadType = {
  cookingTime: string;
  image: string;
  ['ingredient-1']: string;
  ['ingredient-2']: string;
  ['ingredient-3']: string;
  ['ingredient-4']: string;
  ['ingredient-5']: string;
  ['ingredient-6']: string;
  publisher: string;
  servings: string;
  sourceUrl: string;
  title: string;
};

export type SearchType = {
  query: string;
  results?: RecipeTypeCC[];
  page: number;
  resultsPerPage: number;
  resultsCurrentlyOnPage?: RecipeTypeCC[];
  sorted: boolean;
};
