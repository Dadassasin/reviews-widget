// src/components/user-menu.js
import { html }          from 'lit';
import { tw }            from '../../twind-setup.js';
import { BaseComponent } from './base-component.js';

import FALLBACK_AVATAR   from '../../assets/fallback-avatar.svg?url';
import ANONYMOUS_AVATAR  from '../../assets/anonymous-user.svg?url';

export class UserMenu extends BaseComponent {
  static properties = {
    user:           { type: Object },
    allowAnonymous: { type: Boolean }
  };

  // bubbling-событий
  _onLogin  = () => this.dispatchEvent(new CustomEvent('login',  { bubbles: true, composed: true }));
  _onLogout = () => this.dispatchEvent(new CustomEvent('logout', { bubbles: true, composed: true }));

  render() {
    const {
      isAuthenticated = false,
      name   = '',
      email  = '',
      avatar = ''
    } = this.user || {};

    // показать ли «Аноним» рядом с кнопкой входа 
    const showAnon = !isAuthenticated && this.allowAnonymous;

    return html`
      <div class="${tw`flex items-center space-x-2 pr-6`}">
        ${isAuthenticated
          ? html`
              <!-- панель авторизованного пользователя -->
              <a href="http://localhost:3000/profile" class="${tw`flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded-xl focus:outline-none`}">
                <img
                  src=${avatar || FALLBACK_AVATAR}
                  @error=${e => (e.currentTarget.src = FALLBACK_AVATAR)}
                  class="${tw`w-8 h-8 rounded-full object-cover`}" />
                <div class="${tw`text-left`}">
                  <div class="${tw`text-sm font-medium text-gray-900`}">${name}</div>
                  <div class="${tw`text-sm text-gray-500`}">${email}</div>
                </div>
              </a>

              <button @click=${this._onLogout}
                      class="${tw`px-3 py-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl focus:outline-none`}">
                <svg class="${tw`text-lg`}" fill="currentColor" width="1em" height="1em">
                  <use href="#ri-logout-box-r-line"></use>
                </svg>
              </button>`
          : html`
              <!-- если анонимия разрешена — компактная карточка «Аноним» -->
              ${showAnon ? html`
                <div class="${tw`flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl`}">
                  <img src=${ANONYMOUS_AVATAR}
                       class="${tw`w-8 h-10 rounded-full object-cover`}" />
                  <span class="${tw`text-sm text-gray-700`}">Аноним</span>
                </div>` : ''}

              <button @click=${this._onLogin}
                      class="${tw`px-6 py-4 bg-sky-600 text-white text-sm font-medium rounded-xl focus:outline-none`}">
                Войти
              </button>`}
      </div>`;
  }
}

customElements.define('user-menu', UserMenu);
