<template>
<form @submit.prevent="savebook" class="book-form">
    <input type="hidden" name="id" v-model="form.id" />
    <div class="book-form-input">
        <label for="name">Название</label>
        <!-- Template ref для автоматического фокуса при открытии формы -->
        <input ref="nameInputRef" type="text" name="name" v-model="form.name"/>
        <span class="book-form-error">{{ errors.name }}</span>
    </div>
    <div class="book-form-input">
        <label for="description">Описание</label>
        <textarea type="text" name="description" v-model="form.description" class="book-form-textarea" />
        <span class="book-form-error">{{ errors.description }}</span>
    </div>
    <div class="book-form-input">
        <label for="image">Обложка</label>
        <input type="text" name="image" v-model="form.image" />
        <span class="book-form-error">{{ errors.image }}</span>
    </div>
    <div class="book-form-input">
        <label for="genre">Жанры</label>
        <select name="genre" v-model="form.genres" multiple>
            <option v-for="option in genres" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>
        <span class="book-form-error">{{ errors.genres }}</span>
    </div>
    <div class="book-form-input">
        <label for="genre" class="book-form-checkbox-label">
            <input type="checkbox" v-model="form.inTheaters" :true-value="true" :false-value="false" class="book-form-checkbox" />
            <span>18+</span>
        </label>
        <span class="book-form-error">{{ errors.inTheaters }}</span>
    </div>
    <div class="book-form-actions">
        <button type="button" class="button" @click="cancelForm">Отменить</button>
        <button type="submit">
            <span v-if="form.id">Сохранить</span>
            <span v-else>Создать</span>
        </button>
    </div>
</form>
</template>
<script setup>
import { reactive, ref, watch, nextTick } from "vue";
import { debounce } from "lodash";

const emit = defineEmits(["update:modelValue", "cancel"]);
const props = defineProps({
    modelValue: { type: Object, default: null },
});

// Template ref для поля ввода названия книги
const nameInputRef = ref(null);

const genres = reactive([
    { text: "Драма", value: "Драма" },
    { text: "Детектив", value: "Детектив" },
    { text: "Приключения", value: "Приключения" },
    { text: "Философия", value: "Философия" },
]);
const errors = reactive({
    name: null,
    description: null,
    image: null,
    inTheaters: null,
    genres: null,
    rating: null,
});

const form = reactive({
    id: props.modelValue?.id,
    name: props.modelValue?.name,
    description: props.modelValue?.description,
    image: props.modelValue?.image,
    inTheaters: props.modelValue?.inTheaters || false,
    genres: props.modelValue?.genres || [],
    rating: props.modelValue?.rating || null,
});

const validations = reactive({
    name: "required",
    genres: "required",
});

const validationRules = (rule) => {
    if (rule === "required") return /^ *$/;

    return null;
};

function validate() {
    let valid = true;
    clearErrors();
    for (const [field, rule] of Object.entries(validations)) {
    const validation = validationRules(rule);
    if (validation) {
        if (validation.test(form[field] || "")) {
        errors[field] = `${field} is ${rule}`;
        valid = false;
        }
    }
    }

    return valid;
}
function cancelForm() {
    cleanUpForm();
    emit("cancel");
}

function savebook() {
    if (validate()) {
    const data = {
        id: form.id || Number(Date.now()),
        name: form.name,
        description: form.description,
        image: form.image,
        genres: form.genres,
        inTheaters: form.inTheaters,
        rating: form.rating,
    };
    emit("update:modelValue", data);
    }
}

function cleanUpForm() {
    form.name = null;
    form.description = null;
    form.image = null;
    form.genres = null;
    form.inTheaters = false;
    clearErrors();
}

function clearErrors() {
    errors.name = null;
    errors.description = null;
    errors.image = null;
    errors.genres = null;
    errors.inTheaters = null;
}

// Автоматический фокус на поле названия при открытии формы
// Следим за изменением modelValue (когда форма открывается)
watch(
    () => props.modelValue,
    async () => {
        // nextTick гарантирует, что DOM уже обновлен и элемент существует
        await nextTick();
        // Устанавливаем фокус на поле ввода названия
        if (nameInputRef.value) {
            nameInputRef.value.focus();
        }
    },
    { immediate: true } // immediate: true - выполнить сразу при монтировании компонента
);

// Имитация отложенной отправки на сервер с использованием debounce
// Создаем debounced функцию, которая будет вызвана через 500мс после последнего изменения
const sendToServer = debounce((text) => {
    console.log(`Отправили ${text} на сервер`);
}, 500);

// Наблюдатель на поле ввода названия книги
// Вызывается каждый раз, когда пользователь вводит текст
watch(
    () => form.name,
    (newValue) => {
        // Если поле не пустое, вызываем debounced функцию
        if (newValue) {
            sendToServer(newValue);
        }
    }
);
</script>
<style lang="scss">
.book-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;

    label {
        display: inline-block;
        width: 100px;
    }

    &-actions {
        display: flex;
        gap: 10px;
    }
}
</style>