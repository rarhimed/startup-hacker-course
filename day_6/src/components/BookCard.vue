<template>
  <div class="book-card">
    <div class="book-cover">
      <img :src="book.cover" :alt="book.title" />
      <STag v-if="book.isAdult" color="red" class="adult-badge">18+</STag>

      <div class="rating-badge">
        <FontAwesomeIcon 
          icon="star" 
          :class="rated ? 'has-rating' : 'no-rating'"
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
          @click="handleRatingClick(star)"
        />
      </div>
    </div>
    <div class="book-actions">
      <button class="edit-button" @click="handleEdit">Редактировать</button>
      <button class="delete-button" @click="handleDelete">Удалить</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['edit', 'delete', 'rating-change']);

// Computed свойство rated
const rated = computed(() => {
  return props.book.rating >= 1;
});

// Обработчики событий
const handleEdit = () => {
  emit('edit', props.book);
};

const handleDelete = () => {
  emit('delete', props.book.id);
};

const handleRatingClick = (rating) => {
  const newRating = props.book.rating === rating ? 0 : rating;
  emit('rating-change', props.book.id, newRating);
};
</script>

<style scoped>
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
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
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

.book-actions {
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
}

/* Кнопка "Редактировать" - синий цвет */
.edit-button {
  flex: 1;
  padding: 10px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.edit-button:hover {
  background-color: #1976D2;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.edit-button:active {
  transform: scale(0.98);
  background-color: #1565C0;
}

/* Кнопка "Удалить" - лососевый/розовый цвет */
.delete-button {
  flex: 1;
  padding: 10px 16px;
  background-color: #e57373;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.delete-button:hover {
  background-color: #ef5350;
  box-shadow: 0 2px 8px rgba(229, 115, 115, 0.4);
}

.delete-button:active {
  transform: scale(0.98);
  background-color: #e53935;
}
</style>
