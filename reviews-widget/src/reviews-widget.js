// src/reviews-widget.js
import { LitElement, html } from 'lit';
import sprite               from './sprite.svg?raw';
import { sheet, tw }        from './twind-setup.js';
import axios                from 'axios';
import ANONYMOUS_AVATAR   from './assets/anonymous-user.svg?url';
import FALLBACK_AVATAR    from './assets/fallback-avatar.svg?url';

const WIDGET_ORIGIN = 'http://localhost:3000';  

// ——— axios c cookies ———
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,          
});

// ——— auto-refresh на экземпляр api ———
api.interceptors.response.use(
  res => res,
  async err => {
    const { response, config } = err;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        await api.post('/api/auth/refresh');
        return api(config);
      } catch {
        console.error('Ошибка обновления токена', err);
        return Promise.reject(err);}
    }
    return Promise.reject(err);
  }
);

const toAbs = u => (u && !u.startsWith('http')) ? WIDGET_ORIGIN + u : u;

const displayName = user => {
  if (!user) return 'Аноним';
  const first = user.first_name?.trim() ?? '';
  const last  = user.last_name?.trim()  ?? '';
  const full  = `${first} ${last}`.trim();
  return full || user.name || 'Аноним';
};

// ——— преобразуют «сырые» объекты API в формат, который ждёт UI ———
const mapReview  = raw => {
  const author = raw.author
    ? { id: raw.author.id,
        fullname: displayName(raw.author),
        avatar  : toAbs(raw.author.avatar_url) }
    : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR };

  const media = Array.isArray(raw.media)
    ? raw.media
        .map(m => m.url)
        .filter(Boolean)
        .map(u => u.startsWith('http') ? u : WIDGET_ORIGIN + u)
    : [];

  return {
    // базовые поля из API
    id: raw.id,
    rating: raw.rating,
    text: raw.text,
    sentiment: raw.sentiment,
    emotion: raw.emotion,
    likes: raw.likes ?? 0,
    dislikes: raw.dislikes ?? 0,
    myReaction: raw.myReaction ?? null,
    commentsCount: raw.comments_count ?? 0,

    // то, чего нет в «сырых» данных, но нужно фронту
    author,
    date: new Date(raw.created_at)
            .toLocaleDateString('ru-RU',
              { day:'numeric', month:'long', year:'numeric' }),
    media,
    replies: [],
    _loadedComments: false,
    showReplies: false
  };
};

const mapQuestion = raw => {
  const author = raw.author
    ? { id: raw.author.id,
        fullname: displayName(raw.author),
        avatar  : toAbs(raw.author.avatar_url) }
    : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR };

  return {
    id: raw.id,
    text: raw.text,
    likes: raw.likes ?? 0,
    dislikes: raw.dislikes ?? 0,
    myReaction: raw.myReaction ?? null,
    answersCount: raw.answers_count ?? 0,

    author,
    date: new Date(raw.created_at)
            .toLocaleDateString('ru-RU',
              { day:'numeric', month:'long', year:'numeric' }),
    answers: [],
    _loadedAnswers: false,
    showAnswers: false
  };
};

const mapComment = (c, currentUser) => {
  const author = c.author
    ? { id: c.author.id,
        fullname: displayName(c.author),
        avatar  : toAbs(c.author.avatar_url) }
    : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR };

  return {
    ...c,
    author,
    date: new Date(c.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    likes:      c.likes    ?? 0,
    dislikes:   c.dislikes ?? 0,
    myReaction: currentUser.isAuthenticated ? c.myReaction : null,
  };
};

const mapAnswer = (a, currentUser) => {
  const author = a.author
    ? { id: a.author.id,
        fullname: displayName(a.author),
        avatar  : toAbs(a.author.avatar_url) }
    : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR };

  return {
    ...a,
    author,
    date: new Date(a.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    likes:      a.likes    ?? 0,
    dislikes:   a.dislikes ?? 0,
    myReaction: currentUser.isAuthenticated ? a.myReaction : null,
  };
};

// ——— general ui ———
import './components/general/stats-panel.js';
import './components/general/tab-nav.js';
import './components/general/user-menu.js';

// ——— разделы со списками ———
import './components/reviews/reviews-section.js';
import './components/qa/qa-section.js';

// ——— модалки ———
import './components/general/modals/add-review-modal.js';
import './components/general/modals/add-question-modal.js';
import './components/general/modals/media-view-modal.js';
import './components/general/modals/report-modal.js';

