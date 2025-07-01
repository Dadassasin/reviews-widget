import { LitElement } from 'lit';
import { sheet } from '../../twind-setup.js';
import sprite from '../../sprite.svg?raw';

export class BaseComponent extends LitElement {
  createRenderRoot() {
    const root = super.createRenderRoot();

    if (!root.adoptedStyleSheets.includes(sheet.target)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet.target];
    }

    if (!root.__spriteInjected) {
      const tpl = document.createElement('template');
      tpl.innerHTML = sprite;
      root.prepend(tpl.content.cloneNode(true));
      root.__spriteInjected = true;
    }
    return root;
  }
}
