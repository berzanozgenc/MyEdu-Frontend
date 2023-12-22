import LoginVue from "./components/Login.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        name: "Login",
        component: Login,
        path: "/login"

    }   





];


const router = createRouter({
    history: createWebHistory(),
    rotues,
});