// src/components/general/file-upload.js
import { html }          from 'lit';
import { BaseComponent } from '../general/base-component.js';
import { tw }            from '../../twind-setup.js';

export class FileUpload extends BaseComponent {
  static properties = {
    accept:    { type: String  },
    multiple:  { type: Boolean },
    maxFiles:  { type: Number, attribute: 'max-files' },
    _files:    { state: true   },
    _hover:    { state: true   }
  };

  constructor() {
    super();
    this.accept   = '';
    this.multiple = false;
    this.maxFiles = Infinity;  // не ограничено, если не задано
    this._files   = [];
    this._hover   = false;
  }

  get files() {
    return this._files;
  }

  // Уведомляем о смене списка
  _notify() {
    this.dispatchEvent(new CustomEvent('files-change', {
      detail: [...this._files],
      bubbles: true,
      composed: true
    }));
  }

  // Добавляем часть из переданных файлов, с учётом ограничения
  _add(list) {
    const incoming = Array.from(list);
    // сколько ещё можно добавить
    const remaining = this.multiple
      ? Math.max(0, this.maxFiles - this._files.length)
      : 1;

    if (remaining <= 0) return;

    const toAdd = incoming.slice(0, remaining);
    this._files = this.multiple
      ? [...this._files, ...toAdd]
      : toAdd;

    this._notify();
  }

  // Удаляем выбранный
  _remove(idx) {
    URL.revokeObjectURL(this._files[idx]._url);
    this._files = this._files.filter((_, i) => i !== idx);
    this._notify();
  }

  // Обработчики событий
  _onInput = e => {
    this._add(e.target.files);
    e.target.value = '';
  };
  _onDrag  = e => {
    e.preventDefault();
    this._hover = e.type === 'dragover';
  };
  _onDrop  = e => {
    e.preventDefault();
    this._hover = false;
    this._add(e.dataTransfer.files);
  };

  clear() {
    // отзываем все objectURL
    this._files.forEach(f => f._url && URL.revokeObjectURL(f._url));
    // очищаем массив
    this._files = [];
    this._notify();
  }

  render() {
    const borderClass = this._hover
      ? tw`border-sky-600`
      : tw`border-gray-300 hover:border-sky-600`;

    return html`
      <div class=${tw`space-y-4`}>

        <!-- зона выбора / дропа -->
        <label
          @dragover=${this._onDrag}
          @dragleave=${this._onDrag}
          @drop=${this._onDrop}
          class="${tw`block cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition`} ${borderClass}"
        >
          <div class=${tw`w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center`}>
            <svg width="1.5em" height="1.5em" class=${tw`text-gray-500`}>
              <use href="#ri-upload-2-line"></use>
            </svg>
          </div>
          <p class=${tw`text-sm text-gray-500`}>
            Перетащите сюда или <span class=${tw`text-sky-600 underline`}>выберите файл</span>
          </p>
          ${this.accept ? html`
            <p class=${tw`text-xs text-gray-400 mt-1`}>
              ${this.accept} ${this.multiple ? `(макс. ${this.maxFiles})` : ''}
            </p>` : ''}
          <input
            type="file"
            id="file-input"
            ?multiple=${this.multiple}
            accept=${this.accept}
            class=${tw`hidden`}
            @change=${this._onInput}
          >
        </label>

        <!-- превью выбранных файлов -->
        ${this._files.length ? html`
          <div class=${tw`flex flex-wrap gap-2`}>
            ${this._files.map((f, i) => {
              if (!f._url) f._url = URL.createObjectURL(f);
              const isImage = f.type.startsWith('image/');
              const thumb = isImage
                ? html`<img src=${f._url} class=${tw`w-16 h-16 object-cover rounded`} />`
                : html`
                  <div class=${tw`w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs`}>
                    ${f.name.split('.').pop().toUpperCase()}
                  </div>`;
              return html`
                <div class=${tw`relative group`}>
                  ${thumb}
                  <button
                    @click=${() => this._remove(i)}
                    class=${tw`
                      absolute -top-2 -right-2 hidden group-hover:flex
                      w-5 h-5 rounded-full bg-black bg-opacity-60 text-white text-xs
                      items-center justify-center`}
                  >&times;</button>
                </div>`;
            })}
          </div>` : ''}
      </div>
    `;
  }
}

customElements.define('file-upload', FileUpload);
