<template>
<div class="s-timersegment">
    <div class="s-timersegment-display">
        <div class="s-timersegment-number-wrapper">
            <div class="s-timersegment-digits">
                <div 
                    v-for="(digit, index) in formattedNumber" 
                    :key="index"
                    class="s-timersegment-digit-slot"
                >
                    <Transition name="flip" mode="out-in">
                        <span 
                            :key="digit" 
                            class="s-timersegment-digit"
                        >
                            {{ digit }}
                        </span>
                    </Transition>
                </div>
            </div>
        </div>
        <span class="s-timersegment-label">{{ pluralizedLabel }}</span>
    </div>
</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    value: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true,
        validator: (value) => ['days', 'hours', 'minutes', 'seconds'].includes(value)
    }
});

// Форматируем число с ведущим нулём (две цифры)
const formattedNumber = computed(() => {
    const str = String(props.value).padStart(2, '0');
    return str.split('');
});

// Склонения для русского языка
const pluralLabels = {
    days: ['день', 'дня', 'дней'],
    hours: ['час', 'часа', 'часов'],
    minutes: ['минута', 'минуты', 'минут'],
    seconds: ['секунда', 'секунды', 'секунд']
};

// Функция для склонения слов
function getPlural(number, forms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    
    if (n > 10 && n < 20) {
        return forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return forms[1];
    }
    if (n1 === 1) {
        return forms[0];
    }
    return forms[2];
}

const pluralizedLabel = computed(() => {
    return getPlural(props.value, pluralLabels[props.type]);
});
</script>

<style lang="scss">
.s-timersegment {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-display {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }

    &-number-wrapper {
        background: linear-gradient(145deg, var(--bg-segment-start), var(--bg-segment-end));
        border: 2px solid var(--border-segment);
        padding: 16px 12px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 90px;
        box-shadow: 
            0 4px 15px var(--shadow-segment),
            inset 0 1px 0 var(--border-light);
        overflow: hidden;
    }

    &-digits {
        display: flex;
        gap: 4px;
    }

    // Слот фиксированного размера для каждой цифры
    &-digit-slot {
        position: relative;
        width: 32px;
        height: 58px;
        overflow: hidden;
    }

    &-digit {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;
        font-weight: 700;
        color: var(--text-accent);
        text-shadow: 
            0 0 10px var(--glow-cyan),
            0 0 20px rgba(0, 212, 255, 0.3);
        font-variant-numeric: tabular-nums;
    }

    &-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        text-transform: lowercase;
        letter-spacing: 0.5px;
    }
}

// Анимация смены цифр — мягкий fade без движения
.flip-enter-active,
.flip-leave-active {
    transition: opacity 0.4s ease;
}

.flip-enter-from,
.flip-leave-to {
    opacity: 0;
}
</style>
