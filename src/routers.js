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
import AdminCourseChange from './components/AdminCourseChange.vue'
import axios from "axios";
import StudentProgramOutcome from "./components/StudentProgramOutcome.vue";
import AdminCourseResults from './components/AdminCourseResults.vue'
import PoAnalysis from "./components/PoAnalysis.vue";
import AdminPoResults from "./components/AdminPoResults.vue";
import AboutUs from "./components/AboutUs.vue";

const routes = [{
    name: "Login",
    component: Login,
    path: "/"

},
{
    name: "AdminCourseResults",
    component: AdminCourseResults,
    path: "/admin-course-results/:courseId",
    meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
},
{
    name: "InstructorHome",
    component: InstructorHome,
    path: "/instructor-home",
    meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
},
{
    name: "AdminPoResults",
    component: AdminPoResults,
    path: "/admin-po-results",
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
    name: "StudentProgramOutcomePage",
    component: StudentProgramOutcome,
    path: "/student-program-outcomes",
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
    name: "AdminCourseChange",
    component: AdminCourseChange,
    path: "/admin-course",
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
    name: "AddCourseDepartment", //****************** */
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
{
    name: "PoAnalysis",
    component: PoAnalysis,
    path: "/analysis",
    meta: { requiresAuth: true }, // Oturum açma gerektiren sayfaları belirtin
},
{
    name: "AboutUs",
    component: AboutUs,
    path: "/about-us",
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
    '/admin-guide',
    '/admin-course',
    '/admin-course-results/:courseId',
    '/admin-po-results',
    '/about-us',
    '/'
];

const studentAllowedRoutes = [
    '/student-program-outcomes',
    '/student-home',
    '/student-pageMatrix/:courseId',
    '/about-us',
    '/'
];

const instructorAllowedRoutes = [
    '/instructor-home',
    '/Instructor-Student/:courseId/:studentId',
    '/learning-outcome-result/:courseId',
    '/',
    '/student-list/:courseId',
    '/program-outcome-result/:courseId',
    '/student-info/:courseId/:generalAssessmentId',
    '/aloc/:courseId/:generalAssessmentId',
    '/assessment/:courseId/:generalAssessmentId',
    '/course/:courseId',
    '/instructor-match-matrix/:courseId',
    '/course-program-outcome/:courseId',
    '/instructor-learning-outcome/:courseId',
    '/guidance',
    '/about-us',
    '/analysis'
];

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = store.getters['getUser'] !== null; // Kullanıcının oturum açıp açmadığını kontrol edin
    const user = store.getters['getUser']; // Kullanıcı bilgilerini alın

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/'); // Kullanıcı oturum açmamışsa ve sayfa giriş gerektiriyorsa, giriş yapma sayfasına yönlendirin
    } else if (isAuthenticated) {
        if (user.statusCode === 1) {
            // Instructor için kontrol
            try {
                // Kullanıcının kurslarını almak için API çağrısı
                const response = await axios.get(`http://localhost:8080/user-course-registrations/user/${user.userId}/courses`);
                const userCourses = response.data; // Kullanıcının kursları

                // Rotanın courseId parametresi varsa ve kullanıcı bu kursa erişim iznine sahip değilse
                if (to.params.courseId && !userCourses.some(item => item.course.courseId === parseInt(to.params.courseId))) {
                    next('/instructor-home'); // /instructor-home sayfasına yönlendirin
                } else {
                    // Rotanın instructorAllowedRoutes dizisinde olup olmadığını kontrol edin
                    const isRouteAllowed = instructorAllowedRoutes.some(route => {
                        const pathRegex = new RegExp('^' + route.replace(/:\w+/g, '\\d+') + '$');
                        return pathRegex.test(to.path);
                    });

                    if (isRouteAllowed) {
                        next(); // Kullanıcı bu kursa erişim iznine sahipse rotaya izin verin
                    } else {
                        next('/instructor-home'); // İzin verilmeyen rota için /instructor-home sayfasına yönlendirin
                    }
                }
            } catch (error) {
                console.error('Kullanıcının kursları alınırken bir hata oluştu:', error);
                next('/instructor-home'); // Hata durumunda /instructor-home sayfasına yönlendirin
            }
        } else if (user.statusCode === 2) {
            // Student için kontrol
            const isRouteAllowed = studentAllowedRoutes.some(route => {
                const pathRegex = new RegExp('^' + route.replace(/:\w+/g, '\\d+') + '$');
                return pathRegex.test(to.path);
            });

            if (isRouteAllowed) {
                next(); // İzin verilen rotaya yönlendir
            } else {
                next('/student-home'); // Öğrenci varsayılan olarak /student-home sayfasına yönlendirilir
            }
        } else if (user.statusCode === 3) {
            // Admin için kontrol
            const isRouteAllowed = adminAllowedRoutes.some(route => {
                const pathRegex = new RegExp('^' + route.replace(/:\w+/g, '\\d+') + '$');
                return pathRegex.test(to.path);
            });

            if (isRouteAllowed) {
                next(); // İzin verilen rotaya yönlendir
            } else {
                next('/admin-guide'); // Admin varsayılan olarak /admin-guide sayfasına yönlendirilir
            }
        } else {
            next(); // Diğer durumlarda rota değişikliğine izin verin
        }
    } else {
        next(); // Oturum açılmamış kullanıcılar için genel geçiş izni
    }
});

export default router;