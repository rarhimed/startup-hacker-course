import { createApp } from "vue";
import App from "./App.vue";
import "./css/style.scss";

// Подключение startup-ui
import StartupUI from 'startup-ui';
import 'startup-ui/dist/index.css';

const app = createApp(App);
app.use(StartupUI);
app.mount("#app");
