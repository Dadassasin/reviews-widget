// Пример тестовых отзывов для reviews-section
export const reviews = [
  {
    id: 1,
    author: { name: 'Иван', avatar: 'https://i.pravatar.cc/100?img=1' },
    date: '2025-05-01T12:00:00Z',
    sentiment: 'positive',
    emotion: 'happy',
    rating: 5,
    text: 'Отличный продукт! Всё понравилось.',
    media: [],
    likes: 3,
    dislikes: 0,
    replies: [
      { id: 1, author: { name: 'Маша', avatar: 'https://i.pravatar.cc/100?img=2' }, text: 'Согласна!' }
    ],
    showReplies: false
  },
  {
    id: 2,
    author: { name: 'Петр', avatar: 'https://i.pravatar.cc/100?img=3' },
    date: '2025-04-20T15:30:00Z',
    sentiment: 'neutral',
    emotion: 'neutral',
    rating: 3,
    text: 'В целом нормально, но есть недостатки.',
    media: [],
    likes: 1,
    dislikes: 2,
    replies: [],
    showReplies: false
  },
  {
    id: 3,
    author: { name: 'Ольга', avatar: 'https://i.pravatar.cc/100?img=4' },
    date: '2025-03-10T10:00:00Z',
    sentiment: 'negative',
    emotion: 'sad',
    rating: 1,
    text: 'Не рекомендую, плохой опыт.',
    media: [],
    likes: 0,
    dislikes: 5,
    replies: [],
    showReplies: false
  }
];
TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST