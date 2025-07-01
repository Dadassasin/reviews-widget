// src/components/media-gallery.js
import { html, css }   from 'lit';
import { BaseComponent } from './base-component.js';
import { tw }          from '../../twind-setup.js';
import FALLBACK_IMAGE from '../../assets/fallback-image.svg?url';

const IMG_ORIGIN = 'http://localhost:3000';

export class MediaGallery extends BaseComponent {
  static properties = { media: { type: Array }, active: { state: true } };

  static styles = [
    css`
      :host { display:block }
      .scroll::-webkit-scrollbar{height:4px;width:6px}
      .scroll::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:10px}
      .scroll::-webkit-scrollbar-track{background:#f1f1f1;border-radius:10px}`];

  constructor(){ 
    super(); 
    this.media=[]; 
    this.active=0; 
  }

  _select(i){ this.active=i; this.dispatchEvent(
    new CustomEvent('view-media',{detail:{index:i},bubbles:true,composed:true})); }

    render() {
      return html`
        <div class="relative">
          <div class="${tw`flex space-x-3 overflow-x-auto pb-2`} scroll">
            ${this.media.map((src, i) => {
              // если не абсолютный URL — прибавляем корень
              const fullSrc = typeof src === 'string' && !src.startsWith('http')
                ? IMG_ORIGIN + src
                : src;
  
              return html`
                <div
                  class="${tw`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}"
                  @click=${() => this._select(i)}>
                  <img
                    src="${fullSrc}"
                    class="${tw`w-full h-full object-cover`}"
                    @error=${e => e.currentTarget.src = FALLBACK_IMAGE}
                  />
                </div>
              `;
            })}
          </div>
        </div>
      `;
    }
}
customElements.define('media-gallery',MediaGallery);
