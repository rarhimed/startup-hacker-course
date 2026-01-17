<template>
<div class="app">
    <!-- Обертка Dialog в компонент Transition для анимации появления/исчезновения -->
    <Transition name="dialog">
        <Dialog v-if="showBookForm" :title="currentBook?.id ? 'Редактировать книгу' : 'Добавить книгу'" @close="hideForm()">
            <BookForm v-if="showBookForm" :modelValue="currentBook"
            @update:modelValue="saveBook" @cancel="hideForm" />
        </Dialog>
    </Transition>
    <div class="book-actions-list-wrapper">
        <div class="book-actions-list-info">
            <span>Кол-во книг: {{ totalBooks }}</span>
            <span> / </span>
            <span>Средний рейтинг: {{ averageRating }}</span>
        </div>
        <div class="book-actions-list-actions">
            <button @click="removeRatings">Сбросить рейтинг</button>
            <button :class="{ 'button-primary': !showBookForm, 'button-disabled': showBookForm }"
                @click="showForm" :disabled="showBookForm" >
                Добавить книгу
            </button>
        </div>
    </div>
    <div class="book-list">
        <!-- ИСПРАВЛЕНИЕ БАГА #1: Было v-bind:update:rating, должно быть @update:rating 
             v-bind передает значение как prop, а для события нужен @ (v-on) -->
        <BookCard v-for="book in books" :key="book.id" :book="book"
            @update:rating="updateRating" @edit="editBook" @remove="removeBook" />
    </div>
</div>
</template>

<script setup>
import BookCard from "@/BookCard.vue";
import { items } from "./books.json";
import { computed, ref, defineAsyncComponent } from "vue";

const Dialog = defineAsyncComponent(() => import("@/Dialog.vue"));
const BookForm = defineAsyncComponent(() => import("@/BookForm.vue"));

const books = ref(items);
const currentBook = ref();
function updateRating(id, rating) {
    books.value = books.value.map((book) => {
    if (book.id === id) {
        book.rating = rating;
    }
    return book;
    });
}
// ИСПРАВЛЕНИЕ БАГА #3: Было books.value.filter(...) без присвоения
// Метод filter() не изменяет исходный массив, а возвращает новый, поэтому нужно присвоить результат
function removeBook(id) {
    books.value = books.value.filter((book) => book.id !== id);
}
// ИСПРАВЛЕНИЕ БАГА #2: Было currentBook.value = books.value.find(...)
// Это присваивало ссылку на объект из массива, а не копию, поэтому редактирование меняло исходный объект
// Теперь создаем копию через spread-оператор { ...book }, чтобы форма работала с копией
function editBook(id) {
    const book = books.value.find((book) => book.id === id);
    currentBook.value = book ? { ...book } : null;
    showForm();
}
function saveBook(data) {
    const isNew = !books.value.find((book) => book.id === data.id);
    if (isNew) {
        addBook(data);
    } else {
        updateBook(data);
    }
}

// ИСПРАВЛЕНИЕ БАГА #4: В строке return было return data; для всех книг
// Это заменяло все книги на редактируемую. Теперь возвращаем текущий элемент m для несовпадающих id
function updateBook(data) {
    books.value = books.value.map((m) => {
    if (m.id === data.id) {
        data.rating = m.rating;
        return data;
    }
    return m; // Исправлено: было return data;
    });
    hideForm();
}
function addBook(data) {
    books.value.push(data);
    hideForm();
}

const showBookForm = ref(false);
function hideForm() {
    showBookForm.value = false;
    currentBook.value = null;
}
function showForm() {
    showBookForm.value = true;
}
const averageRating = computed(() => {
    const avg = books.value.map((book) => parseInt(book.rating || 0)).reduce((a, b) => a + b, 0);
    return Number(avg / books.value.length).toFixed(1);
});
const totalBooks = computed(() => {
    return books.value.length;
});
function removeRatings() {
    books.value = books.value.map((book) => {
        book.rating = null;
        return book;
    });
}
</script>
<style lang="scss">
.book {
    &-list {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    &-actions {
        &-list {
            &-wrapper {
                margin-bottom: 20px;
            }
            &-info {
                margin-bottom: 20px;
            }
            &-actions {
                display: flex;
                gap: 20px;
            }
        }
    }
}

/* Анимация для модального окна Dialog */
/* Fade-in + Slide-up эффект - оба работают одновременно */

/* Активное состояние анимации - определяет длительность и тип перехода */
.dialog-enter-active,
.dialog-leave-active {
    transition: all 0.3s ease-out;
}

/* Начальное состояние при появлении (enter) и конечное при исчезновении (leave) */
/* Элемент невидим (opacity: 0) и сдвинут вниз (translateY: 30px) */
.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
