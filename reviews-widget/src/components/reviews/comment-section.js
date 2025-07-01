// src/components/reviews/comment-section.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';
import ANONYMOUS_AVATAR  from '../../assets/anonymous-user.svg?url';
import FALLBACK_AVATAR   from '../../assets/fallback-avatar.svg?url';

export class CommentSection extends BaseComponent {
  static properties = {
    comments:       { type: Array },
    currentUser:    { type: Object },
    reviewId:       { type: Number },
    allowAnonymous: { type: Boolean },
    _commentText:   { state: true }
  };

  constructor() {
    super();
    this.comments      = [];
    this.currentUser   = {};
    this._commentText  = '';
    this.allowAnonymous = false;
  }

  _onInput(e) {
    this._commentText = e.target.value;
  }

  _send() {
    const text = this._commentText.trim();
    if (!text) return;
    this.dispatchEvent(new CustomEvent('send-comment', {
      detail:   { reviewId: this.reviewId, text },
      bubbles:  true,
      composed: true
    }));
    this._commentText = '';
  }

  render() {
    const { isAuthenticated = false, avatar: userAvatar } = this.currentUser;
    const disabled = !this._commentText.trim();
    const canPost = isAuthenticated || this.allowAnonymous;

    // если юзер залогинен показываем его аватар
    // иначе, если анонимы разрешены - анонимный аватар
    const inputAvatarSrc = isAuthenticated
      ? (userAvatar || FALLBACK_AVATAR)
      : (this.allowAnonymous ? ANONYMOUS_AVATAR : '');

    const avatarFor = author => {
      if (author && typeof author === 'object' && author.avatar) {
        return author.avatar;
      }
      if (!author || typeof author === 'string') {
        return ANONYMOUS_AVATAR;
      }
      return FALLBACK_AVATAR;
    };

    return html`
      <div class=${tw`mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg`}>
        ${canPost ? html`
          <div class=${tw`p-4`}>
            <div class=${tw`flex space-x-3`}>
              <img
                src=${inputAvatarSrc}
                @error=${e => e.currentTarget.src = FALLBACK_AVATAR}
                class=${tw`w-10 h-10 rounded-full object-cover`} />
              <div class=${tw`flex-1`}>
                <textarea
                  rows="3"
                  .value=${this._commentText}
                  @input=${this._onInput}
                  class=${tw`w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:outline-none`}
                  placeholder="Напишите ваш комментарий…"></textarea>
                <div class=${tw`mt-2 flex justify-end`}>
                  <button
                    type="button"
                    @click=${this._send}
                    ?disabled=${disabled}
                    class=${tw`px-4 py-2 text-sm rounded-xl ${
                      disabled ? 'bg-gray-200 text-gray-400' : 'bg-sky-600 text-white'
                    }`}>
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>` : ''}

        ${this.comments.map((c, i) => {
          const liked    = c.myReaction === 'like';
          const disliked = c.myReaction === 'dislike';

          return html`
            <div class=${tw`px-4 pt-4 ${i === this.comments.length - 1 ? 'pb-4' : ''}`}>
              <div class=${tw`flex items-start space-x-3`}>
                <div class=${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}>
                  <img
                    src=${avatarFor(c.author)}
                    @error=${e => e.currentTarget.src = FALLBACK_AVATAR}
                    class=${tw`w-full h-full object-cover`} />
                </div>
                <div class=${tw`flex-1`}>
                  <div class=${tw`flex items-center space-x-2`}>
                    <span class=${tw`font-medium text-sm`}>
                      ${c.author?.fullname ?? 'Аноним'}
                    </span>
                    <span class=${tw`text-xs text-gray-500`}>${c.date}</span>
                  </div>
                  <p class=${tw`text-sm mt-1`}>${c.text}</p>
                  <div class=${tw`mt-2 flex justify-between items-center`}>
                    <div class=${tw`flex space-x-4`}>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent('comment-like', {
                          detail:   { reviewId: this.reviewId, commentId: c.id },
                          bubbles:  true,
                          composed: true
                        }))}
                        ?disabled=${!isAuthenticated || c.author?.id === this.currentUser.id}
                        class=${tw`flex items-center text-sm fill-current focus:outline-none ${
                          liked ? 'text-sky-500' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-up-line"/></svg>
                        <span>${c.likes}</span>
                      </button>
                      <button
                        type="button"
                        @click=${() => this.dispatchEvent(new CustomEvent('comment-dislike', {
                          detail:   { reviewId: this.reviewId, commentId: c.id },
                          bubbles:  true,
                          composed: true
                        }))}
                        ?disabled=${!isAuthenticated || c.author?.id === this.currentUser.id}
                        class=${tw`flex items-center text-sm fill-current focus:outline-none ${
                          disliked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                        <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-thumb-down-line"/></svg>
                        <span>${c.dislikes}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click=${() => this.dispatchEvent(new CustomEvent('comment-report', {
                        detail:   { reviewId: this.reviewId, commentId: c.id },
                        bubbles:  true,
                        composed: true
                      }))}
                      ?disabled=${!isAuthenticated || c.author?.id === this.currentUser.id}
                      class=${tw`flex items-center text-sm fill-current text-gray-500 hover:text-gray-700`}>
                      <svg class=${tw`mr-1`} width="1em" height="1em"><use href="#ri-flag-line"/></svg>
                      <span>Пожаловаться</span>
                    </button>
                  </div>
                </div>
              </div>
              ${i < this.comments.length - 1 ? html`<hr class=${tw`border-gray-200 mt-4`}>` : ''}
            </div>`;
        })}
      </div>
    `;
  }
}

customElements.define('comment-section', CommentSection);