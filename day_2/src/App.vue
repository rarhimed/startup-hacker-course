<template>
  <div class="app">
    <div class="books-container">
      <div 
        v-for="book in books" 
        :key="book.id" 
        class="book-card"
      >
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" />
          <span v-if="book.isAdult" class="adult-badge">18+</span>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-genre">{{ book.genre }}</p>
          <p class="book-description">{{ book.description }}</p>
          <div class="book-rating">
            <FontAwesomeIcon 
              v-for="star in 5" 
              :key="star"
              icon="star" 
              :class="star <= book.rating ? 'star filled' : 'star'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const books = ref([
  {
    id: 1,
    title: 'Война и мир',
    description: 'Эпический роман Льва Толстого о жизни русского общества во время наполеоновских войн.',
    genre: 'Классическая литература',
    cover: 'https://imo10.labirint.ru/books/488632/cover.jpg/242-0',
    isAdult: false,
    rating: 5
  },
  {
    id: 2,
    title: '1984',
    description: 'Антиутопический роман Джорджа Оруэлла о тоталитарном обществе будущего.',
    genre: 'Антиутопия',
    cover: 'https://imo10.labirint.ru/books/860997/cover.jpg/484-0',
    isAdult: true,
    rating: 4
  },
  {
    id: 3,
    title: 'Гарри Поттер и философский камень',
    description: 'Первая книга о юном волшебнике и его приключениях в школе магии Хогвартс.',
    genre: 'Фэнтези',
    cover: 'https://imo10.labirint.ru/books/424618/cover.jpg/484-0',
    isAdult: false,
    rating: 3
  },
  {
    id: 4,
    title: 'Преступление и наказание',
    description: 'Психологический роман Фёдора Достоевского о студенте, совершившем убийство.',
    genre: 'Классическая литература',
    cover: 'https://imo10.labirint.ru/books/729483/cover.jpg/484-0',
    isAdult: true,
    rating: 5
  },
  {
    id: 5,
    title: 'Маленький принц',
    description: 'Философская сказка Антуана де Сент-Экзюпери о мальчике с другой планеты.',
    genre: 'Философская сказка',
    cover: 'https://simg.marwin.kz/media/catalog/product/cache/8d1771fdd19ec2393e47701ba45e606d/c/o/cover1__w600_61_74.jpg',
    isAdult: false,
    rating: 5
  }
]);
</script>

<style scoped>
.app {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 650px;
}

.book-cover {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.adult-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.book-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.book-description {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #555;
  line-height: 1.5;
  flex: 1;
  overflow-y: auto;
}

.book-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.book-genre {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #666;
  font-style: italic;
}

.book-rating {
  display: flex;
  gap: 4px;
}

.star {
  color: #ddd;
  font-size: 18px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffc107;
}
</style>
