// src/components/qa/qa-item.js
import { html } from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw } from '../../twind-setup.js';
import '../general/media-gallery.js';
import './answer-section.js';
import FALLBACK_AVATAR from '../../assets/fallback-avatar.svg?url';

export class QaItem extends BaseComponent {
  static properties = {
    question:    { type: Object },
    currentUser: { type: Object },
    highlighted: { type: Boolean, reflect: true },
    allowAnonymous: { type: Boolean },
  };

  constructor() {
    super();
    this.currentUser = { avatar: '', name: '' };
    this.highlighted = false;
  }

  render() {
    const { id, author, date, text, likes, dislikes, answers = [], 
      showAnswers, myReaction } = this.question;
    const articleClass = this.highlighted
      ? tw`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl mb-6`
      : tw`p-4 border-b border-gray-100 mb-6`;

    const answerCount = (answers.length > 0)
      ? answers.length
      : this.question.answersCount;
    const answerLabel = answerCount ? `Ответы (${answerCount})` : 'Ответить';

    return html`
      <article class=${articleClass}>
        ${this.highlighted ? html`
          <div class=${tw`mb-2 flex items-center justify-center fill-current`}>
            <svg class=${tw`text-blue-500 mr-2`} width="1em" height="1em"><use href="#ri-thumb-up-fill"/></svg>
            <span class=${tw`text-sm font-medium text-blue-700`}>Самый популярный вопрос</span>
          </div>` : ''}

        <div class=${tw`flex items-start`}>
          <div class=${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}>
            <img
              src=${author.avatar}
              @error=${e => e.currentTarget.src = FALLBACK_AVATAR}
              class=${tw`w-full h-full object-cover`} />
          </div>
          <div class=${tw`flex-1`}>
            <div class=${tw`flex justify-between items-start mb-2`}>
              <div>
                <div class=${tw`font-medium`}>${author.fullname}</div>
                <div class=${tw`text-sm text-gray-500`}>${date}</div>
              </div>
            </div>
            <p class=${tw`text-sm text-gray-800 mb-3`}>${text}</p>

            <div class=${tw`mt-3 flex items-center justify-between`}>
              <div class=${tw`flex space-x-4`}>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('question-like', {
                    detail:   { questionId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  ?disabled=${!this.currentUser.isAuthenticated || author.id === this.currentUser.id}
                  class=${tw`flex items-center text-sm fill-current focus:outline-none ${myReaction==='like' ? 'text-sky-500' : 'text-gray-500 hover:text-gray-700'}`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                  <span>${likes}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('question-dislike', {
                    detail:   { questionId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  ?disabled=${!this.currentUser.isAuthenticated || author.id === this.currentUser.id}
                  class=${tw`flex items-center text-sm fill-current focus:outline-none ${myReaction==='dislike' ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                  <span>${dislikes}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('answer-toggle', {
                    detail:   { questionId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  class=${tw`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-chat-1-line"/></svg>
                  <span>${answerLabel}</span>
                </button>
              </div>
              <button
                type="button"
                @click=${() => this.dispatchEvent(new CustomEvent('question-report', {
                  detail:   { questionId: id },
                  bubbles:  true,
                  composed: true
                }))}
                ?disabled=${!this.currentUser.isAuthenticated || author.id === this.currentUser.id}
                class=${tw`flex items-center text-sm fill-current text-gray-500 hover:text-gray-700 focus:outline-none`}>
                <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                <span>Пожаловаться</span>
              </button>
            </div>

            ${showAnswers ? html`
              <answer-section
                .answers=${answers}
                .currentUser=${this.currentUser}
                .questionId=${id}
                .allowAnonymous=${this.allowAnonymous}>
              </answer-section>` : ''}
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('qa-item', QaItem);
