import { defaultConfig, plugin } from '@formkit/vue';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import BasicForm from './routes/BasicForm.vue';
import FormKit from './routes/FormKit.vue';
import Hidden from './routes/Hidden.vue';
import Home from './routes/Home.vue';
import './style.scss';

const routes = [
  { path: '/', component: Home },
  { path: '/basic', component: BasicForm },
  { path: '/hidden', component: Hidden },
  { path: '/formkit', component: FormKit }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.use(plugin, defaultConfig);
app.mount('#app');
