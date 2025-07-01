// src/components/modals/add-question-modal.js
import { html } from 'lit';
import { tw }   from '../../../twind-setup.js';
import { ModalBase } from './modal-base.js';

export class AddQuestionModal extends ModalBase {
  static properties = {
    _questionText: { state: true },
    files:         { type: Array }
  };

  constructor() {
    super();
    this._questionText = '';
    this.files = [];
  }

  _onInput(e) {
    this._questionText = e.target.value;
  }

  _send() {
    const text = this._questionText.trim();
    if (!text) return;
    this.dispatchEvent(new CustomEvent('submit-question', {
      detail: { text, files: this.files },
      bubbles: true,
      composed: true
    }));
    this._questionText = '';
    this.closeModal();
  }

  render() {
    const disabled = !this._questionText.trim();
    return html`
      <div class="${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
        <div class="${tw`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
          <header class="${tw`flex justify-between items-center p-4 border-b border-gray-200`}">
            <h3 class="${tw`font-medium`}">Задать вопрос</h3>
            <button 
              @click=${this.closeModal} 
              class="${tw`text-gray-500 focus:outline-none`}">
              <svg width="1em" height="1em"><use href="#ri-close-line"/></svg>
            </button>
          </header>

          <section class="${tw`p-6 space-y-6`}">
            <textarea
              .value=${this._questionText}
              @input=${this._onInput}
              class="${tw`w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-sky-600 focus:outline-none`}"
              placeholder="Напишите ваш вопрос…">
            </textarea>

            <footer class="${tw`flex justify-end space-x-3`}">
              <button 
                @click=${this.closeModal}
                class="${tw`px-4 py-2 text-sm border bg-gray-100 hover:bg-gray-200 hover:bg-opacity-80 border-gray-300 rounded-xl focus:outline-none`}">
                Отмена
              </button>
              <button 
                @click=${this._send}
                ?disabled=${disabled}
                class="${tw`px-4 py-2 text-sm rounded-xl focus:outline-none`} ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-sky-600 text-white hover:bg-opacity-90'}">
                Отправить
              </button>
            </footer>
          </section>
        </div>
      </div>
    `;
  }
}

customElements.define('add-question-modal', AddQuestionModal);