export class ReviewsWidget extends LitElement {
  static properties = {
    widgetId:    { type: String, attribute: 'widget-id' },
    currentTab   : { type: String },
    currentUser  : { type: Object, hasChanged: () => true },
    configError  : { type: Boolean, state: true },
    reviews      : { type: Array },
    reviewsStats : { type: Object },
    questions    : { type: Array },
    qaStats      : { type: Object },
    allowAnonymous:  { type: Boolean }
  };

  constructor() {
    super();
    this.currentTab   = 'reviews';
    this.currentUser = {
      isAuthenticated: false,
    };
    this.configError  = false;
    this.reviews      = [];
    this.reviewsStats = null;
    this.questions    = [];
    this.qaStats      = null;
    this._loginWindow = null;
    this.allowAnonymous  = false;

    // слушаем события из child-компонентов
    this.addEventListener('login',             this._triggerLogin);
    this.addEventListener('logout',            this._onLogout);
    this.addEventListener('submit-review',     this._onSubmitReview);
    this.addEventListener('submit-question',   this._onSubmitQuestion);
    this.addEventListener('view-media',        this._viewMedia);

    this.addEventListener('review-like',       this._onReviewLike);
    this.addEventListener('review-dislike',    this._onReviewDislike);
    this.addEventListener('comment-toggle',    this._onCommentToggle);
    this.addEventListener('send-comment',      this._onSendComment);
    this.addEventListener('comment-like',      this._onCommentLike);
    this.addEventListener('comment-dislike',   this._onCommentDislike);

    this.addEventListener('question-like',     this._onQuestionLike);
    this.addEventListener('question-dislike',  this._onQuestionDislike);
    this.addEventListener('answer-toggle',     this._onAnswerToggle);
    this.addEventListener('send-answer',       this._onSendAnswer);
    this.addEventListener('answer-like',       this._onAnswerLike);
    this.addEventListener('answer-dislike',    this._onAnswerDislike);

    // отдельные события жалоб
    this.addEventListener('submit-report', this._onSubmitReport);
  }

