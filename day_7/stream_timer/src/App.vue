<template>
    <div class="s-streamtimer">
        <div class="s-streamtimer-box">
            <TimerHeader 
                title="Будем в эфире через" 
                :isLive="isLive" 
            />
            
            <div class="s-streamtimer-content">
                <Transition name="fade-scale" mode="out-in">
                    <div v-if="!isLive" class="s-streamtimer-display" key="timer">
                        <TimerSegment :value="timeRemaining.days" type="days" />
                        <span class="s-streamtimer-separator">:</span>
                        <TimerSegment :value="timeRemaining.hours" type="hours" />
                        <span class="s-streamtimer-separator">:</span>
                        <TimerSegment :value="timeRemaining.minutes" type="minutes" />
                        <span class="s-streamtimer-separator">:</span>
                        <TimerSegment :value="timeRemaining.seconds" type="seconds" />
                    </div>
                    <div v-else class="s-streamtimer-live-message" key="live">
                        <span class="s-streamtimer-live-emoji">🎬</span>
                        <p>Трансляция началась!</p>
                    </div>
                </Transition>
            </div>

            <!-- Настройка даты стрима (для демонстрации) -->
            <div class="s-streamtimer-settings" @click="openDatePicker">
                <span class="s-streamtimer-settings-label">Дата стрима:</span>
                <span class="s-streamtimer-settings-value">{{ formattedTargetDate }}</span>
                <input 
                    ref="dateInputRef"
                    type="datetime-local" 
                    v-model="targetDateInput" 
                    class="s-streamtimer-settings-input"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import TimerHeader from "@/components/TimerHeader.vue";
import TimerSegment from "@/components/TimerSegment.vue";

// Дата стрима по умолчанию — через 2 дня от текущего момента
const getDefaultStreamDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(19, 0, 0, 0);
    return date;
};

// Форматирование даты для input datetime-local
const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const targetDate = ref(getDefaultStreamDate());
const targetDateInput = ref(formatDateForInput(targetDate.value));
const now = ref(new Date());
const dateInputRef = ref(null);
let intervalId = null;

// Форматирование даты для отображения пользователю
const formattedTargetDate = computed(() => {
    const date = targetDate.value;
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
});

// Открытие date picker по клику на блок
const openDatePicker = () => {
    if (dateInputRef.value) {
        dateInputRef.value.showPicker();
    }
};

// Отслеживаем изменение даты в input
watch(targetDateInput, (newValue) => {
    if (newValue) {
        targetDate.value = new Date(newValue);
    }
});

// Вычисление оставшегося времени
const timeRemaining = computed(() => {
    const diff = targetDate.value.getTime() - now.value.getTime();
    
    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
});

// Проверка, наступило ли время стрима
const isLive = computed(() => {
    return targetDate.value.getTime() <= now.value.getTime();
});

// Обновление текущего времени каждую секунду
const startTimer = () => {
    intervalId = setInterval(() => {
        now.value = new Date();
    }, 1000);
};

const stopTimer = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    stopTimer();
});
</script>

<style lang="scss">
.s-streamtimer {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);

    &-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 580px;
        padding: 40px 50px;
        background: var(--bg-box);
        border: 1px solid var(--border-light);
        border-radius: 24px;
        box-shadow: 
            0 20px 60px var(--shadow-box),
            0 0 40px var(--glow-cyan-strong);
        backdrop-filter: blur(10px);
    }

    // Контейнер фиксированного размера для предотвращения прыжков
    &-content {
        height: 120px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    &-display {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
    }

    &-separator {
        font-size: 48px;
        font-weight: 700;
        color: var(--text-accent);
        padding-top: 6px;
        text-shadow: 0 0 10px var(--glow-cyan);
    }

    &-live-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;

        p {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-accent);
            margin: 0;
            text-shadow: 0 0 20px var(--glow-cyan);
        }
    }

    &-live-emoji {
        font-size: 48px;
        animation: bounce 1s ease-in-out infinite;
    }

    &-settings {
        margin-top: 32px;
        padding: 16px 24px;
        border: 1px solid var(--border-light);
        border-radius: 12px;
        background: var(--bg-settings);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: border-color 0.3s ease, background 0.3s ease;
        position: relative;

        &:hover {
            border-color: var(--border-accent);
            background: var(--bg-settings-hover);
        }

        &-label {
            font-size: 14px;
            color: var(--text-secondary);
        }

        &-value {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-accent);
        }

        &-input {
            // Скрываем input, но оставляем его функциональным
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
        }
    }
}

// Анимация подпрыгивания эмодзи
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

// Fade переход (без scale, чтобы не дёргалось)
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: opacity 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
}
</style>
