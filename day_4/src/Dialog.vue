<template>
  <div class="dialog-overlay" @click.self="handleClose">
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
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
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
