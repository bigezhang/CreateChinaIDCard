import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import CreateChinaIDCard from './pages/CreateChinaIDCard';

export default new VueRouter({
	routes: [{
		path: "/",
		component: CreateChinaIDCard
	}]
});