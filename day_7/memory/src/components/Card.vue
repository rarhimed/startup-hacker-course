<template>
    <div 
        class="s-card" 
        :class="{ 
            's-card--flipped': isFlipped, 
            's-card--matched': isMatched,
            's-card--disabled': isDisabled
        }"
        @click="handleClick"
    >
        <div class="s-card-inner">
            <div class="s-card-front">
                <span class="s-card-icon">?</span>
            </div>
            <div class="s-card-back">
                <span class="s-card-number">{{ number }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    number: {
        type: Number,
        required: true
    },
    isFlipped: {
        type: Boolean,
        default: false
    },
    isMatched: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['flip']);

const handleClick = () => {
    if (!props.isFlipped && !props.isMatched && !props.isDisabled) {
        emit('flip');
    }
};
</script>

<style lang="scss">
.s-card {
    width: 80px;
    height: 100px;
    perspective: 1000px;
    cursor: pointer;
    
    &--matched {
        visibility: hidden;
        pointer-events: none;
    }
    
    &--disabled {
        pointer-events: none;
    }
    
    &-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.5s ease;
        transform-style: preserve-3d;
    }
    
    &--flipped &-inner {
        transform: rotateY(180deg);
    }
    
    &-front,
    &-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 12px var(--shadow-card);
    }
    
    &-front {
        background: linear-gradient(145deg, var(--card-front-start), var(--card-front-end));
        border: 2px solid var(--card-front-border);
    }
    
    &-back {
        background: linear-gradient(145deg, var(--card-back-start), var(--card-back-end));
        border: 2px solid var(--card-back-border);
        transform: rotateY(180deg);
    }
    
    &-icon {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-secondary);
        text-shadow: 0 2px 4px var(--shadow-text);
    }
    
    &-number {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-dark);
    }
    
    &:hover:not(&--flipped):not(&--matched):not(&--disabled) {
        .s-card-inner {
            transform: scale(1.05);
        }
    }
}
</style>
