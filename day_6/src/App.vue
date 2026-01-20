<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* Глобальные стили */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
}
</style>
