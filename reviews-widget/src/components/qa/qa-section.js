// src/components/qa/qa-section.js
import { html } from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw } from '../../twind-setup.js';
import './qa-filters.js';
import './qa-list.js';
import '../general/media-gallery.js';

export class QaSection extends BaseComponent {
  static properties = {
    questions:   { type: Array  },
    currentUser: { type: Object },
    pageSize:    { type: Number },
    allowAnonymous: { type: Boolean },
    _page:       { state: true  },
    _search:     { state: true  },
    _sortKey:    { state: true  },
    _sortDir:    { state: true  },
    _filter:     { state: true  }
  };

  constructor() {
    super();
    this.questions   = [];
    this.currentUser = {};
    this.pageSize    = 5;
    this._page       = 1;
    this._search     = '';
    this._sortKey    = 'date';
    this._sortDir    = 'desc';
    this._filter     = 'all';
    this._procCache  = new Map();
    this._searchDebounce = null;
    this._filterDebounce = null;
  }

  _ensureArray(arr) {
    return Array.isArray(arr) ? arr : [];
  }

  _parseDate(str) {
    const [d, m, y] = str.split(' ');
    const months = {
      января:0, февраля:1, марта:2, апреля:3, мая:4, июня:5,
      июля:6, августа:7, сентября:8, октября:9, ноября:10, декабря:11
    };
    return new Date(+y, months[m] ?? 0, +d);
  }

  _topQuestion() {
    const list = this._ensureArray(this.questions);
    if (!list.length) return null;
    return list.reduce((best, q) => {
      const bs = (best.likes||0) - (best.dislikes||0);
      const cs = (q.likes ||0) - (q.dislikes  ||0);
      return cs > bs ? q : best;
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

    let arr = [...this._ensureArray(this.questions)];

    if (this._search) {
      const q = this._search.toLowerCase();
      arr = arr.filter(item =>
        item.text.toLowerCase().includes(q) ||
        item.author.name.toLowerCase().includes(q)
      );
    }

    if (this._filter === 'answered') {
      arr = arr.filter(x => (x.answers?.length||0) > 0);
    } else if (this._filter === 'unanswered') {
      arr = arr.filter(x => (x.answers?.length||0) === 0);
    }

    arr.sort((a, b) => {
      let diff = 0;
      if (this._sortKey === 'date') {
        diff = this._parseDate(a.date) - this._parseDate(b.date);
      } else {
        diff = ((a.likes||0)-(a.dislikes||0)) - ((b.likes||0)-(b.dislikes||0));
      }
      return this._sortDir === 'desc' ? -diff : diff;
    });

    if (excludeId !== null) {
      arr = arr.filter(x => x.id !== excludeId);
    }

    this._procCache.set(key, arr);
    return [...arr];
  }

  _slice(excludeId) {
    return this._processed(excludeId).slice(0, this._page * this.pageSize);
  }

  updated(changedProps) {
    if (
      changedProps.has('questions')   ||
      changedProps.has('currentUser') ||
      changedProps.has('_search')     ||
      changedProps.has('_filter')     ||
      changedProps.has('_sortKey')    ||
      changedProps.has('_sortDir')    ||
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
    }, 200);
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
    }, 200);
  };

  _loadMore = () => {
    this._page += 1;
    this._procCache.clear();
  };

  render() {
    const allMedia = this._ensureArray(this.questions).flatMap(q => q.media || []);
    const top      = this._topQuestion();
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
          </media-gallery>
        </div>` : ''}

      <qa-filters
        .searchText=${this._search}
        .sortBy=${`${this._sortKey}-${this._sortDir}`}
        .active=${this._filter}
        @search-change=${this._onSearch}
        @sort-change=${this._onSort}
        @filter-change=${this._onFilter}>
      </qa-filters>

      <qa-list
        .questions=${list}
        .currentUser=${this.currentUser}
        .allowAnonymous=${this.allowAnonymous}>
      </qa-list>

      ${total > 0 ? html`
        <div class=${tw`mt-8 flex flex-col items-center`}>
          <div class=${tw`text-sm text-gray-500 mb-4`}>
            Показано ${shown} из ${total} вопросов
          </div>
          ${hasMore ? html`
            <button @click=${this._loadMore}
                    class=${tw`px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 w-full`}>
              Показать ещё
              <svg width="1em" height="1em" class=${tw`inline ml-1`}><use href="#ri-arrow-down-s-line"/></svg>
            </button>` : ''}
        </div>` : ''}
    `;
  }
}

customElements.define('qa-section', QaSection);
