// @ts-ignore
import icons from 'url:../../img/icons.svg';
import { RecipeSimpleType, RecipeTypeCC, SearchType } from '../types';

export default abstract class View {
  _data?: RecipeTypeCC | RecipeSimpleType[] | RecipeTypeCC[] | SearchType;

  abstract _generateMarkup(): string | undefined;
  abstract _parentElement: Element | null;
  abstract _errorMessage: string;
  abstract _message: string;
  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A makrup string is returned if render=false
   * @this {Object} View instance
   * @author Maksim Ozerskii
   * @tofo Finish implementation
   */

  render(
    data?: RecipeTypeCC | RecipeSimpleType[] | RecipeTypeCC[] | SearchType,
    render = true
  ) {
    // if (!this._parentElement) return;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup: string | undefined = this._generateMarkup();
    console.log(markup);
    if (!render) return markup;

    this._clear();
    if (!this._parentElement) return;
    if (!markup) return;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(
    data?: RecipeTypeCC | RecipeSimpleType[] | RecipeTypeCC[] | SearchType
  ) {
    if (!this._parentElement) return;
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curEelemts = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curEelemts[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
    });
  }

  _clear() {
    if (!this._parentElement) return;
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    if (!this._parentElement) return;
    const markup = `
      <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    if (!this._parentElement) return;
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    if (!this._parentElement) return;
    const markup = `
    <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
     </div>
  `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
