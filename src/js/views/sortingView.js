import View from './View.js';

class SortingView extends View {
  _parentElement = document.querySelector('.sorting');

  addHandlerSortingClicks(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //   e.preventDefault();
      const btn = e.target.closest('.sort-btn');
      if (!btn) return;

      const direction = btn.dataset.direction;
      const property = btn.dataset.property;

      if (property === 'cooking-time' && direction === 'up') {
        console.log('asc sort');

        handler(property, direction);
      }
      if (property === 'cooking-time' && direction === 'down') {
        console.log('dsc sort');
        handler(property, direction);
      }
    });
  }
}

export default new SortingView();
