<template>
  <div
    class="s-ship"
    :class="{
      'low-fuel': isLowFuel && !isFalling && !isCrashed,
      'falling': isFalling,
      'crashed': isCrashed
    }"
    :style="shipStyle"
    @click="handleClick"
  >
    <div class="s-ship-container">
      <!-- Имя корабля -->
      <div class="s-ship-name">{{ ship.name }}</div>
      
      <!-- Подсказка о заправке (показывается при низком топливе) -->
      <div v-if="isLowFuel && !isFalling && !isCrashed" class="s-ship-refuel-hint">
        Кликни для заправки!
      </div>
      
      <!-- Изображение корабля -->
      <img
        :src="currentImage"
        :alt="ship.name"
        class="s-ship-image"
      />
      
      <!-- Индикатор топлива (не показываем для разбитых) -->
      <div v-if="!isCrashed" class="s-ship-fuel">
        <div
          class="s-ship-fuel-bar"
          :class="fuelBarClass"
          :style="{ width: fuelPercentage + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { FLIGHT_BOUNDS } from '../constants';

const props = defineProps({
  ship: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['refuel', 'crashed']);

// Локальные координаты для анимации движения
const localX = ref(props.ship.x);
const localY = ref(props.ship.y);

// Локальное значение топлива
const localFuel = ref(props.ship.fuel);

// Направление движения (1 = вправо, -1 = влево)
const direction = ref(1);

// Интервалы для обновления
let moveInterval = null;
let fuelInterval = null;

// Вычисляемые свойства состояния
const isCrashed = computed(() => props.ship.status === 'crashed');
const isFalling = computed(() => props.ship.status === 'falling');

// Процент оставшегося топлива
const fuelPercentage = computed(() => {
  return Math.max(0, (localFuel.value / props.ship.type.fuelCapacity) * 100);
});

// Низкий уровень топлива (меньше 10%)
const isLowFuel = computed(() => fuelPercentage.value <= 10 && fuelPercentage.value > 0);

// Класс для цвета индикатора топлива
const fuelBarClass = computed(() => {
  if (fuelPercentage.value <= 10) return 'danger';
  if (fuelPercentage.value <= 30) return 'warning';
  return '';
});

// Текущее изображение (нормальное или разбитое)
// Показываем crashed-версию когда топливо закончилось (падение или крушение)
const currentImage = computed(() => {
  return (isCrashed.value || isFalling.value) 
    ? props.ship.type.crashedImage 
    : props.ship.type.image;
});

// Стиль позиционирования корабля
const shipStyle = computed(() => ({
  left: `${localX.value}px`,
  top: `${localY.value}px`
}));

/**
 * Обработка клика по кораблю — заправка
 */
function handleClick() {
  if (!isCrashed.value && !isFalling.value) {
    emit('refuel', props.ship.id);
    localFuel.value = props.ship.type.fuelCapacity;
  }
}

/**
 * Запускает цикл движения корабля
 * Корабль летает горизонтально, отскакивая от краёв зоны полёта
 */
function startMovement() {
  const fps = 60;
  const interval = 1000 / fps;
  
  moveInterval = setInterval(() => {
    if (isCrashed.value || isFalling.value) return;
    
    const speed = props.ship.type.speed;
    const step = speed / fps;
    
    // Границы зоны полёта
    const minX = FLIGHT_BOUNDS.left;
    const maxX = window.innerWidth - FLIGHT_BOUNDS.right - 100;
    const minY = FLIGHT_BOUNDS.top;
    const maxY = window.innerHeight - FLIGHT_BOUNDS.bottom;
    
    // Движение по горизонтали
    localX.value += step * direction.value;
    
    // Небольшое колебание по вертикали (волнообразное движение)
    localY.value += Math.sin(Date.now() / 500) * 0.5;
    
    // Отскок от границ зоны полёта (не от краёв экрана)
    if (localX.value > maxX) {
      direction.value = -1;
      localX.value = maxX;
    } else if (localX.value < minX) {
      direction.value = 1;
      localX.value = minX;
    }
    
    // Ограничение по вертикали
    if (localY.value < minY) {
      localY.value = minY;
    } else if (localY.value > maxY && !isLowFuel.value) {
      localY.value = maxY;
    }
    
    // При низком топливе — снижение
    if (isLowFuel.value) {
      localY.value += 0.5;  // Медленное снижение
    }
  }, interval);
}

/**
 * Запускает цикл расхода топлива
 */
function startFuelConsumption() {
  fuelInterval = setInterval(() => {
    if (isCrashed.value || isFalling.value) return;
    
    // Расход топлива
    localFuel.value -= props.ship.type.fuelConsumption;
    
    // Если топливо закончилось — начинаем падение
    if (localFuel.value <= 0) {
      localFuel.value = 0;
      props.ship.status = 'falling';
      
      // Через 2 секунды (время анимации падения) — крушение
      setTimeout(() => {
        emit('crashed', props.ship.id);
      }, 2000);
    }
  }, 1000);
}

/**
 * Синхронизация с props при внешней заправке
 */
watch(() => props.ship.fuel, (newFuel) => {
  localFuel.value = newFuel;
});

onMounted(() => {
  if (!isCrashed.value) {
    startMovement();
    startFuelConsumption();
  }
});

onUnmounted(() => {
  if (moveInterval) clearInterval(moveInterval);
  if (fuelInterval) clearInterval(fuelInterval);
});
</script>
