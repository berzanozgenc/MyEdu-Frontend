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
import StudentPageMatrix from "./components/StudentPageMatrix.vue";
import ProgramOutcomeResult from "./components/ProgramOutcomeResult.vue";
import LearningOutcomeResult from "./components/LearningOutcomeResult.vue";
import AddCourseDepartment from "./components/AddCourseDepartment.vue";
import InstructorStudent from "./components/InstructorStudent.vue";
import DepartmentAdminPage from "./components/DepartmentAdminPage.vue";
import CourseProgramOutcome from "./components/CourseProgramOutcome.vue";
import Aloc from "./components/Aloc.vue";
import StudentList from "./components/StudentList.vue";

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
        name: "CourseProgramOutcome",
        component: CourseProgramOutcome,
        path: "/course-program-outcome/:courseId", // courseId parametresi için dinamik yol tanımı
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
        path: "/course/:courseId", // courseId parametresi için dinamik yol tanımı
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "LearningOutcome",
        component: LearningOutcome,
        path: "/assessment/:courseId/:generalAssessmentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "Aloc",
        component: Aloc,
        path: "/aloc/:courseId/:generalAssessmentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "StudentInfo",
        component: StudentInfo,
        path: "/student-info/:courseId/:generalAssessmentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "ProgramOutcomeResult",
        component: ProgramOutcomeResult,
        path: "/program-outcome-result/:courseId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "AdminPage",
        component: AdminPageVue,
        path: "/program-output",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "DepartmentAdminPage",
        component: DepartmentAdminPage,
        path: "/department-admin-page",
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
        name: "StudentList",
        component: StudentList,
        path: "/student-list/:courseId",
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
    {
        name: "LearningOutcomeResult",
        component: LearningOutcomeResult,
        path: "/learning-outcome-result/:courseId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "AddCourseDepartment",
        component: AddCourseDepartment,
        path: "/addCourse-Department",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "InstructorStudent",
        component: InstructorStudent,
        path: "/Instructor-Student",
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