<template>
  <SForm @submit="handleSubmit">
    <SFormRow name="title" title="Название">
      <SInput 
        ref="titleInput"
        v-model="localFormData.title"
        placeholder="Введите название книги"
        required 
      />
    </SFormRow>

    <SFormRow name="description" title="Описание">
      <SInput 
        v-model="localFormData.description"
        multiline
        :rows="4"
        placeholder="Введите описание книги"
        required
      />
    </SFormRow>

    <SFormRow name="cover" title="Обложка (URL)">
      <SInput 
        v-model="localFormData.cover"
        placeholder="https://example.com/cover.jpg"
        required 
      />
    </SFormRow>

    <SFormRow name="genre" title="Жанр">
      <SSelect 
        v-model="localFormData.genre"
        :options="genreOptions"
        multiple
        placeholder="Выберите жанры"
      />
      <template #hint v-if="Array.isArray(localFormData.genre) && localFormData.genre.length > 0">
        Выбрано: {{ localFormData.genre.join(', ') }}
      </template>
    </SFormRow>

    <SFormRow name="isAdult">
      <SCheckboxGroup>
        <SCheckbox 
          v-model="localFormData.isAdult"
          label="18+"
        />
      </SCheckboxGroup>
    </SFormRow>

    <!-- Кнопки -->
    <div class="form-buttons">
      <SButton type="submit" color="green">Сохранить</SButton>
      <SButton type="button" color="red" outlined @click="handleCancel">Отменить</SButton>
    </div>
  </SForm>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
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

// Локальная копия данных формы
const localFormData = ref({ ...props.modelValue });

// Синхронизация с родительским компонентом
watch(() => props.modelValue, (newVal) => {
  localFormData.value = { ...newVal };
}, { deep: true });

watch(localFormData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

// Константы - преобразуем в формат для SSelect
const genreOptions = {
  'Классическая литература': 'Классическая литература',
  'Фэнтези': 'Фэнтези',
  'Антиутопия': 'Антиутопия',
  'Философская сказка': 'Философская сказка',
  'Детектив': 'Детектив',
  'Роман': 'Роман',
  'Научная фантастика': 'Научная фантастика'
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
  () => localFormData.value.title,
  (newValue) => {
    // Если поле не пустое, вызываем debounced функцию
    if (newValue) {
      sendToServer(newValue);
    }
  }
);
</script>

<style scoped>
.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
