<template>
  <form @submit.prevent="handleSubmit">
        <label>
          Название:
          <input 
            ref="titleInput"
            type="text" 
            :value="modelValue.title"
            @input="updateField('title', $event.target.value)"
            required 
          />
        </label>

        <label>
          Описание:
          <textarea 
            :value="modelValue.description"
            @input="updateField('description', $event.target.value)"
            rows="4" 
            required
          ></textarea>
        </label>

        <label>
          Обложка (URL):
          <input 
            type="text" 
            :value="modelValue.cover"
            @input="updateField('cover', $event.target.value)"
            required 
          />
        </label>

        <label>
          Жанр:
          <select 
            :value="modelValue.genre"
            @change="updateField('genre', Array.from($event.target.selectedOptions, option => option.value))"
            multiple
          >
            <option 
              v-for="genreOption in availableGenres" 
              :key="genreOption" 
              :value="genreOption"
            >
              {{ genreOption }}
            </option>
          </select>
          <small v-if="Array.isArray(modelValue.genre) && modelValue.genre.length > 0">
            Выбрано: {{ modelValue.genre.join(', ') }}
          </small>
        </label>

        <label>
          <input 
            type="checkbox" 
            :checked="modelValue.isAdult"
            @change="updateField('isAdult', $event.target.checked)"
          />
          18+
        </label>

        <!-- Кнопки -->
        <div class="form-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" @click="handleCancel">Отменить</button>
        </div>
      </form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash';

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

// Константы
const availableGenres = [
  'Классическая литература',
  'Фэнтези',
  'Антиутопия',
  'Философская сказка',
  'Детектив',
  'Роман',
  'Научная фантастика'
];

// Обновление поля формы
const updateField = (field, value) => {
  const updated = {
    ...props.modelValue,
    [field]: value
  };
  emit('update:modelValue', updated);
};

// Обработка отправки формы
const handleSubmit = () => {
  emit('submit');
};

// Обработка отмены
const handleCancel = () => {
  emit('cancel');
};

// Ref для первого поля ввода
const titleInput = ref(null);

// Lifecycle hook - автофокус на первое поле при открытии формы
onMounted(() => {
  // Фокус на поле "Название" при открытии формы
  if (titleInput.value) {
    titleInput.value.focus();
  }
});

// ===== Задание 5: Watch + debounce для имитации отложенной отправки =====

// Debounced функция для имитации отправки на сервер
// Вызывается через 500мс после последнего изменения
const sendToServer = debounce((text) => {
  console.log(`Отправили ${text} на сервер`);
}, 500);

// Наблюдатель на поле названия книги
// Срабатывает при каждом изменении title в modelValue
watch(
  () => props.modelValue.title,
  (newValue) => {
    // Если поле не пустое, вызываем debounced функцию
    if (newValue) {
      sendToServer(newValue);
    }
  }
);
</script>

<style scoped>
form label {
  display: block;
  margin-bottom: 15px;
}

form input[type="text"],
form textarea,
form select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

form select[multiple] {
  height: 100px;
}

form small {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
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

.form-buttons button[type="submit"]:hover {
  background-color: #45a049;
}

.form-buttons button[type="button"] {
  background-color: #f44336;
  color: white;
}

.form-buttons button[type="button"]:hover {
  background-color: #d32f2f;
}
</style>
