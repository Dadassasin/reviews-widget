// src/components/modals/media-view-modal.js
import { html, css } from 'lit';
import { tw }        from '../../../twind-setup.js';
import { ModalBase } from './modal-base.js';

export class MediaViewModal extends ModalBase {
  static properties = {
    media:   { type: Array },
    index:   { type: Number },
    _touchX: { type: Number },
  };

  static styles = css`
    .fade-enter {
      opacity: 0;
      transition: opacity 200ms ease-in;
    }
    .fade-enter-active {
      opacity: 1;
    }
    .fade-exit {
      opacity: 1;
      transition: opacity 200ms ease-out;
    }
    .fade-exit-active {
      opacity: 0;
    }
  `;

  constructor() {
    super();
    this.media   = [];
    this.index   = 0;
    this._touchX = 0;
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
  }

  setMedia(arr, start = 0) {
    this.media = arr;
    this.index = start;
    this.openModal();
  }

  _prev() {
    if (this.index > 0) this.index--;
  }
  _next() {
    if (this.index < this.media.length - 1) this.index++;
  }

  _onTouchStart(e) {
    this._touchX = e.touches[0].clientX;
  }
  _onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this._touchX;
    if (dx > 40) this._prev();
    else if (dx < -40) this._next();
  }

  _onKeyDown(e) {
    if (!this.opened) return;
    if (e.key === 'Escape') this.closeModal();
    if (e.key === 'ArrowLeft') this._prev();
    if (e.key === 'ArrowRight') this._next();
  }

  render() {
  if (!this.media.length) return '';
  return html`
    <div class=${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm`}>
      <div class=${tw`relative flex flex-col items-center w-full h-full max-w-full max-h-full p-4 sm:p-8`} 
        @touchstart=${this._onTouchStart} 
        @touchend=${this._onTouchEnd}>
        <button 
          @click=${this.closeModal} 
          class=${tw`absolute top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Close">
          <svg width="1.5em" height="1.5em" class=${tw`text-white`}><use href="#ri-close-line"/></svg>
        </button>
        <button 
          @click=${this._prev} 
          ?hidden=${this.index === 0} 
          class=${tw`absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 p-4 sm:p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Previous">
          <svg width="2em" height="2em" class=${tw`text-white`}><use href="#ri-arrow-left-s-line"/></svg>
        </button>
        <div class=${tw`flex-grow flex items-center justify-center w-full`}>
          <img loading="lazy" src=${this.media[this.index]} class=${tw`object-contain w-full max-w-full h-auto max-h-[70vh] sm:max-h-[85vh] md:max-h-[90vh] rounded-lg shadow-lg transition-transform duration-200`} />
        </div>
        <button 
          @click=${this._next} 
          ?hidden=${this.index === this.media.length - 1} 
          class=${tw`absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 p-4 sm:p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 focus:outline-none`} aria-label="Next">
          <svg width="2em" height="2em" class=${tw`text-white`}><use href="#ri-arrow-right-s-line"/></svg>
        </button>
        <div class=${tw`mt-4 text-sm sm:text-base text-white bg-black bg-opacity-60 px-4 py-1 rounded-full`}>
          ${this.index + 1} / ${this.media.length}
        </div>
      </div>
    </div>
  `;
}
}

customElements.define('media-view-modal', MediaViewModal);
