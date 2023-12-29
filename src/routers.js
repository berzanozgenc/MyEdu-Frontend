import Login from "./components/Login.vue";
import InstructorHome from "./components/InstructorHome.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        name: "Login",
        component: Login,
        path: "/"

    },  
    {
        name: "InstructorHome",
        component: InstructorHome,
        path: "/instructor-home"
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;