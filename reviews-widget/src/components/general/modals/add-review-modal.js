// src/components/modals/add-review-modal.js
import { html } from 'lit';
import { tw }   from '../../../twind-setup.js';
import { ModalBase } from './modal-base.js';
import '../file-upload.js';

export class AddReviewModal extends ModalBase {
  static properties = {
    rating:      { type: Number, state: true },
    hoverRating: { type: Number, state: true },
    _reviewText: { type: String, state: true },
    files:       { type: Array }
  };

  openModal() {
    super.openModal();
    // найдём file-upload и очистим его
    const upload = this.renderRoot.querySelector('file-upload');
    if (upload) upload.clear();
  }

  constructor() {
    super();
    this.rating      = 0;
    this.hoverRating = 0;
    this._reviewText = '';
    this.files       = [];
  }

  _setRating(v) {
    this.rating = v;
  }
  _setHover(v) {
    this.hoverRating = v;
  }
  _clearHover() {
    this.hoverRating = 0;
  }

  _onTextInput(e) {
    this._reviewText = e.target.value;
  }

  _send() {
    const text = this._reviewText.trim();
    if (!text || !this.rating) return;
    this.dispatchEvent(new CustomEvent('submit-review', {
      detail: { rating: this.rating, text, files: this.files },
      bubbles: true,
      composed: true
    }));
    this._reviewText = '';
    this.rating = 0;
    this.closeModal();
  }

  render() {
    const filled = this._reviewText.trim() && this.rating > 0;
    return html`
      <div class="${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${tw`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
          <header class="${tw`flex justify-between items-center p-4 border-b border-gray-200`}">
            <h3 class="${tw`font-medium`}">Оставить отзыв</h3>
            <button @click=${this.closeModal}
                    class="${tw`text-gray-500 hover:text-gray-700 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${tw`p-6 space-y-6`}">
            <!-- Рейтинг -->
            <div>
              <label class="${tw`block text-sm font-medium mb-2`}">Ваша оценка</label>
              <div class="${tw`flex space-x-1`}">
                ${[1,2,3,4,5].map(i => html`
                  <svg
                    @click=${() => this._setRating(i)}
                    @mouseenter=${() => this._setHover(i)}
                    @mouseleave=${() => this._clearHover()}
                    class=${tw`
                      text-2xl cursor-pointer fill-current
                      ${ (this.hoverRating || this.rating) >= i
                          ? 'text-yellow-400'
                          : 'text-gray-300' }
                    `}
                    width="1em" height="1em"
                  >
                    <use href="#ri-star-fill"></use>
                  </svg>`)}
              </div>
            </div>

            <!-- Текст -->
            <div>
              <label class="${tw`block text-sm font-medium mb-2`}">Ваш отзыв</label>
              <textarea
                .value=${this._reviewText}
                @input=${this._onTextInput}
                placeholder="Напишите ваш отзыв…"
                class="${tw`mb-2 w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-sky-600 focus:outline-none`}">
              </textarea>
            </div>

            <!-- Файлы -->
            <file-upload
              accept="image/*"
              multiple
              max-files="5"
              @files-change=${e => this.files = e.detail}
            ></file-upload>

            <footer class="${tw`flex justify-end space-x-3`}">
              <button @click=${this.closeModal}
                      class="${tw`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button
                @click=${this._send}
                ?disabled=${!filled}
                class="${tw`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${filled
                  ? 'bg-sky-600 text-white hover:bg-opacity-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}">
                Отправить
              </button>
            </footer>
          </section>
        </div>
      </div>
    `;
  }
}

customElements.define('add-review-modal', AddReviewModal);
