<template>
    <div class="s-memory">
        <!-- Экран выбора сложности -->
        <div v-if="gameState === 'setup'" class="s-memory-setup">
            <h1 class="s-memory-title">Игра Memory</h1>
            <p class="s-memory-subtitle">Выберите уровень сложности</p>
            
            <div class="s-memory-levels">
                <SCard 
                    v-for="level in levels" 
                    :key="level.cards"
                    class="s-memory-level-card"
                    @click="startGame(level.cards)"
                >
                    <span class="s-memory-level-name">{{ level.name }}</span>
                    <span class="s-memory-level-cards">{{ level.cards }} карточек</span>
                </SCard>
            </div>
        </div>

        <!-- Игровой экран -->
        <div v-else-if="gameState === 'playing'" class="s-memory-game">
            <!-- Статистика -->
            <div class="s-memory-stats">
                <div class="s-memory-stat">
                    <span class="s-memory-stat-label">Уровень</span>
                    <span class="s-memory-stat-value">{{ currentLevelName }}</span>
                </div>
                <div class="s-memory-stat">
                    <span class="s-memory-stat-label">Ходов</span>
                    <span class="s-memory-stat-value">{{ moves }}</span>
                </div>
                <div class="s-memory-stat">
                    <span class="s-memory-stat-label">Осталось</span>
                    <span class="s-memory-stat-value">{{ remainingCards }}</span>
                </div>
                <div class="s-memory-stat">
                    <span class="s-memory-stat-label">Время</span>
                    <span class="s-memory-stat-value">{{ formattedTime }}</span>
                </div>
            </div>

            <!-- Игровое поле -->
            <div class="s-memory-board" :style="boardStyle">
                <Card
                    v-for="card in cards"
                    :key="card.id"
                    :number="card.number"
                    :isFlipped="card.isFlipped"
                    :isMatched="card.isMatched"
                    :isDisabled="isProcessing"
                    @flip="flipCard(card)"
                />
            </div>

            <!-- Кнопка рестарта -->
            <SButton color="red" class="s-memory-restart" @click="resetGame">
                Начать заново
            </SButton>
        </div>

        <!-- Экран победы -->
        <div v-else-if="gameState === 'finished'" class="s-memory-finished">
            <h1 class="s-memory-title">Поздравляем!</h1>
            <div class="s-memory-result-emoji">{{ resultEmoji }}</div>
            <p class="s-memory-result-text">{{ resultMessage }}</p>
            
            <div class="s-memory-final-stats">
                <div class="s-memory-final-stat">
                    <span class="s-memory-final-stat-value">{{ moves }}</span>
                    <span class="s-memory-final-stat-label">ходов</span>
                </div>
                <div class="s-memory-final-stat">
                    <span class="s-memory-final-stat-value">{{ formattedTime }}</span>
                    <span class="s-memory-final-stat-label">времени</span>
                </div>
            </div>

            <div class="s-memory-actions">
                <SButton color="green" @click="startGame(totalCards)">
                    Играть снова
                </SButton>
                <SButton color="red" @click="resetGame">
                    Выбрать уровень
                </SButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import Card from "@/components/Card.vue";

// Уровни сложности
const levels = [
    { name: 'Легкий', cards: 12 },
    { name: 'Средний', cards: 24 },
    { name: 'Сложный', cards: 36 }
];

// Состояние игры
const gameState = ref('setup'); // 'setup' | 'playing' | 'finished'
const cards = ref([]);
const totalCards = ref(12);
const moves = ref(0);
const elapsedSeconds = ref(0);
const isProcessing = ref(false);

let timerInterval = null;
let flippedCards = [];

// Название текущего уровня
const currentLevelName = computed(() => {
    const level = levels.find(level => level.cards === totalCards.value);
    return level ? level.name : '';
});

// Оставшиеся карточки
const remainingCards = computed(() => {
    return cards.value.filter(card => !card.isMatched).length;
});

// Форматированное время
const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedSeconds.value / 60);
    const seconds = elapsedSeconds.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Стиль игрового поля (количество колонок)
const boardStyle = computed(() => {
    const cols = totalCards.value <= 12 ? 4 : totalCards.value <= 24 ? 6 : 6;
    return {
        gridTemplateColumns: `repeat(${cols}, 80px)`
    };
});

// Оценка результата
const resultEmoji = computed(() => {
    const optimalMoves = totalCards.value / 2;
    const ratio = moves.value / optimalMoves;
    
    if (ratio <= 1.5) return '🏆';
    if (ratio <= 2) return '🥇';
    if (ratio <= 2.5) return '🥈';
    if (ratio <= 3) return '🥉';
    return '👍';
});

