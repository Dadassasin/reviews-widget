// src/components/reviews/reviews-section.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';

import './reviews-filters.js';
import './reviews-list.js';
import '../general/media-gallery.js';

export class ReviewsSection extends BaseComponent {
  static properties = {
    reviews:     { type: Array },
    currentUser: { type: Object },
    pageSize:    { type: Number },
    allowAnonymous:{type:Boolean},
    _page:       { state: true },
    _search:     { state: true },
    _sortKey:    { state: true },
    _sortDir:    { state: true },
    _filter:     { state: true }
  };

  constructor() {
    super();
    this.reviews     = [];
    this.currentUser = {};
    this.pageSize    = 5;
    this._page       = 1;
    this._search     = '';
    this._sortKey    = 'date';
    this._sortDir    = 'desc';
    this._filter     = 'all';
    this._procCache  = new Map();
  }

  _ensureArray(arr) {
    if (!Array.isArray(arr)) {
      console.error('Expected array, got', arr);
      return [];
    }
    return arr;
  }

  _parseDate(str) {
    const [day, monthName, year] = str.split(' ');
    const months = {
      января:0, февраля:1, марта:2, апреля:3, мая:4, июня:5,
      июля:6, августа:7, сентября:8, октября:9, ноября:10, декабря:11
    };
    return new Date(Number(year), months[monthName] ?? 0, Number(day));
  }

  _topReview() {
    const list = this._ensureArray(this.reviews);
    if (!list.length) return null;
    return list.reduce((best, r) => {
      const bestScore = (best.likes||0) - (best.dislikes||0);
      const curScore  = (r.likes||0)  - (r.dislikes||0);
      return curScore > bestScore ? r : best;
    }, list[0]);
  }

  _processed(excludeId = null) {
    const key = JSON.stringify({
      q: this._search.trim().toLowerCase(),
      f: this._filter,
      sk: this._sortKey,
      sd: this._sortDir,
      ex: excludeId,
      u: this.currentUser.isAuthenticated
    });
    if (this._procCache.has(key)) {
      return [...this._procCache.get(key)];
    }

    let arr = [...this._ensureArray(this.reviews)];

    if (this._search) {
      const q = this._search.toLowerCase();
      arr = arr.filter(r => r.text.toLowerCase().includes(q) || r.author.name.toLowerCase().includes(q));
    }
    if (this._filter !== 'all') {
      if (/^[1-5]$/.test(this._filter)) {
        arr = arr.filter(r => r.rating === +this._filter);
      } else {
        arr = arr.filter(r => r.sentiment === this._filter);
      }
    }
    arr.sort((a, b) => {
      let diff = 0;
      if (this._sortKey === 'date') {
        diff = this._parseDate(a.date) - this._parseDate(b.date);
      } else {
        const pa = (a.likes||0) - (a.dislikes||0);
        const pb = (b.likes||0) - (b.dislikes||0);
        diff = pa - pb;
      }
      return this._sortDir === 'desc' ? -diff : diff;
    });
    if (excludeId != null) arr = arr.filter(r => r.id !== excludeId);

    this._procCache.set(key, arr);
    return [...arr];
  }

  _slice(excludeId) {
    return this._processed(excludeId).slice(0, this._page * this.pageSize);
  }

  updated(changedProps) {
    if (
      changedProps.has('reviews')   ||
      changedProps.has('currentUser') ||
      changedProps.has('_search')   ||
      changedProps.has('_filter')   ||
      changedProps.has('_sortKey')  ||
      changedProps.has('_sortDir')  ||
      changedProps.has('_page')
    ) {
      this._procCache.clear();
    }
  }

  _onSearch = e => {
    clearTimeout(this._searchDebounce);
    this._searchDebounce = setTimeout(() => {
      this._search = e.detail;
      this._page   = 1;
      this._procCache.clear();
    }, 100);
  };

  _onSort = e => {
    this._sortKey = e.detail.key;
    this._sortDir = e.detail.dir;
    this._page    = 1;
    this._procCache.clear();
  };

  _onFilter = e => {
    clearTimeout(this._filterDebounce);
    this._filterDebounce = setTimeout(() => {
      this._filter = e.detail;
      this._page   = 1;
      this._procCache.clear();
    }, 100);
  };

  _loadMore = () => {
    this._page++;
    this._procCache.clear();
  };

  render() {
    const allMedia = this._ensureArray(this.reviews).flatMap(r => r.media || []);
    const top      = this._topReview();
    const topId    = top?.id ?? null;
    const sliced   = this._slice(topId);
    const total    = this._processed(topId).length;
    const shown    = sliced.length;
    const hasMore  = shown < total;
    const list     = top ? [top, ...sliced] : sliced;

    return html`
      ${allMedia.length ? html`
        <div class=${tw`mb-6`}>
          <media-gallery
            .media=${allMedia}
            @view-media=${e => this.dispatchEvent(new CustomEvent('view-media', {
              detail:   { media: allMedia, index: e.detail.index },
              bubbles:  true,
              composed: true
            }))}>
          </media-gallery>` : ''}

      <reviews-filters
        .searchText=${this._search}
        .sortBy=${`${this._sortKey}-${this._sortDir}`}
        .active=${this._filter}
        @search-change=${this._onSearch}
        @sort-change=${this._onSort}
        @filter-change=${this._onFilter}>
      </reviews-filters>

      <reviews-list
        .reviews=${list}
        .currentUser=${this.currentUser}
        .allowAnonymous=${this.allowAnonymous}>
      </reviews-list>

      ${total > 0 ? html`
        <div class=${tw`mt-8 flex flex-col items-center`}>
          <div class=${tw`text-sm text-gray-500 mb-4`}>
            Показано ${shown} из ${total} отзывов
          </div>
          ${hasMore ? html`
            <button @click=${this._loadMore}
                    class=${tw`px-6 py-3 bg-gray-200 bg-opacity-60 rounded-xl hover:bg-gray-200 w-full focus:outline-none`}>
              Показать ещё
              <svg width="1em" height="1em" class=${tw`inline ml-1 fill-current`}>
                <use href="#ri-arrow-down-s-line"></use>
              </svg>
            </button>` : ''}
        </div>` : ''}
    `;
  }
}

customElements.define('reviews-section', ReviewsSection);
