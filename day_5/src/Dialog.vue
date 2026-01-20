<template>
  <!-- Transition инкапсулирована в компоненте - родитель не знает о ней -->
  <Transition name="dialog">
    <div v-if="show" class="dialog-overlay" @click.self="handleClose">
      <!-- Окно - анимируется отдельно (fade + slide-up) -->
      <div class="dialog-container">
        <!-- Заголовок -->
        <div class="dialog-header">
          <slot name="title">
            <h2 v-if="title">{{ title }}</h2>
          </slot>
        </div>

        <!-- Содержимое -->
        <div class="dialog-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['close']);

// Обработка закрытия
const handleClose = () => {
  emit('close');
};

// Обработка нажатия Escape
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    handleClose();
  }
};

// Lifecycle hooks
onMounted(() => {
  // Добавляем обработчик Escape при монтировании
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  // Удаляем обработчик при размонтировании (важно для предотвращения утечек памяти)
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
/* Подложка - статичная, анимируется только opacity (fade) */
.dialog-overlay {
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

/* Окно - анимируется отдельно (fade + slide-up) */
.dialog-container {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
}

.dialog-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.dialog-content {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}
</style>

<!-- Стили анимации без scoped - нужны для работы с классами Transition -->
<style>
/* ===== Анимация модального окна (инкапсулирована в компоненте) ===== */

/* Подложка - только fade (opacity), остаётся статичной на месте */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease-out;
}

/* Окно внутри подложки - fade + slide-up (opacity + transform) */
.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* Начальное/конечное состояние подложки - только opacity */
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

/* Начальное/конечное состояние окна - opacity + смещение снизу */
.dialog-enter-from .dialog-container,
.dialog-leave-to .dialog-container {
  opacity: 0;
  transform: translateY(30px);
}
</style>
