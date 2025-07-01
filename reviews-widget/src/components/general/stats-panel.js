// src/components/stats-panel.js
import { html } from 'lit';
import { tw } from '../../twind-setup.js';
import { BaseComponent } from './base-component.js';

export class StatsPanel extends BaseComponent {
  static properties = {
    type: { type: String }, // 'reviews' или 'qa'
    data: { type: Object },
  };

  render() {
    const stats = this.data || {};

    // ОТЗЫВЫ
    if (this.type === 'reviews') {
      const {
        average      = 0,
        total        = 0,
        distribution = [],
        sentiments   = {},
        emotions     = {},
      } = stats;

      const sentimentConfig = [
        { key: 'positive', label: 'Положительные', icon: 'bx-happy', bg: tw`bg-green-50`, textClass: tw`text-green-700`, iconClass: tw`text-green-500` },
        { key: 'neutral',  label: 'Нейтральные',   icon: 'bx-meh',   bg: tw`bg-gray-50`,  textClass: tw`text-gray-700`, iconClass: tw`text-gray-500` },
        { key: 'negative', label: 'Отрицательные', icon: 'bx-sad',   bg: tw`bg-red-50`,   textClass: tw`text-red-700`,  iconClass: tw`text-red-500` },
      ];

      const emotionConfig = [
        { key: 'joy',        label: 'Радость',        icon: 'bx-happy-alt',         bg: tw`bg-amber-50`, trackBg: tw`bg-amber-200`, fillBg: tw`bg-amber-500`,   iconClass: tw`text-amber-500` },
        { key: 'interest',   label: 'Интерес',        icon: 'bx-search-alt',        bg: tw`bg-indigo-50`,trackBg: tw`bg-indigo-200`,fillBg: tw`bg-indigo-500`,  iconClass: tw`text-indigo-500` },
        { key: 'surprise',   label: 'Удивление',      icon: 'bx-shocked',           bg: tw`bg-amber-50`, trackBg: tw`bg-amber-200`, fillBg: tw`bg-amber-500`,   iconClass: tw`text-amber-500` },
        { key: 'sadness',    label: 'Грусть',         icon: 'bx-sad',               bg: tw`bg-blue-50`,  trackBg: tw`bg-blue-200`,  fillBg: tw`bg-blue-500`,    iconClass: tw`text-blue-500` },
        { key: 'anger',      label: 'Злость',         icon: 'bx-angry',             bg: tw`bg-red-50`,   trackBg: tw`bg-red-200`,   fillBg: tw`bg-red-500`,     iconClass: tw`text-red-500` },
        { key: 'disgust',    label: 'Отвращение',     icon: 'bx-bug',               bg: tw`bg-lime-50`,  trackBg: tw`bg-lime-200`,  fillBg: tw`bg-lime-600`,    iconClass: tw`text-lime-600` },
        { key: 'fear',       label: 'Страх',          icon: 'bx-alarm-exclamation', bg: tw`bg-blue-50`,  trackBg: tw`bg-blue-200`,  fillBg: tw`bg-blue-500`,    iconClass: tw`text-blue-500` },
        { key: 'guilt',      label: 'Вина',           icon: 'bx-tired',             bg: tw`bg-indigo-50`,trackBg: tw`bg-indigo-200`,fillBg: tw`bg-indigo-500`,  iconClass: tw`text-indigo-500` },
        { key: 'neutrality', label: 'Нейтральность',  icon: 'ri-emotion-normal-line',bg: tw`bg-gray-100`, trackBg: tw`bg-gray-200`,  fillBg: tw`bg-gray-500`,    iconClass: tw`text-gray-500` },
      ];

      return html`
        <div class="${tw`mb-8`}">
          <div class="${tw`text-center mb-4`}">
            <div class="${tw`text-5xl font-bold`}">${average.toFixed(1)}</div>
            <div class="${tw`flex justify-center mb-1 space-x-1`}">
              ${[1, 2, 3, 4, 5].map(i => html`
                <svg class="${tw`${i <= Math.round(average) ? 'text-yellow-400' : 'text-gray-300'} text-xl`}"
                     fill="currentColor" width="1em" height="1em">
                  <use href="#bxs-star"/>
                </svg>`)}
            </div>
            <div class="${tw`text-sm text-gray-500`}">На основе ${total} отзывов</div>
          </div>

          <div class="${tw`space-y-2 mb-6`}">
            ${distribution.map(({ stars, percent }) => html`
              <div class="${tw`flex items-center`}">
                <span class="${tw`w-4 mr-2`}">${stars}</span>
                <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bxs-star"/>
                </svg>
                <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:${percent}%"></div>
                </div>
                <span class="${tw`ml-2 text-sm text-gray-500 w-9`}">${percent}%</span>
              </div>`)}
          </div>

          <div class="${tw`grid grid-cols-3 gap-2 mb-6 text-center`}">
            ${sentimentConfig.map(cfg => {
              const pct = sentiments[cfg.key] ?? 0;
              return html`
                <div class="${tw`flex flex-col items-center ${cfg.bg} rounded-2xl p-3`}">
                  <div class="${tw`${cfg.textClass} text-lg font-medium`}">${pct}%</div>
                  <svg class="${tw`${cfg.iconClass} text-xl mt-1`}" fill="currentColor" width="1em" height="1em">
                    <use href="#${cfg.icon}"/>
                  </svg>
                </div>`;
            })}
          </div>

          <div class="${tw`space-y-3`}">
            ${emotionConfig.map(cfg => {
              const pct = emotions[cfg.key] ?? 0;
              if (!pct) return html``;
              return html`
                <div class="${tw`flex flex-col ${cfg.bg} rounded-2xl p-3`}">
                  <div class="${tw`flex items-center`}">
                    <svg class="${`${cfg.iconClass} ${tw`mr-3`}`}" fill="currentColor" width="1em" height="1em">
                      <use href="#${cfg.icon}"/>
                    </svg>
                    <div class="${tw`flex-1`}">
                      <div class="${tw`text-sm font-medium`}">
                        ${cfg.label}
                        <span class="${tw`ml-2 text-xs text-gray-500`}">${pct}% отзывов</span>
                      </div>
                    </div>
                  </div>
                  <div class="${tw`mt-2 h-1 ${cfg.trackBg} rounded-full overflow-hidden`}">
                    <div class="${tw`h-full ${cfg.fillBg}`}" style="width:${pct}%"></div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      `;
    }

    // ВОПРОСЫ И ОТВЕТЫ
    if (this.type === 'qa') {
      const {
        totalQuestions  = 0,
        answeredCount   = 0,
        unansweredCount = 0,
      } = stats;

      // вычисляем проценты
      let answeredPercent   = totalQuestions ? Math.round((answeredCount   / totalQuestions) * 100) : 0;
      let unansweredPercent = totalQuestions ? Math.round((unansweredCount / totalQuestions) * 100) : 0;

      return html`
        <div class="${tw`mb-8`}">
          <div class="${tw`text-center mb-4`}">
            <div class="${tw`text-5xl font-bold`}">${totalQuestions}</div>
            <div class="${tw`text-sm text-gray-500`}">Всего вопросов</div>
          </div>

          <div class="${tw`space-y-6 text-sm`}">
            <div>
              <div class="${tw`text-black font-medium mb-1`}">С ответом</div>
              <div class="${tw`flex items-center`}">
                <svg class="${tw`text-green-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bx-check-circle"/>
                </svg>
                <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${tw`h-full bg-green-500 rounded-full`}" style="width:${answeredPercent}%"></div>
                </div>
                <span class="${tw`ml-2 text-gray-500`}">${answeredCount}</span>
              </div>
            </div>

            <div>
              <div class="${tw`text-black font-medium mb-1`}">Без ответа</div>
              <div class="${tw`flex items-center`}">
                <svg class="${tw`text-red-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                  <use href="#bx-x-circle"/>
                </svg>
                <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                  <div class="${tw`h-full bg-red-500 rounded-full`}" style="width:${unansweredPercent}%"></div>
                </div>
                <span class="${tw`ml-2 text-gray-500`}">${unansweredCount}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // если тип не распознан, возвращаем пустой шаблон
    return html``;
  }
}

customElements.define('stats-panel', StatsPanel);
