// src/components/reviews/reviews-list.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';
import { repeat }        from 'lit/directives/repeat.js';
import './review-item.js';

export class ReviewsList extends BaseComponent {
  static properties = {
    reviews:     { type: Array },
    currentUser: { type: Object },
    allowAnonymous:{type:Boolean},
  };

  constructor() {
    super();
    this.reviews     = [];
    this.currentUser = {};
  }

  render() {
    const list = Array.isArray(this.reviews) ? this.reviews : [];
    if (!list.length) {
      return html`<div class=${tw`text-center text-gray-500`}>Нет отзывов.</div>`;
    }

    const topId = list.reduce((best, r) => (r.likes > best.likes ? r : best), list[0]).id;

    return html`
      <section class=${tw`space-y-6`}>
        ${repeat(list, r => r.id, r => html`
          <review-item
            .review=${r}
            .currentUser=${this.currentUser}
            .allowAnonymous=${this.allowAnonymous}
            ?highlighted=${r.id === topId}>
          </review-item>`)}
      </section>
    `;
  }
}

customElements.define('reviews-list', ReviewsList);
