import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(ElementUI)

import VueMeta from "vue-meta";
Vue.use(VueMeta);

import router from "./router";

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})