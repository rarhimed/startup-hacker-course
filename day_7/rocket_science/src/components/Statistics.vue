<template>
  <div class="s-statistics">
    <div class="s-statistics-title">Статистика</div>
    
    <div class="s-statistics-list">
      <!-- Активные корабли -->
      <div class="s-statistics-item">
        <span class="s-statistics-label">Активных:</span>
        <span class="s-statistics-value active">{{ activeCount }}</span>
      </div>
      
      <!-- Разбитые корабли -->
      <div class="s-statistics-item">
        <span class="s-statistics-label">Разбито:</span>
        <span class="s-statistics-value crashed">{{ crashedCount }}</span>
      </div>
      
      <!-- Всего запущено -->
      <div class="s-statistics-item">
        <span class="s-statistics-label">Всего:</span>
        <span class="s-statistics-value total">{{ totalCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeCount: {
    type: Number,
    default: 0
  },
  crashedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  }
});
</script>
