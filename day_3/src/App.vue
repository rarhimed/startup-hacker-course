<template>
  <div class="app">
    <!-- Кнопки управления -->
    <div class="controls">
      <button @click="openAddForm" class="add-button">
        Добавить
      </button>
      <button @click="resetAllRatings" class="reset-ratings-button">
        Сбросить все рейтинги
      </button>
    </div>

    <!-- Блок статистики -->
    <div class="statistics">
      <div class="stat-item">
        <span class="stat-label">Всего книг:</span>
        <span class="stat-value">{{ totalBooks }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Средний рейтинг:</span>
        <span class="stat-value">{{ averageRating }}</span>
      </div>
    </div>

    <!-- Форма (показывается только если showForm === true) -->
    <div v-if="showForm" class="form-overlay" @click.self="cancelForm">
      <div class="form-container">
        <h2>{{ formTitle }}</h2>
        
        <!-- Поля формы -->
        <form @submit.prevent="saveBook">
          <label>
            Название:
            <input type="text" v-model="formData.title" required />
          </label>

          <label>
            Описание:
            <textarea v-model="formData.description" rows="4" required></textarea>
          </label>

          <label>
            Обложка (URL):
            <input type="text" v-model="formData.cover" required />
          </label>

          <label>
            Жанр:
            <select v-model="formData.genre" multiple>
              <option 
                v-for="genreOption in availableGenres" 
                :key="genreOption" 
                :value="genreOption"
                :selected="formData.genre === genreOption || (Array.isArray(formData.genre) && formData.genre.includes(genreOption))"
              >
                {{ genreOption }}
              </option>
            </select>
            <small v-if="Array.isArray(formData.genre) && formData.genre.length > 0">
              Выбрано: {{ formData.genre.join(', ') }}
            </small>
          </label>

          <label>
            <input type="checkbox" v-model="formData.isAdult" />
            18+
          </label>

          <!-- Кнопки -->
          <div class="form-buttons">
            <button type="submit">Сохранить</button>
            <button type="button" @click="cancelForm">Отменить</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Карточки книг -->
    <div class="books-container">
      <div 
        v-for="book in books" 
        :key="book.id" 
        class="book-card"
      >
        <div class="book-cover">
          <img :src="book.cover" :alt="book.title" />
          <span v-if="book.isAdult" class="adult-badge">18+</span>

          <div class="rating-badge">
            <FontAwesomeIcon 
              icon="star" 
              :class="book.rating ? 'has-rating' : 'no-rating'"
            />
            <span class="rating-value">{{ book.rating || '—' }}</span>
          </div>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-genre">
            {{ Array.isArray(book.genre) ? book.genre.join(', ') : book.genre }}
          </p>
          <p class="book-description">{{ book.description }}</p>
          <div class="book-rating">
            <FontAwesomeIcon 
              v-for="star in 5" 
              :key="star"
              icon="star" 
              :class="star <= book.rating ? 'star filled' : 'star'"
              @click="setRating(book, star)"
            />
          </div>
        </div>
        <div class="book-actions">
          <button @click="openEditForm(book)" class="edit-button">Редактировать</button>
          <button @click="deleteBook(book.id)" class="delete-button">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// ================== Константы ==================
const availableGenres = [
  'Классическая литература',
  'Фэнтези',
  'Антиутопия',
  'Философская сказка',
  'Детектив',
  'Роман',
  'Научная фантастика'
];

// ================== Работа с карточками книг ==================
const books = ref([
  {
    id: 1,
    title: 'Война и мир',
    description: 'Эпический роман Льва Толстого о жизни русского общества во время наполеоновских войн.',
    genre: 'Классическая литература',
    cover: 'https://imo10.labirint.ru/books/488632/cover.jpg/242-0',
    isAdult: false,
    rating: 0
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

// ================== Computed свойства ==================
const isEditing = computed(() => editingBookId.value !== null);

const formTitle = computed(() => {
  return isEditing.value ? 'Редактировать книгу' : 'Добавить книгу';
});

const editingBook = computed(() => {
  if (!isEditing.value) return null;
  return books.value.find(book => book.id === editingBookId.value);
});

// Статистика
const totalBooks = computed(() => {
  return books.value.length;
});

const averageRating = computed(() => {
  if (books.value.length === 0) return '0.00';
  
  const booksWithRating = books.value.filter(book => book.rating > 0);
  if (booksWithRating.length === 0) return '0.00';
  
  const sum = booksWithRating.reduce((acc, book) => acc + book.rating, 0);
  const average = sum / booksWithRating.length;
  return average.toFixed(2);
});

// ================== Методы работы с рейтингом ==================
const setRating = (book, rating) => {
  if (book.rating === rating) {
    book.rating = 0;
  } else {
    book.rating = rating;
  }
};

// ================== Работа с формой ==================
const showForm = ref(false);
const editingBookId = ref(null);
const formData = ref({
  title: '',
  description: '',
  cover: '',
  genre: '',
  isAdult: false,
});

// Открыть форму для добавления
const openAddForm = () => {
  editingBookId.value = null;
  resetForm();
  showForm.value = true;
};

// Открыть форму для редактирования
const openEditForm = (book) => {
  editingBookId.value = book.id;
  fillFormFromBook(book);
  showForm.value = true;
};

// Заполнить форму данными книги
const fillFormFromBook = (book) => {
  // Если жанр - строка, преобразуем в массив для multiple select
  const genreValue = Array.isArray(book.genre) 
    ? book.genre 
    : book.genre ? [book.genre] : [];
  
  formData.value = {
    title: book.title || '',
    description: book.description || '',
    cover: book.cover || '',
    genre: genreValue,
    isAdult: book.isAdult || false
  };
};

// Очистить форму
const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    cover: '',
    genre: [], // Для multiple select нужен массив
    isAdult: false
  };
};

// Создать новую книгу
const createNewBook = () => {
  // Сохраняем массив жанров как есть, если он не пустой
  const genreValue = Array.isArray(formData.value.genre) 
    ? formData.value.genre.length > 0 
      ? formData.value.genre 
      : []
    : formData.value.genre ? [formData.value.genre] : [];
  
  return {
    id: generateBookId(),
    title: formData.value.title,
    description: formData.value.description,
    cover: formData.value.cover,
    genre: genreValue,
    isAdult: formData.value.isAdult,
    rating: 0
  };
};

// Обновить существующую книгу
const updateBook = (bookIndex) => {
  if (bookIndex === -1) return;
  
  // Сохраняем массив жанров как есть
  const genreValue = Array.isArray(formData.value.genre) 
    ? formData.value.genre 
    : formData.value.genre ? [formData.value.genre] : [];
  
  books.value[bookIndex] = {
    ...books.value[bookIndex],
    title: formData.value.title,
    description: formData.value.description,
    cover: formData.value.cover,
    genre: genreValue,
    isAdult: formData.value.isAdult
  };
};

// Сохранить книгу (добавить или обновить)
const saveBook = () => {
  if (!isEditing.value) {
    // Режим добавления
    const newBook = createNewBook();
    books.value.push(newBook);
  } else {
    // Режим редактирования
    const bookIndex = books.value.findIndex(b => b.id === editingBookId.value);
    updateBook(bookIndex);
  }
  
  closeForm();
};

// Закрыть форму
const closeForm = () => {
  resetForm();
  showForm.value = false;
  editingBookId.value = null;
};

// Отменить (очистить и закрыть)
const cancelForm = () => {
  closeForm();
};

// ================== Работа с книгами ==================
const deleteBook = (bookId) => {
  const index = books.value.findIndex(book => book.id === bookId);
  if (index !== -1) {
    books.value.splice(index, 1);
  }
};

// Генерация уникального ID
const generateBookId = () => {
  if (books.value.length === 0) {
    return 1;
  }
  const maxId = Math.max(...books.value.map(book => book.id));
  return maxId + 1;
};

// Сбросить рейтинг всех книг
const resetAllRatings = () => {
  books.value.forEach(book => {
    book.rating = 0;
  });
};

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
  min-height: 250px;
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
  cursor: pointer;
}

.star.filled {
  color: #ffc107;
}

.rating-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-block;
}

.rating-badge svg {
  font-size: 48px;
  display: block;
}

.rating-badge .has-rating {
  color: #ffc107;
}

.rating-badge .no-rating {
  color: #979797;
}

.rating-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  pointer-events: none;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.add-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-button:hover {
  background-color: #45a049;
}

.reset-ratings-button {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-ratings-button:hover {
  background-color: #f57c00;
}

.statistics {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-container label {
  display: block;
  margin-bottom: 15px;
}

.form-container input[type="text"],
.form-container textarea,
.form-container select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-container select[multiple] {
  height: 100px;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-buttons button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

.form-buttons button[type="button"] {
  background-color: #f44336;
  color: white;
}

.book-actions {
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
}

.edit-button,
.delete-button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #2196F3;
  color: white;
}

.edit-button:hover {
  background-color: #1976D2;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}

</style>
