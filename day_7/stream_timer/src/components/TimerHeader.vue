<template>
    <div class="s-timerheader">
        <h1 v-if="isLive" class="s-timerheader-title live" :key="'live'">
            <span class="s-timerheader-live-indicator"></span>
            В эфире
        </h1>
        <h1 v-else class="s-timerheader-title" :key="'countdown'">{{ title }}</h1>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: 'Будем в эфире через'
    },
    isLive: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="scss">
.s-timerheader {
    margin-bottom: 24px;
    text-align: center;

    &-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
        letter-spacing: 1px;
        text-transform: uppercase;

        &.live {
            color: var(--text-live);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            animation: pulse 2s ease-in-out infinite;
        }
    }

    &-live-indicator {
        width: 16px;
        height: 16px;
        background-color: var(--text-live);
        border-radius: 50%;
        animation: blink 1s ease-in-out infinite;
        box-shadow: 0 0 10px var(--glow-red);
    }
}

// Анимация пульсации для текста "В эфире"
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

// Анимация мигания индикатора
@keyframes blink {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(0.9);
    }
}
</style>
