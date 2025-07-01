// src/components/general/modals/modal-base.js
import { html, css }      from 'lit';
import { BaseComponent }   from '../base-component.js';
import { sheet, tw }       from '../../../twind-setup.js';

export class ModalBase extends BaseComponent {
  static properties = {
    open: { type: Boolean, reflect: true }
  };

  constructor() {
    super();
    this.open = false;
    // по умолчанию скрываем
    this.setAttribute('hidden', '');
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.shadowRoot.adoptedStyleSheets = [ sheet.target ];
  }

  // ткрыть модалку
  openModal() {
    this.open = true;
    this.removeAttribute('hidden');
  }

  // закрыть модалку
  closeModal() {
    this.open = false;
    this.setAttribute('hidden', '');
    this.dispatchEvent(new CustomEvent('modal-close'));
  }

  _onOverlay(e) {
    // клик по оверлею закрывает
    if (e.target === this) {
      this.closeModal();
    }
  }

  render() {
    // просто рисуем оверлей + слот, показывается только когда host не hidden
    return html`
      <div @click=${this._onOverlay}>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('modal-base', ModalBase);
