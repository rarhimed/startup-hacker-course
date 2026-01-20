<template>
  <div class="s-shipmenu">
    <div class="s-shipmenu-title">Корабли</div>
    
    <div class="s-shipmenu-list">
      <div
        v-for="shipType in shipTypes"
        :key="shipType.id"
        class="s-shipmenu-item"
        @click="$emit('select', shipType)"
      >
        <!-- Превью корабля -->
        <img :src="shipType.image" :alt="shipType.name" />
        
        <!-- Название типа -->
        <span class="s-shipmenu-name">{{ shipType.name }}</span>
        
        <!-- Характеристики -->
        <div class="s-shipmenu-stats">
          <div class="s-shipmenu-stat">
            <span>Топливо:</span>
            <span>{{ shipType.fuelCapacity }}</span>
          </div>
          <div class="s-shipmenu-stat">
            <span>Скорость:</span>
            <span>{{ shipType.speed }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  shipTypes: {
    type: Array,
    required: true
  }
});

defineEmits(['select']);
</script>
