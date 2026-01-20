<template>
  <div class="about-page">
    <h1>О нас</h1>
    
    <div class="about-content">
      <p>
        Добро пожаловать в нашу библиотеку книг! Мы — команда энтузиастов, которые верят, 
        что каждая книга заслуживает внимания и любви читателей.
      </p>
      
      <h2>Наша миссия</h2>
      <p>
        Помочь вам найти свою следующую любимую книгу. Мы тщательно отбираем произведения 
        различных жанров и эпох, чтобы каждый мог открыть для себя что-то новое и интересное.
      </p>
      
      <h2>Что мы предлагаем</h2>
      <ul>
        <li>Широкий каталог книг разных жанров</li>
        <li>Удобный интерфейс для поиска и фильтрации</li>
        <li>Система рейтингов и отзывов</li>
        <li>Персональные рекомендации</li>
      </ul>
      
      <h2>Контакты</h2>
      <p>
        Если у вас есть вопросы или предложения, свяжитесь с нами по адресу: 
        <strong>books@example.com</strong>
      </p>
    </div>
    
    <div class="back-link">
      <router-link to="/" class="back-button">
        ← Вернуться к каталогу
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
}

h2 {
  font-size: 24px;
  color: #444;
  margin-top: 30px;
  margin-bottom: 15px;
}

.about-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-content p {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 15px;
}

.about-content ul {
  margin: 15px 0;
  padding-left: 25px;
}

.about-content li {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 8px;
}

.back-link {
  margin-top: 30px;
}

/* Кнопка "Вернуться" - синий цвет (как кнопка "О нас" на главной) */
.back-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.back-button:hover {
  background-color: #1976D2;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.back-button:active {
  transform: scale(0.98);
  background-color: #1565C0;
}
</style>
