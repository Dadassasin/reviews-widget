// src/components/qa/qa-filters.js
import { html } from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw } from '../../twind-setup.js';

export class QaFilters extends BaseComponent {
  static properties = {
    searchText: { type: String },
    sortBy:     { type: String },
    active:     { type: String }
  };

  constructor() {
    super();
    this.searchText = '';
    this.sortBy     = 'date-desc';
    this.active     = 'all';
  }

  _onSearch(e) {
    this.searchText = e.target.value;
    this.dispatchEvent(new CustomEvent('search-change', {
      detail:   this.searchText,
      bubbles:  true,
      composed: true
    }));
  }

  _onSort(e) {
    this.sortBy = e.target.value;
    const [key, dir] = this.sortBy.split('-');
    this.dispatchEvent(new CustomEvent('sort-change', {
      detail:   { key, dir },
      bubbles:  true,
      composed: true
    }));
  }

  _onFilter(e) {
    this.active = e.currentTarget.dataset.f;
    this.dispatchEvent(new CustomEvent('filter-change', {
      detail:   this.active,
      bubbles:  true,
      composed: true
    }));
  }

  _btn(f) {
    return this.active === f
      ? tw`border-sky-600 bg-sky-100`
      : tw`border-gray-200 bg-gray-50 hover:bg-gray-100`;
  }

  render() {
    return html`
      <div class=${tw`mb-6`}>
        <div class=${tw`flex items-center space-x-3 mb-4`}>
          <div class=${tw`relative flex-1`}>
            <input
              .value=${this.searchText}
              @input=${this._onSearch}
              placeholder="Поиск в вопросах"
              class=${tw`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:ring-2 focus:ring-sky-600 focus:outline-none`} />
            <div class=${tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
              <svg width="1em" height="1em" class=${tw`text-gray-500`}><use href="#ri-search-line"/></svg>
            </div>
          </div>
          <select @change=${this._onSort}
                  class=${tw`bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}>
            <option value="date-asc"  ?selected=${this.sortBy==='date-asc'}>По дате (старые)</option>
            <option value="date-desc" ?selected=${this.sortBy==='date-desc'}>По дате (новые)</option>
            <option value="pop-asc"   ?selected=${this.sortBy==='pop-asc'}>Популярность (по возрастанию)</option>
            <option value="pop-desc"  ?selected=${this.sortBy==='pop-desc'}>Популярность (по убыванию)</option>
          </select>
        </div>
        <div class=${tw`flex flex-wrap gap-2`}>
          <button data-f="all" @click=${this._onFilter}
                  class=${`${tw`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn('all')}`}>Все</button>
          <button data-f="answered" @click=${this._onFilter}
                  class=${`${tw`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn('answered')}`}>С ответом</button>
          <button data-f="unanswered" @click=${this._onFilter}
                  class=${`${tw`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn('unanswered')}`}>Без ответа</button>
        </div>
      </div>
    `;
  }
}

customElements.define('qa-filters', QaFilters);
