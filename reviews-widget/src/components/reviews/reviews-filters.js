// src/components/reviews/reviews-filters.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';

export class ReviewFilters extends BaseComponent {
  static properties = {
    searchText: { type: String },
    sortBy:     { type: String },
    active:     { type: String }  // all|1|2|3|4|5|positive|neutral|negative
  };

  constructor() {
    super();
    this.searchText = '';
    this.sortBy     = 'date-asc';
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
    const [key, dir] = e.target.value.split('-');
    this.sortBy = `${key}-${dir}`;
    this.dispatchEvent(new CustomEvent('sort-change', {
      detail:   { key, dir },
      bubbles:  true,
      composed: true
    }));
  }

  _onFilter(e) {
    const f = e.currentTarget.dataset.f;
    this.active = f;
    this.dispatchEvent(new CustomEvent('filter-change', {
      detail:   f,
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
    const stars = [5,4,3,2,1];
    const sentiments = [
      { label: 'Положительные', f: 'positive' },
      { label: 'Нейтральные',   f: 'neutral'  },
      { label: 'Отрицательные', f: 'negative' },
    ];

    return html`
      <div class=${tw`mb-6`}>
        <div class=${tw`flex items-center space-x-3 mb-4`}>
          <div class=${tw`relative flex-1`}>
            <input
              .value=${this.searchText}
              @input=${this._onSearch}
              placeholder="Поиск в отзывах"
              class=${tw`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:ring-2 focus:ring-sky-600 focus:outline-none`} />
            <div class=${tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
              <svg width="1em" height="1em" class=${tw`text-gray-500`}><use href="#ri-search-line"/></svg>
            </div>
          </div>
          <select
            @change=${this._onSort}
            class=${tw`bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}>
            <option value="date-asc"  ?selected=${this.sortBy==='date-asc'}>По дате (сначала старые)</option>
            <option value="date-desc" ?selected=${this.sortBy==='date-desc'}>По дате (сначала новые)</option>
            <option value="pop-asc"   ?selected=${this.sortBy==='pop-asc'}>По популярности (по возрастанию)</option>
            <option value="pop-desc"  ?selected=${this.sortBy==='pop-desc'}>По популярности (по убыванию)</option>
          </select>
        </div>

        <div class=${tw`flex flex-wrap gap-2`}>
          <button
            data-f="all"
            @click=${this._onFilter}
            class=${`${tw`border px-3 py-2 rounded-xl focus:outline-none`} ${this._btn('all')}`}>
            Все
          </button>

          ${stars.map(n => html`
            <button
              data-f="${n}"
              @click=${this._onFilter}
              class=${`${tw`border px-3 py-2 rounded-xl flex items-center whitespace-nowrap focus:outline-none fill-current`} ${this._btn(String(n))}`}>
              ${n}
              <svg class=${tw`ml-1 text-yellow-400`} width="1em" height="1em"><use href="#ri-star-fill"/></svg>
            </button>
          `)}

          ${sentiments.map(s => html`
            <button
              data-f="${s.f}"
              @click=${this._onFilter}
              class=${`${tw`border px-3 py-2 rounded-xl whitespace-nowrap focus:outline-none`} ${this._btn(s.f)}`}>
              ${s.label}
            </button>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('reviews-filters', ReviewFilters);
