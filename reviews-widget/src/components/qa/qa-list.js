// src/components/qa/qa-list.js
import { html } from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw } from '../../twind-setup.js';
import { repeat } from 'lit/directives/repeat.js';
import './qa-item.js';

export class QaList extends BaseComponent {
  static properties = {
    questions:   { type: Array  },
    currentUser: { type: Object },
    allowAnonymous: { type: Boolean },
  };

  constructor() {
    super();
    this.questions   = [];
    this.currentUser = {};
  }

  render() {
    const list = Array.isArray(this.questions) ? this.questions : [];
    if (!list.length) {
      return html`<div class=${tw`text-center text-gray-500`}>Нет вопросов.</div>`;
    }

    const topId = list.reduce((best, q) => {
      const bs = (best.likes||0) - (best.dislikes||0);
      const cs = (q.likes||0)  - (q.dislikes||0);
      return cs > bs ? q : best;
    }, list[0]).id;

    return html`
      <section class=${tw`space-y-6`}>
        ${repeat(
          list,
          q => q.id,
          q => html`
            <qa-item
              .question=${q}
              .currentUser=${this.currentUser}
              .allowAnonymous=${this.allowAnonymous}
              ?highlighted=${q.id === topId}>
            </qa-item>
          `
        )}
      </section>
    `;
  }
}

customElements.define('qa-list', QaList);
