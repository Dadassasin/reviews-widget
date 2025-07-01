// src/components/reviews/review-item.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';
import '../general/media-gallery.js';
import './comment-section.js';
import FALLBACK_AVATAR   from '../../assets/fallback-avatar.svg?url';

const sentimentConfig = [
  { key: 'positive', label: 'Положительный', bgClass: tw`bg-green-50`,  textClass: tw`text-green-700` },
  { key: 'neutral',  label: 'Нейтральный',  bgClass: tw`bg-gray-100`,   textClass: tw`text-gray-700` },
  { key: 'negative', label: 'Отрицательный', bgClass: tw`bg-red-50`,    textClass: tw`text-red-700` },
];

const emotionConfig = [
  { key: 'joy',        label: 'Радость',       bgClass: tw`bg-amber-50`,   textClass: tw`text-amber-700` },
  { key: 'interest',   label: 'Интерес',       bgClass: tw`bg-indigo-50`,  textClass: tw`text-indigo-700` },
  { key: 'surprise',   label: 'Удивление',     bgClass: tw`bg-yellow-50`,  textClass: tw`text-yellow-700` },
  { key: 'sadness',    label: 'Грусть',        bgClass: tw`bg-blue-50`,    textClass: tw`text-blue-700` },
  { key: 'anger',      label: 'Злость',        bgClass: tw`bg-red-50`,     textClass: tw`text-red-700` },
  { key: 'disgust',    label: 'Отвращение',    bgClass: tw`bg-lime-50`,    textClass: tw`text-lime-700` },
  { key: 'fear',       label: 'Страх',         bgClass: tw`bg-blue-50`,    textClass: tw`text-blue-700` },
  { key: 'guilt',      label: 'Вина',          bgClass: tw`bg-indigo-50`,  textClass: tw`text-indigo-700` },
  { key: 'neutrality', label: 'Нейтральность', bgClass: tw`bg-gray-100`,    textClass: tw`text-gray-700` },
];

export class ReviewItem extends BaseComponent {
  static properties = {
    review:      { type: Object },
    currentUser: { type: Object },
    highlighted: { type: Boolean, reflect: true },
    allowAnonymous:{type:Boolean}
  };

  constructor() {
    super();
    this.currentUser = { avatar: '', name: '' };
    this.highlighted = false;
  }

  render() {
    const {
      id, author, date, sentiment = 'neutral', emotion = 'neutrality',
      rating, text, media = [], likes, dislikes, replies = [],
      showReplies, myReaction
    } = this.review;

    const sCfg = sentimentConfig.find(s => s.key === sentiment) || sentimentConfig[1];
    const eCfg = emotionConfig.find(e => e.key === emotion)    || emotionConfig[8];
    const replyCount = (replies.length > 0)
      ? replies.length
      : this.review.commentsCount;
    const replyLabel = replyCount ? `Комментарии (${replyCount})` : 'Комментировать';
    const articleClass = this.highlighted
      ? tw`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl mb-6`
      : tw`p-4 border-b border-gray-100 mb-6`;

    return html`
      <article class=${articleClass}>
        ${this.highlighted ? html`
          <div class=${tw`mb-2 flex items-center justify-center fill-current`}>
            <svg class=${tw`text-blue-500 mr-2`} width="1em" height="1em"><use href="#ri-thumb-up-fill"/></svg>
            <span class=${tw`text-sm font-medium text-blue-700`}>Самый полезный отзыв</span>
          </div>` : ''}

        <div class=${tw`flex items-start`}>
          <div class=${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}>
            <img
              src="${author.avatar}"
              alt="Аватар ${author.name}"
              @error=${e => e.currentTarget.src = FALLBACK_AVATAR}
              class=${tw`w-full h-full object-cover`} />
          </div>
          <div class=${tw`flex-1`}>
            <div class=${tw`flex justify-between items-start`}>
              <div>
                ${author.id && author.id !== this.currentUser.id
                  ? html`<a
                      href="http://localhost:3000/users/${author.id}"
                      class=${tw`font-medium hover:text-gray-700 no-underline`}
                    >${author.fullname}</a>`
                  : html`<div class=${tw`font-medium`}>${author.fullname}</div>`}
                <div class=${tw`text-sm text-gray-500`}>${date}</div>
                <div class=${tw`flex items-center space-x-2 mb-2`}>
                  <span class=${`${tw`px-2 py-1 text-xs rounded-full`} ${sCfg.bgClass} ${sCfg.textClass}`}>${sCfg.label}</span>
                  <span class=${`${tw`px-2 py-1 text-xs rounded-full`} ${eCfg.bgClass} ${eCfg.textClass}`}>${eCfg.label}</span>
                </div>
              </div>
              <div class=${tw`flex space-x-0.5`}>
                ${[1,2,3,4,5].map(i => html`
                  <svg class=${tw`${i <= rating ? 'text-yellow-400' : 'text-gray-300'} text-base fill-current`} width="1em" height="1em">
                    <use href="#ri-star-fill"/>
                  </svg>`)}
              </div>
            </div>

            <p class=${tw`mt-2 text-sm text-gray-800 mb-3`}>${text}</p>

            ${media.length ? html`
              <media-gallery
                .media=${media}
                @view-media=${e => this.dispatchEvent(new CustomEvent('view-media', {
                  detail:   { id, index: e.detail.index },
                  bubbles:  true,
                  composed: true
                }))}>
              </media-gallery>` : ''}

            <div class=${tw`mt-3 flex items-center justify-between`}>
              <div class=${tw`flex space-x-4`}>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('review-like', {
                    detail:   { reviewId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === author.id}
                  class=${tw`flex items-center text-sm fill-current focus:outline-none ${myReaction==='like' ? 'text-sky-500' : 'text-gray-500 hover:text-gray-700'}`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                  <span>${likes}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('review-dislike', {
                    detail:   { reviewId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === author.id}
                  class=${tw`flex items-center text-sm fill-current focus:outline-none ${myReaction==='dislike' ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                  <span>${dislikes}</span>
                </button>
                <button
                  type="button"
                  @click=${() => this.dispatchEvent(new CustomEvent('comment-toggle', {
                    detail:   { reviewId: id },
                    bubbles:  true,
                    composed: true
                  }))}
                  class=${tw`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                  <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-chat-1-line"/></svg>
                  <span>${replyLabel}</span>
                </button>
              </div>
              <button
                type="button"
                @click=${() => this.dispatchEvent(new CustomEvent('review-report', {
                  detail:   { reviewId: id },
                  bubbles:  true,
                  composed: true
                }))}
                ?disabled=${!this.currentUser.isAuthenticated || this.currentUser.id === author.id}
                class=${tw`flex items-center text-sm text-gray-500 hover:text-gray-700 fill-current focus:outline-none`}>
                <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                <span>Пожаловаться</span>
              </button>
            </div>

            ${showReplies ? html`
              <comment-section
                .comments=${replies}
                .currentUser=${this.currentUser}
                .reviewId=${id}
                .allowAnonymous=${this.allowAnonymous}>
              </comment-section>` : ''}
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('review-item', ReviewItem);
