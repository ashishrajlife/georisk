import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './routers';
import '../../usermanagementapp/src/assets/style/styles.css';  // Corrected to 'styles' instead of 'style'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(Vue3Toastify);

app.mount('#app');
