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
import store from "./store/auth";
import StudentPage from "./components/StudentPage.vue";
import StudentPageMatrix from "./components/Student-PageMatrix.vue";
const routes = [{
        name: "Login",
        component: Login,
        path: "/"

    },
    {
        name: "InstructorHome",
        component: InstructorHome,
        path: "/instructor-home",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "InstructorLearningOutcome",
        component: InstructorLearningOutcome,
        path: "/instructor-learning-outcome/:courseId", // courseId parametresi için dinamik yol tanımı
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
      },
{
        name: "MatchMatrix",
        component: MatchMatrix,
        path: "/instructor-match-matrix/:courseId", //courseId parametresi için dinamik yol tanımı
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "Course",
        component: Course,
        path: "/course/:courseId",  // courseId parametresi için dinamik yol tanımı
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "LearningOutcome",
        component: LearningOutcome,
        path: "/learning-outcome/:courseId/:generalAssessmentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "StudentInfo",
        component: StudentInfo,
        path: "/student-info/:courseId/:generalAssessmentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "AdminPage",
        component: AdminPageVue,
        path: "/program-output",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    
    {
        name: "AddCoursePage",
        component: AddCoursePage,
        path: "/add-course",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "AdminLoadStudentPage",
        component: AdminLoadStudentPage,
        path: "/admin-load-student",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "AdminHome",
        component: AdminHome,
        path: "/admin-home",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "StudentPage",
        component: StudentPage,
        path: "/student-page",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "StudentPageMatrix",
        component: StudentPageMatrix,
        path: "/student-pageMatrix",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard tanımlayın
router.beforeEach((to, from, next) => {
    // Kullanıcının oturum durumunu kontrol edin
    const isAuthenticated = store.getters.getUser !== null;
    
    // Rota giriş yapma gerektiriyorsa ve kullanıcı giriş yapmamışsa, Login sayfasına yönlendirin
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next(); // Diğer durumlarda rota değişikliğine izin verin
    }
});

 
export default router;