const resultMessage = computed(() => {
    const optimalMoves = totalCards.value / 2;
    const ratio = moves.value / optimalMoves;
    
    if (ratio <= 1.5) return 'Невероятно! Идеальная память!';
    if (ratio <= 2) return 'Отлично! Превосходный результат!';
    if (ratio <= 2.5) return 'Хорошо! Достойный результат!';
    if (ratio <= 3) return 'Неплохо! Можно лучше!';
    return 'Игра завершена! Попробуйте ещё раз!';
});

// Генерация карточек
const generateCards = (count) => {
    const numbers = [];
    const pairsCount = count / 2;
    
    // Создаём пары чисел
    for (let i = 1; i <= pairsCount; i++) {
        numbers.push(i, i);
    }
    
    // Перемешиваем (алгоритм Фишера-Йетса)
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    // Создаём объекты карточек
    return numbers.map((number, index) => ({
        id: index,
        number,
        isFlipped: false,
        isMatched: false
    }));
};

// Запуск таймера
const startTimer = () => {
    stopTimer();
    elapsedSeconds.value = 0;
    timerInterval = setInterval(() => {
        elapsedSeconds.value++;
    }, 1000);
};

// Остановка таймера
const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

// Начать игру
const startGame = (cardCount) => {
    totalCards.value = cardCount;
    cards.value = generateCards(cardCount);
    moves.value = 0;
    flippedCards = [];
    isProcessing.value = false;
    gameState.value = 'playing';
    startTimer();
};

// Сбросить игру (вернуться к выбору уровня)
const resetGame = () => {
    stopTimer();
    gameState.value = 'setup';
    cards.value = [];
    moves.value = 0;
    elapsedSeconds.value = 0;
};

// Переворот карточки
const flipCard = (card) => {
    if (isProcessing.value || card.isFlipped || card.isMatched) {
        return;
    }
    
    card.isFlipped = true;
    flippedCards.push(card);
    
    // Если открыты две карточки — проверяем пару
    if (flippedCards.length === 2) {
        moves.value++;
        isProcessing.value = true;
        
        const [first, second] = flippedCards;
        
        if (first.number === second.number) {
            // Пара найдена
            setTimeout(() => {
                first.isMatched = true;
                second.isMatched = true;
                flippedCards = [];
                isProcessing.value = false;
                
                // Проверяем окончание игры
                if (remainingCards.value === 0) {
                    stopTimer();
                    gameState.value = 'finished';
                }
            }, 500);
        } else {
            // Не совпали — переворачиваем обратно
            setTimeout(() => {
                first.isFlipped = false;
                second.isFlipped = false;
                flippedCards = [];
                isProcessing.value = false;
            }, 1000);
        }
    }
};

// Очистка при размонтировании
onUnmounted(() => {
    stopTimer();
});
</script>

<style lang="scss">
.s-memory {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);

    &-title {
        font-size: 36px;
        font-weight: 700;
        color: var(--text-primary);
        text-align: center;
        margin-bottom: 8px;
        text-shadow: 0 2px 10px var(--shadow-text);
    }

    &-subtitle {
        font-size: 18px;
        color: var(--text-secondary);
        text-align: center;
        margin: 0 0 32px 0;
    }

    // Экран выбора уровня
    &-setup {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &-levels {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }

    &-level-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 24px 32px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        background: var(--bg-card);
        border-radius: 16px;
        box-shadow: 0 4px 20px var(--shadow-card);

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px var(--shadow-card-hover);
        }
    }

    &-level-name {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-dark);
    }

    &-level-cards {
        font-size: 14px;
        color: var(--text-dark-secondary);
    }

    // Игровой экран
    &-game {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    &-stats {
        display: flex;
        gap: 24px;
        background: var(--bg-glass);
        padding: 16px 32px;
        border-radius: 16px;
        backdrop-filter: blur(10px);
    }

    &-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        min-width: 80px;

        &-label {
            font-size: 12px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        &-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
        }
    }

    &-board {
        display: grid;
        gap: 12px;
        padding: 24px;
        background: var(--bg-glass-light);
        border-radius: 20px;
        backdrop-filter: blur(5px);
    }

    // Экран победы
    &-finished {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    &-result-emoji {
        font-size: 80px;
        margin: 16px 0;
    }

    &-result-text {
        font-size: 20px;
        color: var(--text-secondary);
        margin: 0 0 32px 0;
    }

    &-final-stats {
        display: flex;
        gap: 48px;
        margin-bottom: 32px;
    }

    &-final-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        &-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--text-primary);
        }

        &-label {
            font-size: 14px;
            color: var(--text-muted);
        }
    }

    &-actions {
        display: flex;
        gap: 16px;
    }
}
</style>
