import { LitElement, html } from 'lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import sprite from './sprite.svg?raw';
import { sheet, tw } from './twind-setup.js';

export class ReviewsWidget extends LitElement {
    firstUpdated() {
        const tpl = document.createElement('template');
        tpl.innerHTML = sprite;
        this.renderRoot.prepend(tpl.content.cloneNode(true));
        this.shadowRoot.adoptedStyleSheets = [ sheet.target ]
        const root = this.shadowRoot.getElementById('reviews-widget');
        this.initReviewsWidget(root);
    }

    // Открыть/закрыть модалку
    openModal(modal) { modal.dataset.state = 'open'; }
    closeModal(modal) { modal.dataset.state = 'closed'; }

    // Загрузчик файлов для review-upload и question-upload
    setupUploader(inputId, previewId) {
        const input = this.shadowRoot.getElementById(inputId);
        const preview = this.shadowRoot.getElementById(previewId);
        const label = this.shadowRoot.querySelector(`label[for="${inputId}"]`);

        const handleFiles = files => {
            preview.innerHTML = '';
            Array.from(files).forEach(file => {
                const url = URL.createObjectURL(file);
                const wrapper = document.createElement('div');
                wrapper.className = 'relative group';
                let media;
                if (file.type.startsWith('image/')) {
                    media = document.createElement('img');
                    media.className = 'w-16 h-16 object-cover rounded';
                } else if (file.type === 'video/mp4') {
                    media = document.createElement('video');
                    media.controls = true;
                    media.className = 'w-32 h-20 rounded';
                } else return;
                media.src = url;
                const rm = document.createElement('button');
                rm.innerHTML = '&times;';
                rm.className = 'absolute -top-2 -right-2 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center';
                rm.onclick = () => wrapper.remove();
                wrapper.append(media, rm);
                preview.append(wrapper);
            });
        };

        label.addEventListener('dragover', e => { e.preventDefault(); label.classList.add('border-sky-600'); });
        label.addEventListener('dragleave', () => label.classList.remove('border-sky-600'));
        label.addEventListener('drop', e => { e.preventDefault(); label.classList.remove('border-sky-600'); handleFiles(e.dataTransfer.files); });
        input.addEventListener('change', () => handleFiles(input.files));
    }

    // Звёздный рейтинг в модалке
    initStarRating(selector) {
        const container = this.shadowRoot.querySelector(selector);
        if (!container) return;
        const stars = Array.from(container.querySelectorAll('svg[data-value]'));
        const hidden = this.shadowRoot.getElementById('modal-rating');
        let selected = 0;
        const highlight = value => stars.forEach((s, i) => {
            s.classList.toggle(tw`text-yellow-400`, i < value);
            s.classList.toggle(tw`text-gray-300`, i >= value);
        });
        stars.forEach(s => {
            const val = +s.dataset.value;
            s.addEventListener('mouseover', () => highlight(val));
            s.addEventListener('mouseout',  () => highlight(selected));
            s.addEventListener('click',    () => { selected = val; highlight(val); if (hidden) hidden.value = val; });
        });
        highlight(0);
    }