  async firstUpdated() {
    // внедряем спрайт и стили Twind
    const tpl = document.createElement('template');
    tpl.innerHTML = sprite;
    this.renderRoot.prepend(tpl.content.cloneNode(true));

    if (this.renderRoot.adoptedStyleSheets !== undefined) {
      this.shadowRoot.adoptedStyleSheets = [ sheet.target ];
    } else {
      // fallback: вставляем тег <style>
      const styleEl = document.createElement('style');
      styleEl.textContent = sheet.target.toString();
      this.renderRoot.prepend(styleEl);
    }

    await this._loadConfig();

    this._es = new EventSource(
      `${WIDGET_ORIGIN}/api/widgets/${this.widgetId}/config/stream`
    );

    this._es.addEventListener('config', e => {
      const cfg = JSON.parse(e.data);
      // применяем новое значение
      this.allowAnonymous = Boolean(cfg.allowAnonymous);
      // при необходимости — ре-рендерим кнопки, модалки и т.д.
      this.requestUpdate();
    });
    
    await this._loadReviews();
    await this._loadQuestions();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('message', this._onLoginMessage);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._es) this._es.close();
    window.removeEventListener('message', this._onLoginMessage);
  }

  render() {
    if (this.configError) {
      return html`
        <style>
          #reviews-widget { font-family: 'Montserrat', sans-serif; }
          @keyframes pulse-shadow {
            0% {
              box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
              border-color: #ef4444;
            }
            50% {
              box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
              border-color: #b91c1c;
            }
            100% {
              box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
              border-color: #ef4444;
            }
          }

          #reviews-widget div {
            border: 2px solid #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
            animation: pulse-shadow 2.5s ease-in-out infinite;
          }
        </style>
        <div id="reviews-widget" class=${tw`max-w-7xl mx-auto p-6`}>
          <div
            class=${tw`bg-white rounded-3xl p-8 h-64 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-6`}
          >
            <svg
              class=${tw`text-red-500 fill-current w-16 h-16`}
              viewBox="0 0 24 24"
            >
              <use href="#bx-error-alt" />
            </svg>
            <p class=${tw`text-red-600 text-xl md:text-2xl font-semibold leading-relaxed`}>
              Виджет не сконфигурирован для этого сайта.
            </p>
          </div>
        </div>
      `;
    }
    else {
      return html`
      <style>
        #reviews-widget, #modals { font-family: 'Montserrat', sans-serif; }
      </style>
      <div id="reviews-widget" class=${tw`max-w-7xl mx-auto p-4`}>
        <div class=${tw`bg-white rounded-2xl shadow-lg`}>

          <!-- Верхняя панель -->
          <div class=${tw`border-b border-gray-200`}>
            <div class=${tw`flex items-center justify-between px-6 py-4`}>
              <tab-nav
                .active=${this.currentTab}
                @tab-change=${e => this.currentTab = e.detail.tab}>
              </tab-nav>
              <user-menu .user=${this.currentUser} .allowAnonymous=${this.allowAnonymous}></user-menu>
            </div>
          </div>

          <!-- Контент -->
          <div class=${tw`flex flex-col md:flex-row`}>

            <!-- Левая колонка: статистика + кнопка -->
            <aside class=${tw`p-6 w-full md:w-1/4 border-r border-gray-200`}>
              ${this.currentTab==='reviews'
                ? html`<stats-panel type="reviews" .data=${this.reviewsStats}></stats-panel>`
                : html`<stats-panel type="qa"      .data=${this.qaStats}></stats-panel>`}
              <button @click=${this._showAddModal}
                      ?disabled=${!(this.currentUser.isAuthenticated || this.allowAnonymous)}
                      class=${tw`w-full py-3 px-4 rounded-xl font-medium focus:outline-none transition-colors duration-200
                        ${(this.currentUser.isAuthenticated || this.allowAnonymous) ? 'bg-sky-600 text-white hover:bg-opacity-90' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
                ${this.currentTab==='reviews' ? 'Оставить отзыв' : 'Задать вопрос'}
              </button>
            </aside>

            <!-- Правая колонка: секции -->
            <section class=${tw`p-6 w-full md:w-3/4`}>
              ${this.currentTab==='reviews'
                ? html`
                  <reviews-section
                    .reviews=${this.reviews}
                    .currentUser=${this.currentUser}
                    .allowAnonymous=${this.allowAnonymous}
                    @view-media=${this._viewMedia}
                    @review-report=${this._openReport}
                    @comment-report=${this._openReport}>
                  </reviews-section>`
                : html`
                  <qa-section
                    .questions=${this.questions}
                    .currentUser=${this.currentUser}
                    .allowAnonymous=${this.allowAnonymous}
                    @view-media=${this._viewMedia}
                    @question-report=${this._openReport}
                    @answer-report=${this._openReport}>
                  </qa-section>`}
            </section>

          </div>
        </div>
      </div>

      <!-- Модалки -->
        <div id="modals">
        <add-review-modal   id="add-review-modal" .allowAnonymous=${this.allowAnonymous}></add-review-modal>
        <add-question-modal id="add-question-modal" .allowAnonymous=${this.allowAnonymous}></add-question-modal>
        <media-view-modal   id="media-view-modal"></media-view-modal>
        <report-modal       id="report-modal"></report-modal>
      </div>
    `;
    }
  }

  // ───────────────── Reviews ─────────────────

  async _loadReviews() {
    try {
      const { data } = await api.get(
        `/api/widgets/${this.widgetId}/reviews`,
        { withCredentials: true }
      );
      this.reviews      = data.reviews.map(mapReview);
      this.reviewsStats = data.stats;
    } catch (e) {
      console.error('Ошибка загрузки отзывов', e);
    }
  }

  async _onSubmitReview({ detail }) {
    // ───────────────── optimistic ─────────────────
    const optimistic = {
      id: Date.now(),
      author : this.currentUser.isAuthenticated
        ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar }
        : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR },
      date: new Date().toLocaleDateString('ru-RU',
              { day:'numeric', month:'long', year:'numeric' }),
      rating: detail.rating,
      text:   detail.text,
      sentiment: null,
      emotion:   null,
      media: [],
      likes: 0,
      dislikes: 0,
      myReaction: null,
      commentsCount: 0,
      replies: [],
      _loadedComments: false,
      showReplies: false
    };
    this.reviews = [optimistic, ...this.reviews];

    // ───────────────── отправка формы ─────────────────
    const form = new FormData();
    form.append('rating', detail.rating);
    form.append('text',   detail.text);
    detail.files.forEach(f => form.append('files', f));

    let raw;
    try {
      raw = (await api.post(
        `/api/widgets/${this.widgetId}/reviews`,
        form,
        { withCredentials: true }
      )).data;
    } catch (err) {
      console.error('Не удалось отправить отзыв', err);
      this.reviews = this.reviews.filter(r => r.id !== optimistic.id);
      alert('Не удалось отправить отзыв');
      return;
    }

    // ───────────────── замена заглушки реальным отзывом ─────────────────
    const real = mapReview(raw);

    this.reviews = this.reviews.map(r =>
      r.id === optimistic.id ? real : r
    );

    await this._loadReviews();
  }

  async _onReviewLike({ detail: { reviewId } }) {
    // Сохраняем предыдущий массив на случай отката
    const prev = [...this.reviews];
    const review = prev.find(r => r.id === reviewId);
    const already = review.myReaction === 'like';

    // Оптимистичное обновление одного отзыва
    this.reviews = prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        likes:      already ? r.likes - 1 : r.likes + 1,
        dislikes:   already
          ? r.dislikes
          : (r.myReaction === 'dislike' ? r.dislikes - 1 : r.dislikes),
        myReaction: already ? null : 'like'
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/like`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/like`
        );
      }
    } catch (err) {
      // при ошибке откатываем
      if (err.response?.status !== 404) {
        console.error('Ошибка лайка отзыва, откатываем', err);
        this.reviews = prev;
      }
    }
  }

  async _onReviewDislike({ detail: { reviewId } }) {
    const prev = [...this.reviews];
    const review = prev.find(r => r.id === reviewId);
    const already = review.myReaction === 'dislike';

    this.reviews = prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        dislikes:   already ? r.dislikes - 1 : r.dislikes + 1,
        likes:      already
          ? r.likes
          : (r.myReaction === 'like' ? r.likes - 1 : r.likes),
        myReaction: already ? null : 'dislike'
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/dislike`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/dislike`
        );
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка дизлайка отзыва, откатываем', err);
        this.reviews = prev;
      }
    }
  }

  // ───────────────── Comments ─────────────────

  async _onCommentToggle({ detail: { reviewId } }) {
    await this._toggleSection({
      id: reviewId,
      listKey:       'reviews',
      loadedFlagKey: '_loadedComments',
      showFlagKey:   'showReplies',
      loadFn: async id => {
        const res = await api.get(`/api/widgets/${this.widgetId}/reviews/${id}/comments`, { withCredentials:true });
        return Array.isArray(res.data.comments)
          ? res.data.comments.map(c => mapComment(c, this.currentUser))
          : [];
      }
    });
  }

  
  async _onSendComment({ detail: { reviewId, text } }) {
    // оптимистичная вставка
    const optimistic = {
      id:         `tmp-${Date.now()}`,   // временный id
      created_at: Date.now(),
      text,
      likes:      0,
      dislikes:   0,
      myReaction: null,
      author: this.currentUser.isAuthenticated
        ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar || FALLBACK_AVATAR }
        : null
    };

    this.reviews = this.reviews.map(r => r.id === reviewId
      ? { ...r,
          replies:       [...r.replies, mapComment(optimistic, this.currentUser)],
          commentsCount: (r.commentsCount || 0) + 1 }
      : r );

    // сетевой запрос
    let real;
    try {
      real = (await api.post(
        `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments`,
        { text }, { withCredentials: true }
      )).data;
    } catch (err) {
      // откат при ошибке
      console.error('Не удалось добавить комментарий', err);
      this.reviews = this.reviews.map(r => r.id === reviewId
        ? { ...r,
            replies:       r.replies.filter(c => !c.id.toString().startsWith('tmp-')),
            commentsCount: r.commentsCount - 1 }
        : r );
      alert('Не удалось добавить комментарий');
      return;
    }

    // замена временного объекта на реальный
    const mapped = mapComment(real, this.currentUser);
    this.reviews = this.reviews.map(r => r.id === reviewId
      ? { ...r,
          replies:       r.replies.map(c =>
                          c.id === optimistic.id ? mapped : c) }
      : r );
  }

  async _onCommentLike({ detail: { reviewId, commentId } }) {
    const prev = [...this.reviews];

    // находим текущий статус
    const comment = prev
      .find(r => r.id === reviewId)
      .replies.find(c => c.id === commentId);
    const already = comment.myReaction === 'like';

    // оптимистично обновляем UI
    this.reviews = prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        replies: r.replies.map(c => {
          if (c.id !== commentId) return c;
          return {
            ...c,
            likes:      already ? c.likes  - 1 : c.likes  + 1,
            dislikes:   already
              ? c.dislikes
              : (c.myReaction === 'dislike' ? c.dislikes - 1 : c.dislikes),
            myReaction: already ? null : 'like'
          };
        })
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments/${commentId}/like`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments/${commentId}/like`
        );
      }
    } catch(err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка лайка, откатываем', err);
        this.reviews = prev;
      }
    }
  }

  async _onCommentDislike({ detail: { reviewId, commentId } }) {
    const prev = [...this.reviews];

    const comment = prev
      .find(r => r.id === reviewId)
      .replies.find(c => c.id === commentId);
    const already = comment.myReaction === 'dislike';

    this.reviews = prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        replies: r.replies.map(c => {
          if (c.id !== commentId) return c;
          return {
            ...c,
            dislikes:   already ? c.dislikes - 1 : c.dislikes + 1,
            likes:      already
              ? c.likes
              : (c.myReaction === 'like' ? c.likes - 1 : c.likes),
            myReaction: already ? null : 'dislike'
          };
        })
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments/${commentId}/dislike`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments/${commentId}/dislike`
        );
      }
    } catch(err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка лайка, откатываем', err);
        this.reviews = prev;
      }
    }
  }

  // ───────────────── Questions ─────────────────

  async _loadQuestions() {
    try {
      const { data } = await api.get(
        `/api/widgets/${this.widgetId}/questions`,
        { withCredentials: true }
      );
      this.questions = data.questions.map(mapQuestion);
      this.qaStats = data.stats;
    } catch (e) {
      console.error('Ошибка загрузки вопросов', e);
    }
  }

  async _onSubmitQuestion({ detail }) {
    // optimistic
    const optimistic = {
      id: Date.now(),
      author : this.currentUser.isAuthenticated
        ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar }
        : { fullname: 'Аноним', avatar: ANONYMOUS_AVATAR },
      date: new Date().toLocaleDateString('ru-RU',
              { day:'numeric', month:'long', year:'numeric' }),
      text: detail.text,
      likes: 0,
      dislikes: 0,
      myReaction: null,
      answersCount: 0,
      answers: [],
      _loadedAnswers: false,
      showAnswers: false
    };
    this.questions = [optimistic, ...this.questions];

    // отправка
    let raw;
    try {
      raw = (await api.post(
        `/api/widgets/${this.widgetId}/questions`,
        { text: detail.text },
        { withCredentials: true }
      )).data;
    } catch (err) {
      console.error('Не удалось задать вопрос', err);
      this.questions = this.questions.filter(q => q.id !== optimistic.id);
      alert('Не удалось задать вопрос');
      return;
    }

    // замена optimistic
    const real = mapQuestion(raw);

    this.questions = this.questions.map(q =>
      q.id === optimistic.id ? real : q
    );

    await this._loadQuestions();
  }

  async _onQuestionLike({ detail: { questionId } }) {
    // Сохраняем предыдущий массив на случай отката
    const prev = [...this.questions];
    const question = prev.find(q => q.id === questionId);
    const already = question.myReaction === 'like';

    // Оптимистичное обновление одного вопроса
    this.questions = prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        likes:      already ? q.likes - 1 : q.likes + 1,
        dislikes:   already
          ? q.dislikes
          : (q.myReaction === 'dislike' ? q.dislikes - 1 : q.dislikes),
        myReaction: already ? null : 'like'
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/questions/${questionId}/like`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/questions/${questionId}/like`
        );
      }
    } catch (err) {
      // откатываем к прежнему состоянию
      if (err.response?.status !== 404) {
        console.error('Ошибка лайка вопроса, откатываем', err);
        this.questions = prev;
      }
    }
  }

  async _onQuestionDislike({ detail: { questionId } }) {
    const prev = [...this.questions];
    const question = prev.find(q => q.id === questionId);
    const already = question.myReaction === 'dislike';

    this.questions = prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        dislikes:   already ? q.dislikes - 1 : q.dislikes + 1,
        likes:      already
          ? q.likes
          : (q.myReaction === 'like' ? q.likes - 1 : q.likes),
        myReaction: already ? null : 'dislike'
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/questions/${questionId}/dislike`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/questions/${questionId}/dislike`
        );
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка дизлайка вопроса, откатываем', err);
        this.questions = prev;
      }
    }
  }

  // ───────────────── Questions ─────────────────

  async _onAnswerToggle({ detail: { questionId } }) {
    await this._toggleSection({
      id: questionId,
      listKey:       'questions',
      loadedFlagKey: '_loadedAnswers',
      showFlagKey:   'showAnswers',
      loadFn: async id => {
        const res = await api.get(`/api/widgets/${this.widgetId}/questions/${id}/answers`, { withCredentials:true });
        return Array.isArray(res.data.answers)
          ? res.data.answers.map(a => mapAnswer(a, this.currentUser))
          : [];
      }
    });
  }

  async _onSendAnswer({ detail: { questionId, text } }) {
    // оптимистичная вставка
    const optimistic = {
      id:         `tmp-${Date.now()}`,
      created_at: Date.now(),
      text,
      likes:      0,
      dislikes:   0,
      myReaction: null,
      author: this.currentUser.isAuthenticated
        ? { fullname: this.currentUser.fullname, avatar: this.currentUser.avatar || FALLBACK_AVATAR }
        : null, 
    };

    this.questions = this.questions.map(q => q.id === questionId
      ? { ...q,
          answers:       [...q.answers, mapAnswer(optimistic, this.currentUser)],
          answersCount:  (q.answersCount || 0) + 1,
          _loadedAnswers: true,
          showAnswers:    true }
      : q );

    // сетевой запрос
    let real;
    try {
      real = (await api.post(
        `/api/widgets/${this.widgetId}/questions/${questionId}/answers`,
        { text }, { withCredentials: true }
      )).data.answer;     // сервер возвращает { answer: {...} }
    } catch (err) {
      // откат
      console.error('Не удалось добавить ответ', err);
      this.questions = this.questions.map(q => q.id === questionId
        ? { ...q,
            answers:      q.answers.filter(a => !a.id.toString().startsWith('tmp-')),
            answersCount: q.answersCount - 1 }
        : q );
      alert('Не удалось добавить ответ');
      return;
    }

    // замена оптимистичного на реальный
    const mapped = mapAnswer(real, this.currentUser);
    this.questions = this.questions.map(q => q.id === questionId
      ? { ...q,
          answers: q.answers.map(a =>
                  a.id === optimistic.id ? mapped : a) }
      : q );

    // при необходимости обновляем QA-статистику
    if (this.qaStats && this.qaStats.answeredCount < this.qaStats.totalQuestions) {
      const answered = this.qaStats.answeredCount + 1;
      const total    = this.qaStats.totalQuestions;
      this.qaStats = {
        ...this.qaStats,
        answeredCount:    answered,
        unansweredCount:  total - answered,
        answeredPercent:  Math.round(answered / total * 100),
        unansweredPercent: 100 - Math.round(answered / total * 100)
      };
    }
  }

  async _onAnswerLike({ detail: { questionId, answerId } }) {
    const prev = [...this.questions];

    // находим текущий статус
    const answer = prev
      .find(q => q.id === questionId)
      .answers.find(a => a.id === answerId);
    const already = answer.myReaction === 'like';

    // Оптимистично обновляем UI
    this.questions = prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        answers: q.answers.map(a => {
          if (a.id !== answerId) return a;
          return {
            ...a,
            likes:      already ? a.likes - 1 : a.likes + 1,
            dislikes:   already
              ? a.dislikes
              : (a.myReaction === 'dislike' ? a.dislikes - 1 : a.dislikes),
            myReaction: already ? null : 'like'
          };
        })
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/questions/${questionId}/answers/${answerId}/like`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/questions/${questionId}/answers/${answerId}/like`
        );
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка лайка ответа, откатываем', err);
        this.questions = prev;
      }
    }
  }

  async _onAnswerDislike({ detail: { questionId, answerId } }) {
    const prev = [...this.questions];

    const answer = prev
      .find(q => q.id === questionId)
      .answers.find(a => a.id === answerId);
    const already = answer.myReaction === 'dislike';

    this.questions = prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        answers: q.answers.map(a => {
          if (a.id !== answerId) return a;
          return {
            ...a,
            dislikes:   already ? a.dislikes - 1 : a.dislikes + 1,
            likes:      already
              ? a.likes
              : (a.myReaction === 'like' ? a.likes - 1 : a.likes),
            myReaction: already ? null : 'dislike'
          };
        })
      };
    });

    try {
      if (already) {
        await api.delete(
          `/api/widgets/${this.widgetId}/questions/${questionId}/answers/${answerId}/dislike`
        );
      } else {
        await api.post(
          `/api/widgets/${this.widgetId}/questions/${questionId}/answers/${answerId}/dislike`
        );
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Ошибка дизлайка ответа, откатываем', err);
        this.questions = prev;
      }
    }
  }

  // ───────────────── Reports ─────────────────

  async _onSubmitReport(e) {
    const { type, reviewId, commentId, questionId, answerId, reason, text } = e.detail;
    try {
      switch (type) {
        case 'review':
          await api.post(`/api/widgets/${this.widgetId}/reviews/${reviewId}/report`, { reason, text });
          alert('Жалоба на отзыв отправлена');
          break;
        case 'comment':
          await api.post(
            `/api/widgets/${this.widgetId}/reviews/${reviewId}/comments/${commentId}/report`,
            { reason, text }
          );
          alert('Жалоба на комментарий отправлена');
          break;
        case 'question':
          await api.post(`/api/widgets/${this.widgetId}/questions/${questionId}/report`, { reason, text });
          alert('Жалоба на вопрос отправлена');
          break;
        case 'answer':
          await api.post(
            `/api/widgets/${this.widgetId}/questions/${questionId}/answers/${answerId}/report`,
            { reason, text }
          );
          alert('Жалоба на ответ отправлена');
          break;
      }
    } catch (err) {
      console.error('Ошибка отправки жалобы', err);
      alert('Не удалось отправить жалобу');
    }
  }

  // ───────────────── Helpers ─────────────────

  _showAddModal() {
    const id = this.currentTab === 'reviews' ? 'add-review-modal' : 'add-question-modal';
    this.shadowRoot.getElementById(id).openModal();
  }

  _openReport = e => {
    // e.type это строка 'review-report' или 'comment-report' и т.д.
    const { detail } = e;
    const payload = {
      type: detail.type || e.type.replace('-report', ''), // 'review'|'comment'|'question'|'answer'
      reviewId:   detail.reviewId,
      commentId:  detail.commentId,
      questionId: detail.questionId,
      answerId:   detail.answerId
    };
  
    // находим наш ReportModal по id
    const modal = this.shadowRoot.getElementById('report-modal');
    // передаём ему payload
    modal.target = payload;
    modal.openModal();
  };
  

  _ensureAuth() {
    if (!this.currentUser.isAuthenticated) {
      this._triggerLogin();
      return false;
    }
    return true;
  }

  _triggerLogin() {
    const redirect     = encodeURIComponent(location.href);
    const parentOrigin = encodeURIComponent(window.location.origin);
    const url = `${WIDGET_ORIGIN}/login?redirect=${redirect}&origin=${parentOrigin}`;
    this._loginWindow = window.open(url, 'reviews_login', 'width=500,height=600');
  }
  
  async _onLogout() {
    // Сохраняем текущее состояние секций отзывов
    const reviewsState = this.reviews.reduce((map, r) => {
      map[r.id] = {
        show:    r.showReplies,
        loaded:  r._loadedComments,
        replies: r.replies
      };
      return map;
    }, {});

    // Итекущее состояние секций вопросов
    const questionsState = this.questions.reduce((map, q) => {
      map[q.id] = {
        show:    q.showAnswers,
        loaded:  q._loadedAnswers,
        answers: q.answers
      };
      return map;
    }, {});

    // Ревокируем refresh-token
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout failed on server', e);
    }
    localStorage.removeItem('accessToken');

    // Сбрасываем user и перезагружаем конфиг/данные
    this.currentUser = { isAuthenticated: false };
    await Promise.all([
      this._loadConfig(),
      this._loadReviews(),
      this._loadQuestions()
    ]);

    // Восстанавливаем секции отзывов
    this.reviews = this.reviews.map(r => {
      const saved = reviewsState[r.id] || {};
      return {
        ...r,
        showReplies:     saved.show    || false,
        _loadedComments: false,
        replies:         []
      };
    });

    // Для открытых секций отзывов заново загружаем комментарии
    this.reviews
      .filter(r => r.showReplies)
      .forEach(r => this._onCommentToggle({ detail: { reviewId: r.id } }));

    // Восстанавливаем секции вопросов
    this.questions = this.questions.map(q => {
      const saved = questionsState[q.id] || {};
      return {
        ...q,
        showAnswers:     saved.show    || false,
        _loadedAnswers:  false,
        answers:         []
      };
    });

    // Для открытых секций вопросов заново загружаем ответы
    this.questions
      .filter(q => q.showAnswers)
      .forEach(q => this._onAnswerToggle({ detail: { questionId: q.id } }));
  }

  _onLoginMessage = async (event) => {
    if (event.data !== 'LOGIN_SUCCESS') return;

    // Сохраняем текущее состояние секций отзывов
    const reviewsState = this.reviews.reduce((map, r) => {
      map[r.id] = {
        show:    r.showReplies,
        loaded:  r._loadedComments,
        replies: r.replies
      };
      return map;
    }, {});

    // Сохраняем текущее состояние секций вопросов
    const questionsState = this.questions.reduce((map, q) => {
      map[q.id] = {
        show:    q.showAnswers,
        loaded:  q._loadedAnswers,
        answers: q.answers
      };
      return map;
    }, {});

    // Перезагружаем конфиг/данные
    await Promise.all([
      this._loadConfig(),
      this._loadReviews(),
      this._loadQuestions()
    ]);

    // Восстанавливаем флаги и содержимое для отзывов
    this.reviews = this.reviews.map(r => {
      const saved = reviewsState[r.id] || {};
      return {
        ...r,
        showReplies:     saved.show    || false,
        _loadedComments: false,
        replies:         []
      };
    });

    // И сразу подгружаем комментарии для открытых секций отзывов
    this.reviews
      .filter(r => r.showReplies)
      .forEach(r => this._onCommentToggle({ detail: { reviewId: r.id } }));

    // Восстанавливаем флаги и содержимое для вопросов
    this.questions = this.questions.map(q => {
      const saved = questionsState[q.id] || {};
      return {
        ...q,
        showAnswers:     saved.show    || false,
        _loadedAnswers:  false,
        answers:         []
      };
    });

    // И сразу подгружаем ответы для открытых секций вопросов
    this.questions
      .filter(q => q.showAnswers)
      .forEach(q => this._onAnswerToggle({ detail: { questionId: q.id } }));
  };

  async _loadConfig() {
    try {
      const { data: cfg } = await api.get(
        `/api/widgets/${this.widgetId}/config`
      );
      // подставляем и настройки, и юзера
      this.config = cfg.config;
      this.allowAnonymous = Boolean(cfg.config.allowAnonymous);
      this.currentUser = {
        isAuthenticated: cfg.isAuthenticated,
        avatar: toAbs(cfg.user?.avatar_url),
        ...cfg.user,
        fullname : displayName(cfg.user),
      };
      this.configError = false;
    } catch (err) {
      console.error('config fetch error', err);
      this.configError = true;
    }

  }

  _viewMedia = ({ detail }) => {
    let { media, index, id } = detail;
  
    // если media нет, значит событие пришло из ReviewItem и нужно найти массив
    if (!media) {
      const pool = this.currentTab === 'reviews' ? this.reviews : this.questions;
      media = pool.find(x => x.id === id)?.media || [];
    }
  
    if (!media.length) return;
  
    const modal = this.shadowRoot.getElementById('media-view-modal');
    if (!modal) return;
    if (Array.isArray(media) && media.length) {
      modal.setMedia(media, index);
      modal.openModal();
    }
  };  

  async _toggleSection({ id, listKey, loadedFlagKey, showFlagKey, loadFn}) {
    const items = [...this[listKey]];
    const idx = items.findIndex(x => x.id === id);
    if (idx < 0) return;

    const item = items[idx];
    const needsLoad = !item[loadedFlagKey] && item[ (listKey==='reviews'? 'replies' : 'answers') ].length === 0;

    let newItem = { ...item };

    if (needsLoad) {
      try {
        const loaded = await loadFn(id);
        newItem = {
          ...newItem,
          [loadedFlagKey]: true,
          [ listKey==='reviews'? 'replies' : 'answers' ]: loaded,
          [showFlagKey]: true   // сразу открываем после загрузки
        };
      } catch (e) {
        console.error('Ошибка загрузки', e);
        return;
      }
    } else {
      // просто переключаем видимость
      newItem = {
        ...newItem,
        [showFlagKey]: !newItem[showFlagKey]
      };
    }

    items[idx] = newItem;
    this[listKey] = items;
  }


}

customElements.define('reviews-widget', ReviewsWidget);