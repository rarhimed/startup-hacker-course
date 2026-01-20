<template>
  <div class="s-rocketapp">
    <!-- Область с летающими кораблями -->
    <div class="s-rocketapp-space">
      <Ship
        v-for="ship in activeShips"
        :key="ship.id"
        :ship="ship"
        @refuel="refuelShip"
        @crashed="handleCrash"
      />
    </div>

    <!-- Меню выбора кораблей (слева) -->
    <ShipMenu
      :ship-types="shipTypes"
      @select="openLaunchModal"
    />

    <!-- Панель статистики (сверху по центру) -->
    <Statistics
      :active-count="activeShipsCount"
      :crashed-count="crashedShipsCount"
      :total-count="totalLaunchedCount"
    />

    <!-- Стартовое окно (когда нет активных кораблей) -->
    <StartScreen
      v-if="showStartScreen"
      :has-crashed="crashedShipsCount > 0"
      @start="openShipSelection"
    />

    <!-- Модальное окно запуска корабля -->
    <LaunchModal
      v-model:visible="isLaunchModalVisible"
      :ship-type="selectedShipType"
      @launch="launchShip"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Ship from './components/Ship.vue';
import ShipMenu from './components/ShipMenu.vue';
import Statistics from './components/Statistics.vue';
import LaunchModal from './components/LaunchModal.vue';
import StartScreen from './components/StartScreen.vue';
import { FLIGHT_BOUNDS } from './constants';

/**
 * Типы кораблей с их характеристиками
 * - fuelCapacity: объём топливного бака (в условных единицах)
 * - speed: скорость перемещения (пикселей в секунду)
 * - fuelConsumption: расход топлива в секунду (зависит от скорости)
 */
const shipTypes = ref([
  {
    id: 1,
    name: 'Разведчик',
    image: '/ship1.png',
    crashedImage: '/ship_crashed1.png',
    fuelCapacity: 100,
    speed: 80,
    fuelConsumption: 2  // Медленный, экономичный
  },
  {
    id: 2,
    name: 'Транспорт',
    image: '/ship2.png',
    crashedImage: '/ship_crashed2.png',
    fuelCapacity: 150,
    speed: 50,
    fuelConsumption: 1.5  // Очень медленный, очень экономичный
  },
  {
    id: 4,
    name: 'Истребитель',
    image: '/ship4.png',
    crashedImage: '/ship_crashed4.png',
    fuelCapacity: 80,
    speed: 150,
    fuelConsumption: 4  // Быстрый, прожорливый
  },
  {
    id: 5,
    name: 'Крейсер',
    image: '/ship5.png',
    crashedImage: '/ship_crashed5.png',
    fuelCapacity: 200,
    speed: 100,
    fuelConsumption: 3  // Средняя скорость, большой бак
  }
]);

// Список всех запущенных кораблей (активные + разбитые)
const ships = ref([]);

// Счётчик для генерации уникальных ID
let shipIdCounter = 0;

// Состояние модального окна
const isLaunchModalVisible = ref(false);
const selectedShipType = ref(null);

// Вычисляемые свойства для статистики
const activeShips = computed(() => 
  ships.value.filter(ship => ship.status === 'active' || ship.status === 'falling')
);

const activeShipsCount = computed(() => 
  ships.value.filter(ship => ship.status === 'active').length
);

// Количество падающих кораблей (ещё не разбились)
const fallingShipsCount = computed(() => 
  ships.value.filter(ship => ship.status === 'falling').length
);

const crashedShipsCount = computed(() => 
  ships.value.filter(ship => ship.status === 'crashed').length
);

const totalLaunchedCount = computed(() => ships.value.length);

// Показывать стартовый экран, если нет активных И падающих кораблей и модалка закрыта
// Это предотвращает показ "Добро пожаловать" пока корабль ещё падает
const showStartScreen = computed(() => 
  activeShipsCount.value === 0 && 
  fallingShipsCount.value === 0 && 
  !isLaunchModalVisible.value
);

/**
 * Открывает модальное окно для запуска корабля выбранного типа
 */
function openLaunchModal(shipType) {
  selectedShipType.value = shipType;
  isLaunchModalVisible.value = true;
}

/**
 * Запускает новый корабль с заданным именем
 * Корабль появляется в зоне полёта
 */
function launchShip(shipName) {
  if (!selectedShipType.value || !shipName.trim()) return;

  const shipType = selectedShipType.value;
  
  // Вычисляем безопасную зону полёта
  const minY = FLIGHT_BOUNDS.top;
  const maxY = window.innerHeight - FLIGHT_BOUNDS.bottom - 100;
  
  const newShip = {
    id: ++shipIdCounter,
    name: shipName.trim(),
    type: shipType,
    fuel: shipType.fuelCapacity,  // Полный бак при запуске
    status: 'active',  // active | falling | crashed
    // Начальная позиция: левая граница зоны полёта, случайная высота в пределах зоны
    x: FLIGHT_BOUNDS.left,
    y: minY + Math.random() * (maxY - minY)
  };

  ships.value.push(newShip);
  isLaunchModalVisible.value = false;
  selectedShipType.value = null;
}

/**
 * Открывает выбор корабля (вызывается из стартового экрана)
 */
function openShipSelection() {
  // Выбираем первый тип корабля по умолчанию
  selectedShipType.value = shipTypes.value[0];
  isLaunchModalVisible.value = true;
}

/**
 * Заправляет корабль при клике на него
 * Восстанавливает топливо до максимума
 */
function refuelShip(shipId) {
  const ship = ships.value.find(ship => ship.id === shipId);
  if (ship && ship.status === 'active') {
    ship.fuel = ship.type.fuelCapacity;
  }
}

/**
 * Обрабатывает падение и крушение корабля
 */
function handleCrash(shipId) {
  const ship = ships.value.find(ship => ship.id === shipId);
  if (ship) {
    ship.status = 'crashed';
  }
}
</script>

<style>
/* Глобальные стили для убирания отступов body */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>
