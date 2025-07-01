// src/components/tab-nav.js
import { LitElement, html } from 'lit';
import { sheet, tw } from '../../twind-setup.js';
import { BaseComponent } from './base-component.js';

export class TabNav extends BaseComponent {
  static properties = { active: { type: String } };

  constructor() {
    super();
    this.active = 'reviews';
  }

  _onClick(tab) {
    this.dispatchEvent(new CustomEvent('tab-change', {
      detail: { tab },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
        <div data-role="tabs" class="${tw`flex space-x-4 px-6 py-4`}">
          <button
            @click=${() => this._onClick('reviews')}
            class=${tw`
              focus:outline-none px-4 py-2 text-sm font-medium
              ${this.active==='reviews'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-gray-500 hover:text-gray-700'}
            `}>
            Отзывы
          </button>
          <button
            @click=${() => this._onClick('qa')}
            class=${tw`
              focus:outline-none px-4 py-2 text-sm font-medium
              ${this.active==='qa'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-gray-500 hover:text-gray-700'}
            `}>
            Вопрос-ответ
          </button>
        </div>
    `;
  }
}

customElements.define('tab-nav', TabNav);
