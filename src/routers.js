import Login from "./components/Login.vue";
import InstructorHome from "./components/InstructorHome.vue";
import Course from "./components/Course.vue";
import LearningOutcome from "./components/LearningOutcomes.vue";
import StudentInfo from "./components/StudentInfo.vue";
import AdminPageVue from "./components/AdminPage.vue";
import AddCoursePage from "./components/AddCoursePage.vue";
import AdminLoadStudentPage from "./components/AdminLoadStudentPage.vue";
import InstructorLearningOutcome from "./components/InstructorLearningOutcome.vue";
import MatchMatrix from "./components/MatchMatrix.vue";
import AdminHome from "./components/AdminHome.vue";
import { createRouter, createWebHistory } from "vue-router";


const routes = [{
        name: "Login",
        component: Login,
        path: "/"

    },
    {
        name: "InstructorHome",
        component: InstructorHome,
        path: "/instructor-home",
    },
    {
        name: "InstructorLearningOutcome",
        component: InstructorLearningOutcome,
        path: "/instructor-learning-outcome/:courseId" // courseId parametresi için dinamik yol tanımı
      },
{
        name: "MatchMatrix",
        component: MatchMatrix,
        path: "/instructor-match-matrix/:courseId" //courseId parametresi için dinamik yol tanımı
    },
    {
        name: "Course",
        component: Course,
        path: "/course/:courseId"  // courseId parametresi için dinamik yol tanımı
    },
    {
        name: "LearningOutcome",
        component: LearningOutcome,
        path: "/learning-outcome"
    },
    {
        name: "StudentInfo",
        component: StudentInfo,
        path: "/student-info"
    },
    {
        name: "AdminPage",
        component: AdminPageVue,
        path: "/program-output"
    },
    
    {
        name: "AddCoursePage",
        component: AddCoursePage,
        path: "/add-course"
    },
    {
        name: "AdminLoadStudentPage",
        component: AdminLoadStudentPage,
        path: "/admin-load-student"
    },
    {
        name: "AdminHome",
        component: AdminHome,
        path: "/admin-home"
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;