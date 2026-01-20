<template>
  <!-- Оверлей модального окна -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="s-launchmodal-overlay" @click.self="handleCancel">
        <div class="s-launchmodal">
          <!-- Заголовок -->
          <div class="s-launchmodal-header">
            <h3 class="s-launchmodal-title">Запуск корабля</h3>
            <button class="s-launchmodal-close" @click="handleCancel">&times;</button>
          </div>
          
          <!-- Контент -->
          <div class="s-launchmodal-content">
            <!-- Превью выбранного корабля -->
            <div v-if="shipType" class="s-launchmodal-ship-preview">
              <img :src="shipType.image" :alt="shipType.name" />
              <div class="s-launchmodal-ship-type">
                {{ shipType.name }}
              </div>
            </div>
            
            <!-- Форма ввода имени -->
            <div class="s-launchmodal-form">
              <input
                ref="inputRef"
                v-model="shipName"
                type="text"
                placeholder="Введите имя корабля"
                class="s-launchmodal-input"
                @keyup.enter="handleLaunch"
              />
              
              <div class="s-launchmodal-actions">
                <button
                  class="s-launchmodal-btn s-launchmodal-btn--outline"
                  @click="handleCancel"
                >
                  Отмена
                </button>
                <button
                  class="s-launchmodal-btn s-launchmodal-btn--solid"
                  :disabled="!isValidName"
                  @click="handleLaunch"
                >
                  Запустить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  shipType: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'launch']);

// Ссылка на поле ввода для автофокуса
const inputRef = ref(null);

// Имя корабля (вводится пользователем)
const shipName = ref('');

// Валидация: имя не должно быть пустым
const isValidName = computed(() => shipName.value.trim().length > 0);

/**
 * Запуск корабля
 */
function handleLaunch() {
  if (!isValidName.value) return;
  
  emit('launch', shipName.value);
  shipName.value = '';
}

/**
 * Отмена запуска
 */
function handleCancel() {
  emit('update:visible', false);
  shipName.value = '';
}

// Автофокус на поле ввода при открытии модалки
watch(() => props.visible, (newValue) => {
  if (newValue) {
    shipName.value = '';
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});
</script>
