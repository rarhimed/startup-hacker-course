import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './font-awesome.js';

// Подключение startup-ui
import StartupUI from 'startup-ui';
import 'startup-ui/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(StartupUI);
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount("#app");
