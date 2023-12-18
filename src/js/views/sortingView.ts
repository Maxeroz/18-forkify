import View from './View';
import { RecipeTypeCC } from '../types';

class SortingView extends View {
  _parentElement = document.querySelector('.sorting');
  _message = '';
  _errorMessage = '';

  _generateMarkup() {
    return '';
  }

  addHandlerSortingClicks(
    handler: (property: keyof RecipeTypeCC, direction: string) => void
  ) {
    if (!this._parentElement) return;
    this._parentElement.addEventListener('click', function (e) {
      //   e.preventDefault();
      if (!e.target) return;
      const btn = e.target.closest('.sort-btn');
      if (!btn) return;

      const direction = btn.dataset.direction;
      const property = btn.dataset.property;

      // if (property === 'cooking-time' && direction === 'up')
      handler(property, direction);

      // if (property === 'cooking-time' && direction === 'down')
      handler(property, direction);

      // if (property === 'ingredients' && direction === 'up')
      handler(property, direction);
    });
  }
}

export default new SortingView();
