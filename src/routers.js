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
import CourseProgramOutcome from "./components/CourseProgramOutcome.vue";
import Aloc from "./components/Aloc.vue";
import StudentList from "./components/StudentList.vue";
import StudentHome from "./components/StudentHome.vue";
import GuidePage from "./components/GuidePage.vue";
import AdminGuide from "./components/AdminGuide.vue";

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
        name: "AdminGuide",
        component: AdminGuide,
        path: "/admin-guide",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },
    {
        name: "GuidePage",
        component: GuidePage,
        path: "/guidance",
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
        path: "/program-output-admin",
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
        name: "StudentHome",
        component: StudentHome,
        path: "/student-home",
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
        path: "/student-pageMatrix/:courseId",
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
        path: "/Instructor-Student/:courseId/:studentId",
        meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const adminAllowedRoutes = [
    '/add-course', 
    '/admin-home',
    '/admin-load-student',
    '/program-output-admin',
    '/admin-guide'
  ];

  const studentAllowedRoutes = [
    '/student-home', 
    '/student-pageMatrix/:courseId'
  ];
  
  router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['getUser'] !== null; // Kullanıcının oturum açıp açmadığını kontrol edin
    const user = store.getters['getUser']; // Kullanıcı bilgilerini alın
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Kullanıcı oturum açmamışsa ve sayfa giriş gerektiriyorsa, giriş yapma sayfasına yönlendirin
    } else if (isAuthenticated) {
        // Kullanıcı oturum açtıysa
        if (user.statusCode === 1) {
            // Kullanıcı durum kodu 1 (belirtilmemiş) ise tüm rotalara izin ver
            next();
        } else if (user.statusCode === 2) {
            // Kullanıcı durum kodu 2 (öğrenci) ise
            if (studentAllowedRoutes.includes(to.matched[0].path)) {
                next(); // İzin verilen rotaya yönlendir
            } else {
                next('/student-home'); // Öğrenci varsayılan olarak /student-home sayfasına yönlendirilir
            }
        } else if (user.statusCode === 3) {
            // Kullanıcı durum kodu 3 (admin) ise
            if (adminAllowedRoutes.includes(to.matched[0].path)) {
                next(); // İzin verilen rotaya yönlendir
            } else {
                next('/admin-guide'); // Admin izin verilen rotalardan birine gitmeye çalışmıyorsa, varsayılan olarak /add-course sayfasına yönlendir
            }
        }
    } else {
        next(); // Diğer durumlarda rota değişikliğine izin verin
    }
});

  
  
  


export default router;