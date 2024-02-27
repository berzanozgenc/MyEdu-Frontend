import { createApp } from 'vue';
import App from './App.vue';
import router from './routers';
import VueToast from 'vue-toast-notification';
import store from './store/auth'; 
import 'vue-toast-notification/dist/theme-sugar.css';
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

Vue.use(VueToast)
const app = createApp(App);
app.use(store); 
app.use(router);
app.use(VueToast);

app.mount('#app');
