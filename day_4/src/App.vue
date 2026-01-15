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
    <Dialog
      v-if="showForm"
      :title="formTitle"
      @close="cancelForm"
    >
      <BookForm
        v-model="formData"
        :is-editing="isEditing"
        @submit="saveBook"
        @cancel="cancelForm"
      />
    </Dialog>

    <!-- Карточки книг -->
    <div class="books-container">
      <BookCard
        v-for="book in books" 
        :key="book.id" 
        :book="book"
        @edit="handleEdit"
        @delete="handleDelete"
        @rating-change="handleRatingChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BookCard from './BookCard.vue';
import BookForm from './BookForm.vue';
import Dialog from './Dialog.vue';


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

// ================== Работа с формой и событиями ==================
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

// Обработчик события edit из BookCard
const handleEdit = (book) => {
  openEditForm(book);
};

// Обработчик события delete из BookCard
const handleDelete = (bookId) => {
  deleteBook(bookId);
};

// Обработчик события rating-change из BookCard
const handleRatingChange = (bookId, newRating) => {
  const book = books.value.find(b => b.id === bookId);
  if (book) {
    book.rating = newRating;
  }
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


</style>
