import { html } from 'lit';
import { tw }   from '../../../twind-setup.js';
import { ModalBase } from './modal-base.js';

export class ReportModal extends ModalBase {
  static properties = {
    target:          { type: Object },
    _selectedReason: { state: true },
    _extraText:      { state: true },
  };

  constructor() {
    super();
    this.target = {};
    this._selectedReason = '';
    this._extraText = '';
  }

  _onReasonChange(e) {
    this._selectedReason = e.target.value;
  }

  _onExtraInput(e) {
    this._extraText = e.target.value;
  }

  _send() {
    if (!this._selectedReason) return;

    const { type, reviewId, commentId, questionId, answerId } = this.target;

    this.dispatchEvent(new CustomEvent('submit-report', {
      detail: {
        type, reviewId, commentId, questionId, answerId,
        reason: this._selectedReason,
        text: this._extraText.trim()
      },
      bubbles: true,
      composed: true
    }));

    this._selectedReason = '';
    this._extraText      = '';
    this.closeModal();
  }

  render() {
    const reasons = [
      { v: 'spam',      l: 'Спам/реклама'      },
      { v: 'offensive', l: 'Оскорбления'       },
      { v: 'false',     l: 'Ложная информация' },
      { v: 'other',     l: 'Другое'            },
    ];
    const canSend = !!this._selectedReason;

    return html`
      <div class="${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${tw`bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden`}">
          <header class="${tw`flex justify-between items-center p-4 border-b`}">
            <h3 class="${tw`font-medium`}">Пожаловаться</h3>
            <button @click=${this.closeModal}
                    class="${tw`text-gray-500 hover:text-gray-700 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${tw`p-6 space-y-4`}">
            <p class="${tw`text-sm`}">Укажите причину:</p>
            ${reasons.map(r => html`
              <label class="${tw`flex items-center space-x-2`}">
                <input
                  type="radio"
                  name="reason"
                  .value=${r.v}
                  .checked=${this._selectedReason === r.v}
                  @change=${this._onReasonChange}
                  class="${tw`text-sky-600 focus:ring-sky-600`}"/>
                <span class="${tw`text-sm`}">${r.l}</span>
              </label>
            `)}

            <textarea
              .value=${this._extraText}
              @input=${this._onExtraInput}
              rows="4"
              placeholder="Комментарий (необязательно)…"
              class="${tw`mb-2 w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none`}">
            </textarea>

            <footer class="${tw`flex justify-end space-x-3`}">
              <button @click=${this.closeModal}
                      class="${tw`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button @click=${this._send}
                      ?disabled=${!canSend}
                      class="${tw`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${canSend
                        ? 'bg-sky-600 hover:bg-opacity-90 text-white'
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

customElements.define('report-modal', ReportModal);