    // Инициализация всего виджета
    initReviewsWidget(root) {
        const reviewsContent = root.querySelector('#reviews-content');
        const qaContent      = root.querySelector('#qa-content');
        const reviewsStats   = root.querySelector('#reviews-stats');
        const qaStats        = root.querySelector('#qa-stats');
        const toggleBtn      = root.querySelector('[data-action="toggle-add-review"]');
        const reviewModal    = this.shadowRoot.getElementById('add-review-modal');
        const questionModal  = this.shadowRoot.getElementById('add-question-modal');
        const tabButtons     = Array.from(root.querySelectorAll('[data-role="tab-button"]'));
        const mediaItems     = Array.from(root.querySelectorAll('[data-role="media-item"]'));
        const mediaModal     = this.shadowRoot.getElementById('media-view-modal');
        const currentMedia   = mediaModal.querySelector('#current-media');
        const mediaCounter   = mediaModal.querySelector('#media-counter');
        const mediaPrev      = mediaModal.querySelector('[data-action="media-prev"]');
        const mediaNext      = mediaModal.querySelector('[data-action="media-next"]');
        const reportModal    = this.shadowRoot.getElementById('report-modal');
        let currentMediaIndex = 0;
        let currentTab = 'reviews';

        // Переключение табов
        const switchTab = target => {
            currentTab = target;
            tabButtons.forEach(btn => {
                const active = btn.dataset.target === target;
                btn.classList.toggle(tw`text-sky-600`, active);
                btn.classList.toggle(tw`border-b-2`, active);
                btn.classList.toggle(tw`border-sky-600`, active);
                btn.classList.toggle(tw`text-gray-500`, !active);
            });
            reviewsContent.classList.toggle('hidden', target !== 'reviews');
            qaContent.classList.toggle('hidden',      target !== 'qa');
            reviewsStats.classList.toggle('hidden',   target !== 'reviews');
            qaStats.classList.toggle('hidden',        target !== 'qa');
        };
        tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.target)));

        // Открыть модалку отзыва или вопроса
        toggleBtn.addEventListener('click', () => {
            if (currentTab === 'reviews') this.openModal(reviewModal);
            else                       this.openModal(questionModal);
        });

        // Закрыть все модалки
        this.shadowRoot.querySelectorAll('[data-action="close-modal"]').forEach(btn =>
            btn.addEventListener('click', () => this.closeModal(btn.closest('[data-role="modal"]'))));

        // Надпись на кнопках «Комментировать» / «Ответить»
        root.querySelectorAll('[data-action="toggle-reply"]').forEach(btn => {
            const article   = btn.closest('article');
            const isQA      = !!btn.closest('#qa-content');
            const selector  = isQA ? '.answers-widget__reply-item' : '.reviews-widget__reply-item';
            const count     = article.querySelectorAll(selector).length;
            const label     = btn.querySelector('span');
            label.textContent = isQA
                ? (count > 0 ? `Ответы (${count})` : 'Ответить')
                : (count > 0 ? `Комментарии (${count})` : 'Комментировать');
            btn.addEventListener('click', () => {
                article.querySelector('.reply-section').classList.toggle('hidden');
            });
        });
        // Кнопка отмены прячет секцию
        root.querySelectorAll('[data-action="cancel-reply"]').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('article').querySelector('.reply-section').classList.add('hidden');
            });
        });
        // Report
        root.querySelectorAll('[data-action="toggle-report"]').forEach(btn =>
            btn.addEventListener('click', () => this.openModal(reportModal)));

        // Медиа-галерея
        const updateMediaModal = idx => {
            const item = mediaItems[idx];
            currentMedia.src = item.querySelector('img').src;
            currentMedia.style.opacity = '1';
            mediaCounter.textContent  = `${idx + 1} / ${mediaItems.length}`;
            currentMediaIndex = idx;
            mediaPrev.style.display = idx === 0 ? 'none' : 'block';
            mediaNext.style.display = idx === mediaItems.length - 1 ? 'none' : 'block';
        };
        mediaItems.forEach(item => item.addEventListener('click', () => {
            updateMediaModal(+item.dataset.index);
            this.openModal(mediaModal);
        }));
        mediaPrev.addEventListener('click', () => {
            if (currentMediaIndex > 0) updateMediaModal(currentMediaIndex - 1);
        });
        mediaNext.addEventListener('click', () => {
            if (currentMediaIndex < mediaItems.length - 1) updateMediaModal(currentMediaIndex + 1);
        });

        // Фильтры
        const filterButtons = Array.from(root.querySelectorAll('[data-action="filter"]'));
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => {
                    b.classList.remove(tw`border-sky-200 bg-sky-50 text-sky-700 font-medium`);
                    b.classList.add(tw`border-gray-200 bg-gray-50 text-gray-700`);
                });
                btn.classList.remove(tw`border-gray-200 bg-gray-50 text-gray-700`);
                btn.classList.add(tw`border-sky-200 bg-sky-50 text-sky-700 font-medium`);
            });
        });

        // Показать ещё
        root.querySelectorAll('[data-action="show-more"]').forEach(btn =>
            btn.addEventListener('click', () => console.log('Загрузка дополнительных элементов')));

        // Отправка жалобы
        this.shadowRoot.getElementById('report-submit')
            .addEventListener('click', () => {
                console.log('Отправка жалобы');
                this.closeModal(reportModal);
            });

        // Лайки/дизлайки
        root.querySelectorAll('[data-action="like"],[data-action="dislike"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const isLike = btn.dataset.action === 'like';
                const other  = btn.closest('article').querySelector(isLike ? '[data-action="dislike"]' : '[data-action="like"]');
                const span   = btn.querySelector('span');
                let   cnt    = +span.textContent || 0;
                const activeClass = isLike ? tw`text-sky-600` : tw`text-red-600`;
                const wasActive   = btn.classList.toggle(activeClass);
                cnt += wasActive ? 1 : -1;
                span.textContent = cnt;
                if (other) {
                    const os = other.querySelector('span');
                    let ocnt = +os.textContent || 0;
                    const oClass = isLike ? tw`text-red-600` : tw`text-sky-600`;
                    if (other.classList.contains(oClass)) {
                        other.classList.remove(oClass);
                        os.textContent = ocnt - 1;
                    }
                }
            });
        });

        // Инициализировать загрузчики и рейтинг
        this.setupUploader('review-upload', 'review-preview');
        this.setupUploader('question-upload', 'question-preview');
        this.initStarRating('.star-rating');
    }

    render() {
        return html`
        <style>
            /* Встроенные кастомные стили */
            #reviews-widget, #add-review-modal, #add-question-modal, #media-view-modal, #report-modal {
                font-family: 'Montserrat', sans-serif;
            }

            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            .modal {
                opacity: 0;
                visibility: hidden;
                transition: opacity .3s, visibility .3s;
            }

            .modal[data-state="open"] {
                opacity: 1;
                visibility: visible;
            }

            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            .media-gallery-scrollbar::-webkit-scrollbar {
                height: 4px;
            }
        </style>

        <div id="reviews-widget" class="${tw`mx-auto p-4 max-w-7xl `}">
            <div class="${tw`bg-white rounded-2xl shadow-lg overflow-hidden`}">
                <div class="${tw`border-b border-gray-200`}" data-role="tabs">
                    <div class="${tw`flex justify-between items-center px-6 py-4`}">
                        <div class="${tw`flex space-x-4`}">
                            <button data-role="tab-button" data-target="reviews" class="${tw`focus:outline-none px-4 py-2 text-sm font-medium text-sky-600 border-b-2 border-sky-600`}">
                                Отзывы
                            </button>
                            <button data-role="tab-button" data-target="qa" class="${tw`focus:outline-none px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700`}">
                                Вопрос-ответ
                            </button>
                        </div>
                        <div class="${tw`flex items-center justify-between px-4 py-2 rounded-xl`}">
                            <button type="button" class="${tw`flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-xl transition-colors focus:outline-none`}">
                                <div class="${tw`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}">
                                    <svg class="${tw`text-gray-500 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#ri-user-line" />
                                    </svg>
                                </div>
                                <div class="${tw`text-left`}">
                                    <div class="${tw`text-sm font-medium text-gray-900`}">Иван Петров</div>
                                    <div class="${tw`text-sm text-gray-500`}">ivan@example.com</div>
                                </div>
                            </button>
                            <button type="button" title="Выйти" class="${tw`ml-2 px-3 py-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors focus:outline-none`}">
                                <svg class="${tw`text-lg`}" fill="currentColor" width="1em" height="1em">
                                    <use xlink:href="#ri-logout-box-r-line" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <button data-action="login" class="${tw`px-6 py-4 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-600 hover:bg-opacity-90 focus:outline-none`}">
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
                <div class="${tw`flex flex-col md:flex-row`}">
                    <aside class="${tw`w-full md:w-1/4 border-r border-gray-200 p-6`}">
                        <div id="reviews-stats" class="${tw`mb-8`}">
                            <div class="${tw`text-center mb-2`}">
                                <div class="${tw`text-5xl font-bold`}">4.7</div>
                                <div class="${tw`flex justify-center mb-1 space-x-1`}">
                                    <svg class="${tw`text-yellow-400 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <svg class="${tw`text-yellow-400 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <svg class="${tw`text-yellow-400 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <svg class="${tw`text-yellow-400 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <svg class="${tw`text-yellow-400 text-xl`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star-half" />
                                    </svg>
                                </div>
                                <div class="${tw`text-sm text-gray-500`}">На основе 234 отзывов</div>
                            </div>
                            <div class="${tw`space-y-2 mb-6`}">
                                <!-- рейтинг по звездам -->
                                <div class="${tw`flex items-center`}">
                                    <span class="${tw`w-4 mr-2`}">5</span>
                                    <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:68%"></div>
                                    </div>
                                    <span class="${tw`ml-2 text-sm text-gray-500`}">68%</span>
                                </div>
                                <div class="${tw`flex items-center`}">
                                    <span class="${tw`w-4 mr-2`}">4</span>
                                    <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:22%"></div>
                                    </div>
                                    <span class="${tw`ml-2 text-sm text-gray-500`}">22%</span>
                                </div>
                                <div class="${tw`flex items-center`}">
                                    <span class="${tw`w-4 mr-2`}">3</span>
                                    <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:7%"></div>
                                    </div>
                                    <span class="${tw`ml-2 text-sm text-gray-500`}">7%</span>
                                </div>
                                <div class="${tw`flex items-center`}">
                                    <span class="${tw`w-4 mr-2`}">2</span>
                                    <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:2%"></div>
                                    </div>
                                    <span class="${tw`ml-2 text-sm text-gray-500`}">2%</span>
                                </div>
                                <div class="${tw`flex items-center`}">
                                    <span class="${tw`w-4 mr-2`}">1</span>
                                    <svg class="${tw`text-yellow-400 mr-2`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bxs-star" />
                                    </svg>
                                    <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-yellow-400 rounded-full`}" style="width:1%"></div>
                                    </div>
                                    <span class="${tw`ml-2 text-sm text-gray-500`}">1%</span>
                                </div>
                            </div>
                            <div class="${tw`grid grid-cols-3 gap-2 mb-6 text-center`}">
                                <div class="${tw`flex flex-col items-center bg-green-50 rounded-2xl p-3`}">
                                    <div class="${tw`text-green-600 text-lg font-medium`}">82%</div>
                                    <svg class="${tw`text-green-500 text-xl mt-1`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bx-happy" />
                                    </svg>
                                </div>
                                <div class="${tw`flex flex-col items-center bg-gray-50 rounded-2xl p-3`}">
                                    <div class="${tw`text-gray-600 text-lg font-medium`}">12%</div>
                                    <svg class="${tw`text-gray-500 text-xl mt-1`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bx-meh" />
                                    </svg>
                                </div>
                                <div class="${tw`flex flex-col items-center bg-red-50 rounded-2xl p-3`}">
                                    <div class="${tw`text-red-600 text-lg font-medium`}">6%</div>
                                    <svg class="${tw`text-red-500 text-xl mt-1`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#bx-sad" />
                                    </svg>
                                </div>
                            </div>
                            <!-- эмоциональные метрики -->
                            <div class="${tw`space-y-3`}">
                                <div class="${tw`flex flex-col bg-amber-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-amber-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-happy-alt" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Радость <span class="${tw`ml-2 text-xs text-gray-500`}">12% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-amber-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-amber-500`}" style="width:12%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-indigo-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-indigo-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-search-alt" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Интерес <span class="${tw`ml-2 text-xs text-gray-500`}">11% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-indigo-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-indigo-500`}" style="width:11%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-amber-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-amber-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-shocked" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Удивление <span class="${tw`ml-2 text-xs text-gray-500`}">13% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-amber-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-amber-500`}" style="width:13%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-blue-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-blue-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-sad" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Грусть <span class="${tw`ml-2 text-xs text-gray-500`}">9% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-blue-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-blue-500`}" style="width:9%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-red-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-red-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-angry" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Злость <span class="${tw`ml-2 text-xs text-gray-500`}">10% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-red-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-red-500`}" style="width:10%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-lime-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-lime-600 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-bug" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Отвращение <span class="${tw`ml-2 text-xs text-gray-500`}">4% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-lime-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-lime-600`}" style="width:4%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-blue-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-blue-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-alarm-exclamation" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Страх <span class="${tw`ml-2 text-xs text-gray-500`}">6% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-blue-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-blue-500`}" style="width:6%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-indigo-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-indigo-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-tired" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Вина <span class="${tw`ml-2 text-xs text-gray-500`}">4% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-indigo-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-indigo-500`}" style="width:4%"></div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-col bg-gray-50 rounded-2xl p-3`}">
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-gray-500 mr-3`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-emotion-normal-line" />
                                        </svg>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`text-sm font-medium`}">
                                                Нейтральность <span class="${tw`ml-2 text-xs text-gray-500`}">10% отзывов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="${tw`mt-2 h-1 bg-gray-200 rounded-full overflow-hidden`}">
                                        <div class="${tw`h-full bg-gray-500`}" style="width:10%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- QA statistics -->
                        <div id="qa-stats" class="${tw`mb-8 hidden`}">
                            <div class="${tw`text-center mb-2`}">
                                <div class="${tw`text-5xl font-bold`}">156</div>
                                <div class="${tw`text-sm text-gray-500`}">Всего вопросов</div>
                            </div>
                            <div class="${tw`space-y-6 mb-6 text-sm`}">
                                <div>
                                    <div class="${tw`text-black font-medium mb-1`}">С ответом</div>
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-green-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-check-circle" />
                                        </svg>
                                        <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                            <div class="${tw`h-full bg-green-500 rounded-full`}" style="width:75%"></div>
                                        </div>
                                        <span class="${tw`ml-2 text-gray-500`}">117</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="${tw`text-black font-medium mb-1`}">Без ответа</div>
                                    <div class="${tw`flex items-center`}">
                                        <svg class="${tw`text-red-500 mr-2 text-base`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#bx-x-circle" />
                                        </svg>
                                        <div class="${tw`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}">
                                            <div class="${tw`h-full bg-red-500 rounded-full`}" style="width:25%"></div>
                                        </div>
                                        <span class="${tw`ml-2 text-gray-500`}">39</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button data-action="toggle-add-review" data-target="add-review-modal" class="${tw`focus:outline-none w-full bg-sky-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-sky-600 hover:bg-opacity-90 transition-colors`}">
                            Оставить отзыв
                        </button>
                    </aside>

                    <!-- Секция отзывов и вопросов -->
                    <section class="${tw`w-full md:w-3/4 p-6`}">
                        <div id="reviews-content">
                            <!-- Медиа-галерея -->
                            <div class="${tw`mb-6`}" data-role="media-gallery">
                                <div class="${tw`relative`}">
                                    <div class="${tw`flex space-x-3 overflow-x-auto pb-2`} media-gallery-scrollbar custom-scrollbar">
                                        <div data-role="media-item" data-index="0" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=happy%20customer%20with%20a%20product%2C%20professional%20photo%2C%20high%20quality%2C%20clean%20background%2C%20product%20review&amp;width=200&amp;height=200&amp;seq=1&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div data-role="media-item" data-index="1" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=product%20in%20use%2C%20close-up%20detail%2C%20professional%20lighting%2C%20customer%20review%20photo&amp;width=200&amp;height=200&amp;seq=2&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div data-role="media-item" data-index="2" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=person%20using%20electronic%20device%2C%20modern%20lifestyle%2C%20product%20review%2C%20clean%20background&amp;width=200&amp;height=200&amp;seq=3&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div data-role="media-item" data-index="3" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=product%20detail%20shot%2C%20professional%20photography%2C%20customer%20review%20image%2C%20clean%20background&amp;width=200&amp;height=200&amp;seq=4&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div data-role="media-item" data-index="4" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=person%20holding%20product%2C%20lifestyle%20photo%2C%20customer%20review%2C%20clean%20background&amp;width=200&amp;height=200&amp;seq=5&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div data-role="media-item" data-index="5" class="${tw`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer`}">
                                            <img src="https://readdy.ai/api/search-image?query=product%20in%20use%20at%20home%2C%20lifestyle%20photo%2C%20customer%20review%20image%2C%20clean%20background&amp;width=200&amp;height=200&amp;seq=6&amp;orientation=squarish" alt="Фото" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Фильтры -->
                            <div class="${tw`mb-6`}" data-role="filters">
                                <div class="${tw`flex items-center space-x-3 mb-4`}">
                                    <div class="${tw`relative flex-1`}">
                                        <input type="text" placeholder="Поиск в отзывах" class="${tw`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600`}" />
                                        <div class="${tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}">
                                            <svg class="${tw`text-gray-500`}" fill="currentColor" width="1em" height="1em">
                                                <use xlink:href="#ri-search-line" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="${tw`relative`}">
                                        <select class="${tw`appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-600`}">
                                            <option>По дате</option>
                                            <option>По популярности</option>
                                        </select>
                                        <div class="${tw`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none`}">
                                            <svg class="${tw`text-gray-500`}" fill="currentColor" width="1em" height="1em">
                                                <use xlink:href="#ri-arrow-down-s-line" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-wrap items-center gap-2`}">
                                    <button data-action="filter" data-filter="all" class="${tw`focus:outline-none border border-sky-200 px-3 py-2 bg-sky-50 rounded-xl hover:bg-sky-100`}">
                                        Все
                                    </button>
                                    <button data-action="filter" data-filter="5" class="${tw`focus:outline-none flex items-center border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        5 <svg class="${tw`ml-1 text-yellow-400 inline`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-star-fill" />
                                        </svg>
                                    </button>
                                    <button data-action="filter" data-filter="4" class="${tw`focus:outline-none flex items-center border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        4 <svg class="${tw`ml-1 text-yellow-400 inline`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-star-fill" />
                                        </svg>
                                    </button>
                                    <button data-action="filter" data-filter="3" class="${tw`focus:outline-none flex items-center border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        3 <svg class="${tw`ml-1 text-yellow-400 inline`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-star-fill" />
                                        </svg>
                                    </button>
                                    <button data-action="filter" data-filter="2" class="${tw`focus:outline-none flex items-center border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        2 <svg class="${tw`ml-1 text-yellow-400 inline`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-star-fill" />
                                        </svg>
                                    </button>
                                    <button data-action="filter" data-filter="1" class="${tw`focus:outline-none flex items-center border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        1 <svg class="${tw`ml-1 text-yellow-400 inline`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-star-fill" />
                                        </svg>
                                    </button>
                                    <button data-action="filter" data-filter="positive" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        Положительные
                                    </button>
                                    <button data-action="filter" data-filter="neutral" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        Нейтральные
                                    </button>
                                    <button data-action="filter" data-filter="negative" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        Отрицательные
                                    </button>
                                </div>
                            </div>

                            <!-- Отзывы -->
                            <div class="${tw`space-y-6`}">
                                <article class="${tw`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl`}">

                                    <!-- Самый полезный отзыв -->
                                    <div class="${tw`mb-2 flex items-center justify-center`}">
                                        <svg class="${tw`text-blue-500 mr-2`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-thumb-up-fill" />
                                        </svg>
                                        <span class="${tw`text-sm font-medium text-blue-700`}">Самый полезный отзыв</span>
                                    </div>

                                    <!-- Отзыв -->
                                    <div class="${tw`flex items-start`}">

                                        <!-- Аватар пользователя-->
                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}">
                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20aged%20man%2C%20business%20casual%2C%20clean%20background&amp;width=100&amp;height=100&amp;seq=15&amp;orientation=squarish" alt="Аватар" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`flex justify-between items-start`}">
                                                <div>
                                                    <div class="${tw`font-medium`}">Александр Волков</div>
                                                    <div class="${tw`text-sm text-gray-500`}">2 мая 2025</div>
                                                    <div class="${tw`flex items-center mt-1 space-x-2`}">
                                                        <span class="${tw`px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full`}">
                                                            Положительный
                                                        </span>
                                                        <span class="${tw`px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full`}">
                                                            Восторг
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="${tw`flex space-x-0.5`}">
                                                    <svg class="${tw`text-yellow-400`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-star-fill" />
                                                    </svg>
                                                    <svg class="${tw`text-yellow-400`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-star-fill" />
                                                    </svg>
                                                    <svg class="${tw`text-yellow-400`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-star-fill" />
                                                    </svg>
                                                    <svg class="${tw`text-yellow-400`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-star-fill" />
                                                    </svg>
                                                    <svg class="${tw`text-yellow-400`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-star-fill" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="${tw`mt-2`}">
                                                <p>
                                                    Превосходный продукт! Использую уже месяц и могу с уверенностью сказать, что это лучшая покупка в этом году. Качество материалов на высоте, сборка идеальная, функционал полностью соответствует описанию. Особенно впечатлила система энергосбережения и удобный интерфейс. Рекомендую всем, кто ищет надежное и современное решение.
                                                </p>
                                            </div>
                                            <div class="${tw`mt-3 flex space-x-2`}">
                                                <img src="https://readdy.ai/api/search-image?query=product%20lifestyle%20shot%2C%20professional%20lighting%2C%20clean%20modern%20background%2C%20high%20quality&amp;width=100&amp;height=100&amp;seq=16&amp;orientation=squarish" alt="Фото" class="${tw`w-16 h-16 rounded object-cover cursor-pointer`}">
                                                <img src="https://readdy.ai/api/search-image?query=product%20detail%20macro%20shot%2C%20professional%20lighting%2C%20clean%20background%2C%20high%20quality&amp;width=100&amp;height=100&amp;seq=17&amp;orientation=squarish" alt="Фото" class="${tw`w-16 h-16 rounded object-cover cursor-pointer`}">
                                            </div>
                                            <div class="${tw`mt-3 flex items-center justify-between`}">
                                                <div class="${tw`flex space-x-4`}">
                                                    <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-sky-600 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-thumb-up-line" />
                                                        </svg><span>47</span>
                                                    </button>
                                                    <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-red-600 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-thumb-down-line" />
                                                        </svg><span>2</span>
                                                    </button>
                                                    <button data-action="toggle-reply" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-chat-1-line" />
                                                        </svg><span>Комментировать</span>
                                                    </button>
                                                </div>
                                                <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                    <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-flag-line" />
                                                    </svg><span>Пожаловаться</span>
                                                </button>
                                            </div>
                                            <div class="reply-section ${tw` hidden mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg overflow-hidden`}">
                                                <div class="reply-form ${tw`p-4`}">
                                                    <div class="${tw`flex space-x-3`}">
                                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}">
                                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait&amp;width=100&amp;height=100" alt="Ваш аватар" class="${tw`w-full h-full object-cover`}">
                                                        </div>
                                                        <div class="${tw`flex-1`}">
                                                            <textarea rows="3" class="${tw`w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent`}" placeholder="Напишите ваш ответ…"></textarea>
                                                            <div class="${tw`mt-2 flex justify-end space-x-2`}">
                                                                <button data-action="cancel-reply" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap`}">
                                                                    Отмена
                                                                </button>
                                                                <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90 whitespace-nowrap`}">
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="reviews-widget__replies"></div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                                <article class="${tw`p-4 border-b border-gray-100`}">
                                    <div class="${tw`flex items-start`}">
                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}">
                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20woman%2C%20neutral%20expression%2C%20clean%20background&width=100&height=100&seq=7&orientation=squarish" alt="Аватар" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`flex justify-between items-start`}">
                                                <div>
                                                    <div class="${tw`font-medium`}">Анна Смирнова</div>
                                                    <div class="${tw`text-sm text-gray-500`}">5 мая 2025</div>
                                                    <div class="${tw`flex items-center mt-1`}">
                                                        <span class="${tw`px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full mr-2`}">Положительный</span>
                                                        <span class="${tw`px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full`}">Восторг</span>
                                                    </div>
                                                </div>
                                                <div class="${tw`flex space-x-0.5 text-yellow-400`}">
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                </div>
                                            </div>

                                            <div class="${tw`mt-2`}">
                                                <p>Отличный товар! Доставка была быстрой, упаковка надежной. Качество превзошло все мои ожидания. Буду рекомендовать друзьям и знакомым. Спасибо за прекрасный сервис!</p>
                                            </div>

                                            <div class="${tw`mt-3 flex space-x-2`}">
                                                <img src="https://readdy.ai/api/search-image?query=product%20in%20use%2C%20lifestyle%20photo%2C%20customer%20review%20image%2C%20clean%20background&width=100&height=100&seq=8&orientation=squarish" alt="Фото" class="${tw`w-16 h-16 rounded object-cover cursor-pointer`}">
                                            </div>

                                            <div class="${tw`mt-3 flex items-center justify-between`}">
                                                <div class="${tw`flex space-x-4`}">
                                                    <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-up-line" /></svg>
                                                        <span>12</span>
                                                    </button>
                                                    <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-down-line" /></svg>
                                                        <span>2</span>
                                                    </button>
                                                    <button data-action="toggle-reply" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-chat-1-line" /></svg>
                                                        <span>Комментировать</span>
                                                    </button>
                                                </div>
                                                <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                    <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-flag-line" /></svg>
                                                    <span>Пожаловаться</span>
                                                </button>
                                            </div>

                                            <div class="reply-section ${tw` hidden mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg overflow-hidden`}">
                                                <div class="reply-form ${tw`p-4`}">
                                                    <div class="${tw`flex space-x-3`}">
                                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}">
                                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait&width=100&height=100" alt="Ваш аватар" class="${tw`w-full h-full object-cover`}">
                                                        </div>
                                                        <div class="${tw`flex-1`}">
                                                            <textarea class="${tw`w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent`}" rows="3" placeholder="Напишите ваш ответ…"></textarea>
                                                            <div class="${tw`mt-2 flex justify-end space-x-2`}">
                                                                <button data-action="cancel-reply" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap`}">
                                                                    Отмена
                                                                </button>
                                                                <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90 whitespace-nowrap`}">
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="reviews-widget__replies">
                                                    <div class="${tw`p-4`} reviews-widget__reply-item">
                                                        <div class="${tw`flex items-start space-x-3`}">
                                                            <div class="${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}">
                                                                <img src="https://readdy.ai/api/search-image?query=company%20logo%2C%20professional%2C%20minimalist%20design" alt="Логотип компании" class="${tw`w-full h-full object-cover`}" loading="lazy">
                                                            </div>
                                                            <div class="${tw`flex-1`}">
                                                                <div class="${tw`flex items-center space-x-2`}">
                                                                    <span class="${tw`font-medium text-sm`}">Ответ от компании</span>
                                                                    <span class="${tw`text-xs text-gray-500`}">6 мая 2025</span>
                                                                </div>
                                                                <p class="${tw`text-sm mt-1`}">
                                                                    Анна, благодарим за ваш отзыв! Мы очень рады, что вы остались довольны качеством товара и сервисом. Будем и дальше поддерживать высокий уровень обслуживания. Спасибо за рекомендации!
                                                                </p>
                                                                <div class="${tw`mt-2 flex justify-between items-center`}">
                                                                    <div class="${tw`flex space-x-4 items-center`}">
                                                                        <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-up-line" /></svg>
                                                                            <span>5</span>
                                                                        </button>
                                                                        <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-down-line" /></svg>
                                                                            <span>0</span>
                                                                        </button>
                                                                    </div>
                                                                    <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                            <use xlink:href="#ri-flag-line" /></svg>
                                                                        <span>Пожаловаться</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr class="${tw`border-t border-gray-200 mx-4`}">
                                                    <div class="${tw`p-4`} reviews-widget__reply-item">
                                                        <div class="${tw`flex items-start space-x-3`}">
                                                            <div class="${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}">
                                                                <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20man%2C%20casual%20style" alt="Аватар Михаила Соколова" class="${tw`w-full h-full object-cover`}" loading="lazy">
                                                            </div>
                                                            <div class="${tw`flex-1`}">
                                                                <div class="${tw`flex items-center space-x-2`}">
                                                                    <span class="${tw`font-medium text-sm`}">Михаил Соколов</span>
                                                                    <span class="${tw`text-xs text-gray-500`}">6 мая 2025</span>
                                                                </div>
                                                                <p class="${tw`text-sm mt-1`}">
                                                                    Полностью согласен с отзывом! Тоже заказывал здесь, качество действительно отличное. Отдельное спасибо за оперативную доставку.
                                                                </p>
                                                                <div class="${tw`mt-2 flex justify-between items-center`}">
                                                                    <div class="${tw`flex space-x-4 items-center`}">
                                                                        <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-up-line" /></svg>
                                                                            <span>3</span>
                                                                        </button>
                                                                        <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-down-line" /></svg>
                                                                            <span>0</span>
                                                                        </button>
                                                                    </div>
                                                                    <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                            <use xlink:href="#ri-flag-line" /></svg>
                                                                        <span>Пожаловаться</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr class="${tw`border-t border-gray-200 mx-4`}">
                                                    <div class="${tw`p-4`} reviews-widget__reply-item">
                                                        <div class="${tw`flex items-start space-x-3`}">
                                                            <div class="${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}">
                                                                <img src="https://readdy.ai/api/search-image?query=support%20avatar%20icon%2C%20minimal%20flat%20design" alt="Аватар менеджера" class="${tw`w-full h-full object-cover`}" loading="lazy">
                                                            </div>
                                                            <div class="${tw`flex-1`}">
                                                                <div class="${tw`flex items-center space-x-2`}">
                                                                    <span class="${tw`font-medium text-sm`}">Менеджер поддержки</span>
                                                                    <span class="${tw`text-xs text-gray-500`}">7 мая 2025</span>
                                                                </div>
                                                                <p class="${tw`text-sm mt-1`}">
                                                                    Спасибо за обратную связь! Если возникнут дополнительные вопросы, пожалуйста, свяжитесь с нашей службой поддержки — будем рады помочь.
                                                                </p>
                                                                <div class="${tw`mt-2 flex justify-between items-center`}">
                                                                    <div class="${tw`flex space-x-4 items-center`}">
                                                                        <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-up-line" /></svg>
                                                                            <span>1</span>
                                                                        </button>
                                                                        <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-down-line" /></svg>
                                                                            <span>0</span>
                                                                        </button>
                                                                    </div>
                                                                    <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                            <use xlink:href="#ri-flag-line" /></svg>
                                                                        <span>Пожаловаться</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                <article class="${tw`p-4 border-b border-gray-100`}">
                                    <div class="${tw`flex items-start`}">
                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}">
                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20man%2C%20neutral%20expression%2C%20clean%20background&width=100&height=100&seq=9&orientation=squarish" alt="Аватар" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`flex justify-between items-start`}">
                                                <div>
                                                    <div class="${tw`font-medium`}">Дмитрий Иванов</div>
                                                    <div class="${tw`text-sm text-gray-500`}">3 мая 2025</div>
                                                    <div class="${tw`flex items-center mt-1`}">
                                                        <span class="${tw`px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full mr-2`}">Нейтральный</span>
                                                        <span class="${tw`px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full`}">Сомнение</span>
                                                    </div>
                                                </div>
                                                <div class="${tw`flex space-x-0.5 text-yellow-400`}">
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-fill" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-line" /></svg>
                                                    <svg width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-star-line" /></svg>
                                                </div>
                                            </div>

                                            <div class="${tw`mt-2`}">
                                                <p>В целом неплохой товар, но есть некоторые недостатки. Инструкция могла бы быть более понятной. Функциональность соответствует заявленной, но качество сборки оставляет желать лучшего.</p>
                                            </div>

                                            <div class="${tw`mt-3 flex space-x-2`}">
                                                <img src="https://readdy.ai/api/search-image?query=product%20detail%20%EC%88%AD%2C%20showing%20quality%20issues%2C%20customer%20review%20image&width=100&height=100&seq=10&orientation=squarish" alt="Фото" class="${tw`w-16 h-16 rounded object-cover cursor-pointer`}">
                                                <img src="https://readdy.ai/api/search-image?query=product%20manual%20or%20instructions%2C%20confusing%20layout%2C%20customer%20review%20image&width=100&height=100&seq=11&orientation=squarish" alt="Фото" class="${tw`w-16 h-16 rounded object-cover cursor-pointer`}">
                                            </div>

                                            <div class="${tw`mt-3 flex items-center justify-between`}">
                                                <div class="${tw`flex space-x-4`}">
                                                    <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-up-line" /></svg>
                                                        <span>8</span>
                                                    </button>
                                                    <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-down-line" /></svg>
                                                        <span>1</span>
                                                    </button>
                                                    <button data-action="toggle-reply" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-chat-1-line" /></svg>
                                                        <span>Комментировать</span>
                                                    </button>
                                                </div>
                                                <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                    <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-flag-line" /></svg>
                                                    <span>Пожаловаться</span>
                                                </button>
                                            </div>

                                            <div class="reply-section ${tw` hidden mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg overflow-hidden`}">
                                                <div class="reply-form ${tw`p-4`}">
                                                    <div class="${tw`flex space-x-3`}">
                                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}">
                                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait&width=100&height=100" alt="Ваш аватар" class="${tw`w-full h-full object-cover`}">
                                                        </div>
                                                        <div class="${tw`flex-1`}">
                                                            <textarea class="${tw`w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent`}" rows="3" placeholder="Напишите ваш ответ…"></textarea>
                                                            <div class="${tw`mt-2 flex justify-end space-x-2`}">
                                                                <button data-action="cancel-reply" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap`}">
                                                                    Отмена
                                                                </button>
                                                                <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90 whitespace-nowrap`}">
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="reviews-widget__replies"></div>
                                            </div>

                                        </div>
                                    </div>
                                </article>

                            </div>
                            <div class="${tw`mt-8 flex flex-col items-center`}">
                                <div class="${tw`text-sm text-gray-500 mb-4`}">Показано 3 из 128 отзывов</div>
                                <button data-action="show-more" class="${tw`focus:outline-none flex items-center justify-center px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 w-full`}">
                                    Показать ещё
                                    <svg class="${tw`inline`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#ri-arrow-down-s-line" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div id="qa-content" class="${tw`hidden`}">
                            <!-- Фильтры для вопросов -->
                            <div class="${tw`mb-6`}" data-role="filters">
                                <div class="${tw`flex items-center space-x-3 mb-4`}">
                                    <div class="${tw`relative flex-1`}">
                                        <input type="text" placeholder="Поиск в вопросах" class="${tw`w-full bg-gray-100 py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600`}" />
                                        <div class="${tw`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}">
                                            <svg class="${tw`text-gray-500`}" fill="currentColor" width="1em" height="1em">
                                                <use xlink:href="#ri-search-line" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="${tw`relative`}">
                                        <select class="${tw`appearance-none bg-gray-100 py-2 pl-3 pr-8 rounded-md text-sm`}">
                                            <option>По дате</option>
                                            <option>По популярности</option>
                                        </select>
                                        <div class="${tw`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none`}">
                                            <svg class="${tw`text-gray-500`}" fill="currentColor" width="1em" height="1em">
                                                <use xlink:href="#ri-arrow-down-s-line" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="${tw`flex flex-wrap items-center gap-2`}">
                                    <button data-action="filter" data-filter="all" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        Все
                                    </button>
                                    <button data-action="filter" data-filter="answered" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        С ответом
                                    </button>
                                    <button data-action="filter" data-filter="unanswered" class="${tw`focus:outline-none border border-gray-200 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100`}">
                                        Без ответа
                                    </button>
                                </div>
                            </div>
                            <!-- Вопросы -->
                            <div class="${tw`space-y-6`}">
                                <article class="${tw`p-4 bg-blue-50 bg-opacity-50 border border-blue-100 rounded-2xl`}">
                                    <div class="${tw`mb-2 flex items-center justify-center`}">
                                        <svg class="${tw`text-blue-500 mr-2`}" fill="currentColor" width="1em" height="1em">
                                            <use xlink:href="#ri-thumb-up-fill" />
                                        </svg>
                                        <span class="${tw`text-sm font-medium text-blue-700`}">Популярный вопрос</span>
                                    </div>
                                    <div class="${tw`flex items-start`}">
                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}">
                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20young%20woman%2C%20casual%20style&amp;width=100&amp;height=100&amp;seq=12&amp;orientation=squarish" alt="Аватар" class="${tw`w-full h-full object-cover`}">
                                        </div>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`flex justify-between items-start`}">
                                                <div>
                                                    <div class="${tw`font-medium`}">Екатерина Петрова</div>
                                                    <div class="${tw`text-sm text-gray-500`}">4 мая 2025</div>
                                                </div>
                                            </div>
                                            <div class="${tw`mt-2`}">
                                                <p>
                                                    Как долго работает батарея устройства при активном использовании? Хочу понять, подойдет ли оно для длительных поездок.
                                                </p>
                                            </div>
                                            <div class="${tw`mt-3 flex items-center justify-between`}">
                                                <div class="${tw`flex space-x-4`}">
                                                    <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-thumb-up-line" />
                                                        </svg><span>15</span>
                                                    </button>
                                                    <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-thumb-down-line" />
                                                        </svg><span>0</span>
                                                    </button>
                                                    <button data-action="toggle-reply" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                            <use xlink:href="#ri-chat-1-line" />
                                                        </svg><span>Ответить</span>
                                                    </button>
                                                </div>
                                                <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                    <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                        <use xlink:href="#ri-flag-line" />
                                                    </svg><span>Пожаловаться</span>
                                                </button>
                                            </div>
                                            <div class="reply-section ${tw` hidden mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg overflow-hidden`}">
                                                <div class="reply-form ${tw`p-4`}">
                                                    <div class="${tw`flex space-x-3`}">
                                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}">
                                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait&amp;width=100&amp;height=100" alt="Ваш аватар" class="${tw`w-full h-full object-cover`}">
                                                        </div>
                                                        <div class="${tw`flex-1`}">
                                                            <textarea rows="3" class="${tw`w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent`}" placeholder="Напишите ваш ответ…"></textarea>
                                                            <div class="${tw`mt-2 flex justify-end space-x-2`}">
                                                                <button data-action="cancel-reply" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap`}">
                                                                    Отмена
                                                                </button>
                                                                <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90 whitespace-nowrap`}">
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="answers-widget__replies">
                                                    <div class="${tw`p-4`} answers-widget__reply-item">
                                                        <div class="${tw`flex items-start space-x-3`}">
                                                            <div class="${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}">
                                                                <img src="https://readdy.ai/api/search-image?query=company%20logo%2C%20professional%2C%20minimalist%20design" alt="Логотип компании" class="${tw`w-full h-full object-cover`}" loading="lazy">
                                                            </div>
                                                            <div class="${tw`flex-1`}">
                                                                <div class="${tw`flex items-center space-x-2`}">
                                                                    <span class="${tw`font-medium text-sm`}">Ответ от компании</span>
                                                                    <span class="${tw`text-xs text-gray-500`}">5 мая 2025</span>
                                                                </div>
                                                                <p class="${tw`text-sm mt-1`}">
                                                                    Екатерина, спасибо за ваш вопрос! При активном использовании батарея устройства работает до 12 часов. Для длительных поездок рекомендуем взять портативное зарядное устройство, если планируется использование более 12 часов без подзарядки.
                                                                </p>
                                                                <div class="${tw`mt-2 flex justify-between items-center`}">
                                                                    <div class="${tw`flex space-x-4 items-center`}">
                                                                        <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                                                <use xlink:href="#ri-thumb-up-line" />
                                                                            </svg><span>10</span>
                                                                        </button>
                                                                        <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                                                <use xlink:href="#ri-thumb-down-line" />
                                                                            </svg><span>0</span>
                                                                        </button>
                                                                    </div>
                                                                    <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                        <svg class="${tw`mr-1`}" fill="currentColor" width="1em" height="1em">
                                                                            <use xlink:href="#ri-flag-line" />
                                                                        </svg><span>Пожаловаться</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                                <article class="${tw`p-4 border-b border-gray-100`}">
                                    <div class="${tw`flex items-start`}">
                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3`}">
                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20man%2C%20business%20casual&width=100&height=100&seq=13&orientation=squarish" alt="Аватар" class="${tw`w-full h-full object-cover`}" />
                                        </div>
                                        <div class="${tw`flex-1`}">
                                            <div class="${tw`flex justify-between items-start`}">
                                                <div>
                                                    <div class="${tw`font-medium`}">Игорь Кузнецов</div>
                                                    <div class="${tw`text-sm text-gray-500`}">3 мая 2025</div>
                                                </div>
                                            </div>
                                            <div class="${tw`mt-2`}">
                                                <p>
                                                    Не могу разобраться, как подключить устройство к приложению. Инструкция
                                                    не очень понятная. Есть ли видео или подробное руководство?
                                                </p>
                                            </div>
                                            <div class="${tw`mt-3 flex items-center justify-between`}">
                                                <div class="${tw`flex space-x-4`}">
                                                    <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-up-line" />
                                                        </svg>
                                                        <span>5</span>
                                                    </button>
                                                    <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-thumb-down-line" />
                                                        </svg>
                                                        <span>1</span>
                                                    </button>
                                                    <button data-action="toggle-reply" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                            <use xlink:href="#ri-chat-1-line" />
                                                        </svg>
                                                        <span>Ответить</span>
                                                    </button>
                                                </div>
                                                <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                    <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                        <use xlink:href="#ri-flag-line" />
                                                    </svg>
                                                    <span>Пожаловаться</span>
                                                </button>
                                            </div>

                                            <div class="reply-section ${tw` hidden mt-4 border-l-2 border-sky-600 bg-gray-50 rounded-r-lg overflow-hidden`}">
                                                <div class="reply-form ${tw`p-4`}">
                                                    <div class="${tw`flex space-x-3`}">
                                                        <div class="${tw`w-10 h-10 rounded-full bg-gray-200 overflow-hidden`}">
                                                            <img src="https://readdy.ai/api/search-image?query=professional%20headshot%20portrait&width=100&height=100" alt="Ваш аватар" class="${tw`w-full h-full object-cover`}" />
                                                        </div>
                                                        <div class="${tw`flex-1`}">
                                                            <textarea class="${tw`w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent`}" rows="3" placeholder="Напишите ваш ответ…"></textarea>
                                                            <div class="${tw`mt-2 flex justify-end space-x-2`}">
                                                                <button data-action="cancel-reply" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 whitespace-nowrap`}">
                                                                    Отмена
                                                                </button>
                                                                <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90 whitespace-nowrap`}">
                                                                    Отправить
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="answers-widget__replies">
                                                    <div class="${tw`p-4`} answers-widget__reply-item">
                                                        <div class="${tw`flex items-start space-x-3`}">
                                                            <div class="${tw`w-8 h-8 rounded-full bg-gray-200 overflow-hidden`}">
                                                                <img src="https://readdy.ai/api/search-image?query=support%20avatar%20icon%2C%20minimal%20flat%20design" alt="Аватар менеджера" class="${tw`w-full h-full object-cover`}" loading="lazy" />
                                                            </div>
                                                            <div class="${tw`flex-1`}">
                                                                <div class="${tw`flex items-center space-x-2`}">
                                                                    <span class="${tw`font-medium text-sm`}">Менеджер поддержки</span>
                                                                    <span class="${tw`text-xs text-gray-500`}">4 мая 2025</span>
                                                                </div>
                                                                <p class="${tw`text-sm mt-1`}">
                                                                    Игорь, благодарим за ваш вопрос! Вы можете найти подробное
                                                                    видео-руководство по подключению на нашем сайте в разделе
                                                                    «Поддержка». Также мы отправили вам ссылку на инструкцию на
                                                                    электронную почту. Если останутся вопросы, пишите в поддержку!
                                                                </p>
                                                                <div class="${tw`mt-2 flex justify-between items-center`}">
                                                                    <div class="${tw`flex space-x-4 items-center`}">
                                                                        <button data-action="like" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-up-line" />
                                                                            </svg>
                                                                            <span>3</span>
                                                                        </button>
                                                                        <button data-action="dislike" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                            <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                                <use xlink:href="#ri-thumb-down-line" />
                                                                            </svg>
                                                                            <span>0</span>
                                                                        </button>
                                                                    </div>
                                                                    <button data-action="toggle-report" data-target="report-modal" class="${tw`focus:outline-none flex items-center text-sm text-gray-500 hover:text-gray-700`}">
                                                                        <svg class="${tw`mr-1`}" width="1em" height="1em" fill="currentColor">
                                                                            <use xlink:href="#ri-flag-line" />
                                                                        </svg>
                                                                        <span>Пожаловаться</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                            </div>
                            <div class="${tw`mt-8 flex flex-col items-center`}">
                                <div class="${tw`text-sm text-gray-500 mb-4`}">Показано 2 из 156 вопросов</div>
                                <button data-action="show-more" class="${tw`focus:outline-none flex items-center justify-center px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 w-full`}">
                                    Показать ещё
                                    <svg class="${tw`inline`}" fill="currentColor" width="1em" height="1em">
                                        <use xlink:href="#ri-arrow-down-s-line" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <div id="add-review-modal" data-role="modal" data-state="closed" class="modal ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
            <div class="${tw`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
                <div class="${tw`flex justify-between items-center p-4 border-b border-gray-200`}">
                    <h3 class="${tw`font-medium`}">Оставить отзыв</h3>
                    <button data-action="close-modal" class="${tw`focus:outline-none text-gray-500 hover:text-gray-700`}">
                        <svg class="${tw`text-xl`}" fill="currentColor" width="1em" height="1em">
                            <use xlink:href="#ri-close-line" />
                        </svg>
                    </button>
                </div>
                <div class="${tw`p-6`}">
                    <div class="${tw`mb-4`}">
                        <label class="${tw`block text-sm font-medium text-gray-700 mb-2`}">Ваша оценка</label>
                        <div class="star-rating ${tw`flex space-x-1`}" id="star-rating">
                            <svg class="${tw`text-2xl text-gray-300 cursor-pointer`}" fill="currentColor" width="1em" height="1em" data-value="1">
                                <use xlink:href="#ri-star-fill" />
                            </svg>
                            <svg class="${tw`text-2xl text-gray-300 cursor-pointer`}" fill="currentColor" width="1em" height="1em" data-value="2">
                                <use xlink:href="#ri-star-fill" />
                            </svg>
                            <svg class="${tw`text-2xl text-gray-300 cursor-pointer`}" fill="currentColor" width="1em" height="1em" data-value="3">
                                <use xlink:href="#ri-star-fill" />
                            </svg>
                            <svg class="${tw`text-2xl text-gray-300 cursor-pointer`}" fill="currentColor" width="1em" height="1em" data-value="4">
                                <use xlink:href="#ri-star-fill" />
                            </svg>
                            <svg class="${tw`text-2xl text-gray-300 cursor-pointer`}" fill="currentColor" width="1em" height="1em" data-value="5">
                                <use xlink:href="#ri-star-fill" />
                            </svg>
                        </div>
                        <input type="hidden" name="modal-rating" id="modal-rating" />
                    </div>
                    <div class="${tw`mb-4`}">
                        <label class="${tw`block text-sm font-medium text-gray-700 mb-2`}">Ваш отзыв</label>
                        <textarea class="${tw`w-full border border-gray-300 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-sky-600`}" placeholder="Напишите ваш отзыв…"></textarea>
                    </div>
                    <div class="${tw`mb-4`}">
                        <label for="review-upload" class="${tw`cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center block hover:border-sky-600 transition`}">
                            <div class="${tw`w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center`}">
                                <svg class="${tw`text-gray-500 text-2xl`}" fill="currentColor" width="1em" height="1em">
                                    <use xlink:href="#ri-upload-2-line" />
                                </svg>
                            </div>
                            <p class="${tw`text-sm text-gray-500`}">Перетащите сюда или <span class="${tw`text-sky-600 underline`}">выберите файл</span></p>
                            <p class="${tw`text-xs text-gray-400 mt-1`}">JPG, PNG до 10MB</p>
                            <input id="review-upload" type="file" accept="image/jpeg,image/png" multiple class="${tw`hidden`}" />
                        </label>
                        <div id="review-preview" class="${tw`mt-4 flex gap-2 flex-wrap`}"></div>
                    </div>
                    <div class="${tw`flex justify-end`}">
                        <button data-action="close-modal" class="${tw`focus:outline-none mr-3 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50`}">
                            Отмена
                        </button>
                        <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90`}">
                            Отправить отзыв
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="add-question-modal" data-role="modal" data-state="closed" class="modal ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
            <div class="${tw`bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden`}">
                <div class="${tw`flex justify-between items-center p-4 border-b border-gray-200`}">
                    <h3 class="${tw`font-medium`}">Задать вопрос</h3>
                    <button data-action="close-modal" class="${tw`text-gray-500 hover:text-gray-700`}">
                        <svg class="${tw`text-xl`}" fill="currentColor" width="1em" height="1em">
                            <use xlink:href="#ri-close-line" />
                        </svg>
                    </button>
                </div>
                <div class="${tw`p-6`}">
                    <div class="${tw`mb-4`}">
                        <label class="${tw`block text-sm font-medium text-gray-700 mb-2`}">Ваш вопрос</label>
                        <textarea class="${tw`w-full border border-gray-300 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-sky-600`}" placeholder="Задайте ваш вопрос…"></textarea>
                    </div>
                    <div class="${tw`mb-4`}">
                        <label for="question-upload" class="${tw`cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center block hover:border-sky-600 transition`}">
                            <div class="${tw`w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center`}">
                                <svg class="${tw`text-gray-500 text-2xl`}" fill="currentColor" width="1em" height="1em">
                                    <use xlink:href="#ri-upload-2-line" />
                                </svg>
                            </div>
                            <p class="${tw`text-sm text-gray-500`}">Перетащите сюда или <span class="${tw`text-sky-600 underline`}">выберите файл</span></p>
                            <p class="${tw`text-xs text-gray-400 mt-1`}">JPG, PNG до 10MB</p>
                            <input id="question-upload" type="file" accept="image/jpeg,image/png" multiple class="${tw`hidden`}" />
                        </label>
                        <div id="question-preview" class="${tw`mt-4 flex gap-2 flex-wrap`}"></div>
                    </div>
                    <div class="${tw`flex justify-end`}">
                        <button data-action="close-modal" class="${tw`focus:outline-none mr-3 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50`}">
                            Отмена
                        </button>
                        <button class="${tw`focus:outline-none px-4 py-2 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-600 hover:bg-opacity-90`}">
                            Отправить вопрос
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="media-view-modal" data-role="modal" data-state="closed" class="modal ${tw`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 p-4 sm:p-0`}">
            <button data-action="close-modal" class="${tw`focus:outline-none focus:ring-0 absolute top-3 right-3 z-10 bg-black bg-opacity-60 rounded-full p-3 sm:p-1.5 hover:bg-black hover:bg-opacity-80 transition-colors`}">
                <svg class="${tw`text-xl text-white`}" fill="currentColor" width="1em" height="1em">
                    <use xlink:href="#ri-close-line" />
                </svg>
            </button>
            <button data-action="media-prev" class="${tw`focus:outline-none focus:ring-0 absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 rounded-full p-3 sm:p-1.5 hover:bg-black hover:bg-opacity-80 transition-colors`}">
                <svg class="${tw`text-2xl text-white`}" fill="currentColor" width="1em" height="1em">
                    <use xlink:href="#ri-arrow-left-s-line" />
                </svg>
            </button>
            <div class="${tw`relative w-full flex items-center justify-center min-h-[200px] max-h-[80vh]`}">
                <div id="media-loading" class="${tw`absolute inset-0 flex items-center justify-center bg-black bg-opacity-20`}">
                    <div class="${tw`w-6 h-6 border-2 border-t-sky-600 border-white border-opacity-50 rounded-full animate-spin`}"></div>
                </div>
                <img id="current-media" src="" alt="media" class="${tw`max-h-[80vh] max-w-full object-contain transition-opacity duration-300`}" style="opacity: 0;" />
            </div>
            <button data-action="media-next" class="${tw`focus:outline-none focus:ring-0 absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 rounded-full p-3 sm:p-1.5 hover:bg-black hover:bg-opacity-80 transition-colors`}">
                <svg class="${tw`text-2xl text-white`}" fill="currentColor" width="1em" height="1em">
                    <use xlink:href="#ri-arrow-right-s-line" />
                </svg>
            </button>
            <div class="${tw`text-center text-white text-opacity-90 py-2 px-4 bg-black bg-opacity-60 rounded-full mt-3`}">
                <span id="media-counter" class="${tw`text-sm font-medium`}"></span>
            </div>
        </div>

        <div id="report-modal" data-role="modal" data-state="closed" class="modal ${tw`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}">
            <div class="${tw`bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden`}">
                <div class="${tw`flex justify-between items-center p-4 border-b border-gray-200`}">
                    <h3 class="${tw`font-medium`}">Пожаловаться</h3>
                    <button data-action="close-modal" class="${tw`text-gray-500 hover:text-gray-700`}">
                        <svg class="${tw`text-xl`}" fill="currentColor" width="1em" height="1em">
                            <use xlink:href="#ri-close-line" />
                        </svg>
                    </button>
                </div>
                <div class="${tw`p-6`}">
                    <p class="${tw`mb-4 text-sm text-gray-700`}">Укажите причину жалобы:</p>
                    <div class="${tw`space-y-2 mb-4`}">
                        <label class="${tw`flex items-center space-x-2`}">
                            <input type="radio" name="report-reason-type" value="spam" class="${tw`text-sky-600`}" />
                            <span class="${tw`text-sm text-gray-700`}">Спам или реклама</span>
                        </label>
                        <label class="${tw`flex items-center space-x-2`}">
                            <input type="radio" name="report-reason-type" value="offensive" class="${tw`text-sky-600`}" />
                            <span class="${tw`text-sm text-gray-700`}">Оскорбительное поведение</span>
                        </label>
                        <label class="${tw`flex items-center space-x-2`}">
                            <input type="radio" name="report-reason-type" value="false" class="${tw`text-sky-600`}" />
                            <span class="${tw`text-sm text-gray-700`}">Ложная информация</span>
                        </label>
                        <label class="${tw`flex items-center space-x-2`}">
                            <input type="radio" name="report-reason-type" value="other" class="${tw`text-sky-600`}" />
                            <span class="${tw`text-sm text-gray-700`}">Другое</span>
                        </label>
                    </div>
                    <textarea id="report-reason" class="${tw`w-full border border-gray-300 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-sky-600`}" placeholder="Дополнительная информация (необязательно)…"></textarea>
                    <div class="${tw`mt-6 flex justify-end space-x-3`}">
                        <button data-action="close-modal" class="${tw`focus:outline-none px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50`}">
                            Отмена
                        </button>
                        <button id="report-submit" class="${tw`focus:outline-none px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600`}">
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}

customElements.define('reviews-widget', ReviewsWidget);
