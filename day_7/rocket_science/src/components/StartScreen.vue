<template>
  <div class="s-startscreen">
    <div class="s-startscreen-content">
      <!-- Иконка ракеты -->
      <div class="s-startscreen-icon">🚀</div>
      
      <!-- Заголовок -->
      <h1 class="s-startscreen-title">
        {{ hasCrashed ? 'Все корабли разбились!' : 'Добро пожаловать!' }}
      </h1>
      
      <!-- Описание -->
      <p class="s-startscreen-description">
        {{ hasCrashed 
          ? 'Запустите новый корабль, чтобы продолжить миссию' 
          : 'Выберите корабль из меню слева и отправьте его в космос!'
        }}
      </p>
      
      <!-- Кнопка запуска -->
      <button class="s-startscreen-btn" @click="$emit('start')">
        {{ hasCrashed ? 'Запустить новый корабль' : 'Начать миссию' }}
      </button>
      
      <!-- Подсказка -->
      <div class="s-startscreen-hint">
        <span>💡</span>
        <span>Совет: кликайте по кораблю, чтобы заправить его, когда топливо заканчивается</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasCrashed: {
    type: Boolean,
    default: false
  }
});

defineEmits(['start']);
</script>
