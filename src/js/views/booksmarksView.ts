import View from './View';
import previewView from './previewView';
// @ts-ignore
import icons from 'url:../../img/icons.svg';
// import { IView } from './View.js';
import { RecipeSimpleType, RecipeTypeCC, SearchType } from '../types';

// interface IBookmarksView extends IView {
//   _parentElement: Element | null;
//   _errorMessage: string;
//   _message: string;

//   addHandlerRender(handler: () => void): void;

//   _generateMarkup():
//     | RecipeTypeCC
//     | RecipeSimpleType[]
//     | RecipeTypeCC[]
//     | SearchType;
// }

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = ' No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler: () => void) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    if (!this._data) return;
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
