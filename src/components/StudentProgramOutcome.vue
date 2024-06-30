<template>
    <div>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px" />
            </a>
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                Kişiselleştirilmiş Akademik Gelişim ve <br />
                Değerlendirme Sistemi
            </a>
            <div v-if="course" style="margin: 0 auto; margin-top: 2%">
                <h5>{{ course.code }} {{ course.courseName }}</h5>
            </div>
            <div style="margin-left: auto; margin-right: 2%" class="ml-auto d-flex align-items-center">
                <span class="d-flex align-items-center">
                    <img style="margin-right: 2px" class="icon" src="../assets/profile.png" />
                    <h6 class="mb-0 ml-2">{{ username }}</h6>
                </span>
                <button style="margin-left: 8px" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0"
                    type="submit">
                    Çıkış Yap
                </button>
            </div>
        </nav>

        <!-- Flex container -->
        <div class="flex-container">
            <!-- Side Menu -->
            <div class="card menu" style="width: 12%; margin-left: 10px">
                <div class="card-body">
                    <h5 class="card-title">Menü</h5>
                    <ul class="list-group">
                        <li class="list-group-item" @click="goToCoursePage">
                            <i class="fas fa-book"></i> Derslerim
                        </li>
                    </ul>
                </div>
            </div>
            <div class="card" style="width: 80%; margin-left: 2%; overflow-x: auto">
                <div class="card-body">
                    <h5 style="color: #dc3545" class="card-title">
                        Program Çıktıları - Öğrenci Sağlama Düzeyleri
                    </h5>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th style="vertical-align: top" scope="col">No</th>
                                <th style="vertical-align: top" scope="col">Tanım</th>
                                <th style="text-align: center" scope="col">
                                    PÇ Sağlama Düzeyi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(outcome, index) in weightedAverages" :key="index">
                                <td class="description-cell">{{ outcome.no }}</td>
                                <td class="description-cell">{{ outcome.programOutcome }}</td>
                                <td style="text-align: center;" class="description-cell">{{
                outcome.weightedAverage.toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import axios from "axios";
import { mapGetters } from "vuex";
import { useStore } from "vuex";

export default {
    name: "StudentProgramOutcomePage",
    data() {
        return {
            outcomes: [],
            userCourses: [],
            studentProgramOutcomes: [],
            weightedAverages: [],
            userId: null,
        };
    },
    computed: {
        ...mapGetters(["getUser"]),
        username() {
            const user = this.getUser;
            return user ? `${user.firstName} ${user.lastName}` : "";
        },
    },
    created() {
        this.calculateStudentLOValues()
        .then(() => this.fetchUserCourses())
        this.fetchProgramOutcomes();
    },
    methods: {
        async calculateStudentLOValues() {
            try {
                const store = useStore(); // Vuex store'u al
                const student = store.getters.getUser;
                const userId = student.userId;
                this.userId = userId;
                const studentId = student.userId;
                await axios
                    .get(`http://localhost:8080/student-course/${studentId}/courses`)
                    .then((response) => {
                        this.userCourses = response.data;
                    })
                    .catch((error) => {
                        console.error("Hata:", error);
                    });
                for (let i = 0; i < this.userCourses.length; i++) {
                    const courseId = this.userCourses[i].courseId;
                    const response = await axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}`);
                    const learningOutcomeList = response.data;
                    const requestBody = {
                        userId: userId,
                        learningOutcomeList: learningOutcomeList
                    };
                    await axios.post(`http://localhost:8080/student-learning-outcome`, requestBody);
                    this.calculateStudentValuesPO(student, courseId);
                }
            } catch (error) {
                console.error("Error calculate student calculation values:", error);
            }
        },
        async calculateStudentValuesPO(student, id) {
            const courseId = id;
            const userId = student.userId;
            console.log("ögrenci", userId ,"ders", courseId)
            try {
                const responseDepartment = await axios.get(`http://localhost:8080/course/get-department/course/${courseId}`);
                const departmentId = responseDepartment.data.id;
                const response = await axios.get(`http://localhost:8080/program-outcomes/department/${departmentId}`);
                const programOutcomeList = response.data;
                console.log("polist",programOutcomeList)
                const requestBody = {
                    userId: userId,
                    programOutcomeList: programOutcomeList
                };
                await axios.post(`http://localhost:8080/student-program-outcome/${courseId}`, requestBody);
            } catch (error) {
                console.error("Error calculate student calculation values:", error);
            }
        },
        async fetchUserCourses() {
            
            const userId = this.userId;
            const studentId = userId;

            axios
                .get(`http://localhost:8080/student-course/${studentId}/courses`)
                .then((response) => {
                    this.userCourses = response.data;
                    this.calculateValues();
                })
                .catch((error) => {
                    console.error("Hata:", error);
                });
        },
        async calculateValues() {
            try {
                for (let i = 0; i < this.userCourses.length; i++) {
                    const courseId = this.userCourses[i].courseId;
                    const departmentId = this.userCourses[i].department.id;
                    const response = await axios.get(
                        `http://localhost:8080/program-outcomes/department/${departmentId}`
                    );
                    const programOutcomes = response.data;
                    const requestBody = {
                        userId: this.userId,
                        programOutcomeList: programOutcomes,
                    };
                    await axios.post(
                        `http://localhost:8080/student-program-outcome/${courseId}`,
                        requestBody
                    );
                }
            } catch (error) {
                console.error("Error calculate program outcome values:", error);
            }
        },
        async fetchProgramOutcomes() {
            try {
                const store = useStore(); // Vuex store'u al
                const departmentId = store.getters.getUser.department.id;
                const response = await axios.get(
                    `http://localhost:8080/program-outcomes/department/${departmentId}`
                );
                this.outcomes = response.data;
                this.outcomes.sort((a, b) => a.number - b.number);
                this.getProgramOutcomeResults();
            } catch (error) {
                console.error("Error fetching program outcomes:", error);
            }
        },
        async getProgramOutcomeResults() {
            const studentId = this.userId;
            for (let i = 0; i < this.outcomes.length; i++) {
                const programOutcomeId = this.outcomes[i].id;
                const response = await axios.get(
                    `http://localhost:8080/student-program-outcome/getByStudentAndProgram/student/${studentId}/program/${programOutcomeId}`
                );
                this.studentProgramOutcomes.push(response.data);
            }
            let weightedAverages = [];

            for (let j = 0; j < this.studentProgramOutcomes.length; j++) {
                let totalEcts = 0;
                let weightedSum = 0;

                for (let k = 0; k < this.studentProgramOutcomes[j].length; k++) {
                    let course = this.studentProgramOutcomes[j][k].course;
                    let levelOfProvision =
                        this.studentProgramOutcomes[j][k].levelOfProvision;
                    let ects = course.ects;

                    weightedSum += levelOfProvision * ects;
                    totalEcts += ects;
                }

                let weightedAverage = weightedSum / totalEcts;
                let description = this.studentProgramOutcomes[j][0].programOutcome.description;
                let no = this.studentProgramOutcomes[j][0].programOutcome.number;

                // program outcome ve weighted average'i saklayan nesneyi weightedAverages array'ine ekliyoruz
                weightedAverages.push({ programOutcome: description, no: no, weightedAverage: weightedAverage });
            }

            this.weightedAverages = weightedAverages;
        },
        goToLoginPage() {
            this.$router.push("/"); // Login page
        },
        goToCoursePage() {
            this.$router.push("/instructor-home");
        },
        goToStudentInfoPage() {
            this.$router.push("/student-info");
        },
        goToMatchMatrixPage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({
                name: "MatchMatrix",
                params: { courseId: courseId },
            });
        },
        goToInstructorLearningOutcomePage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({
                name: "InstructorLearningOutcome",
                params: { courseId: courseId },
            });
        },
        goToCourseProgramOutcomePage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({
                name: "CourseProgramOutcome",
                params: { courseId: courseId },
            });
        },
        goToInstructorLearningOutcome() {
            this.$router.push("/instructor-learning-outcome");
        },
        goToGuidePage() {
            this.$router.push("/guidance");
        },
        goToStudentListPage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({
                name: "StudentList",
                params: { courseId: courseId },
            });
        },
        refreshPage() {
            this.$router.push("/instructor-home");
        },
        async logoutUser() {
            const router = useRouter();
            localStorage.removeItem("store");
            await this.$store.dispatch("logoutUser");
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
.description-cell {
    max-width: 600px;
    /* Adjust the width as needed */
    word-wrap: break-word;
}

.icon {
    max-width: 24px;
    max-height: 24px;
}
</style>
