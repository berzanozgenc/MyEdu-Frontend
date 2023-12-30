import Login from "./components/Login.vue";
import InstructorHome from "./components/InstructorHome.vue";
import Course from "./components/Course.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [{
        name: "Login",
        component: Login,
        path: "/"

    },
    {
        name: "InstructorHome",
        component: InstructorHome,
        path: "/instructor-home"
    },
    {
        name: "Course",
        component: Course,
        path: "/course"
    }


];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;