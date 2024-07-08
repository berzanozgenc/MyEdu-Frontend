<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff">
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                    <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px" />myEdu</a>
            </a>
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                Kişiselleştirilmiş Akademik Gelişim ve <br />
                Değerlendirme Sistemi
            </a>
            <div style="margin-left: auto; margin-right: 2%" class="ml-auto d-flex align-items-center">
                <span class="d-flex align-items-center">
                    <img style="margin-right: 2px" class="icon" src="../assets/profile.png" />
                    <h6 class="mb-0 ml-2">{{ username }}</h6>
                </span>
                <button style="margin-left: 8px" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0">
                    Çıkış Yap
                </button>
            </div>
        </nav>

        <div class="flex-container">
            <div class="card menu" style="width: 18%; margin-left: 10px">
                <div class="card-body">
                    <h5 class="card-title">Menü</h5>
                    <ul class="list-group">
                        <li class="list-group-item" @click="goToAddCoursePage">
                            <i class="fas fa-graduation-cap"></i> Ders Sayfası
                        </li>
                        <li class="list-group-item" @click="goToProgramOutputPage">
                            <i class="fas fa-book"></i> Program Çıktıları Sayfası
                        </li>
                        <li class="list-group-item" @click="goToAdminCoursePage">
                            <i class="fa-solid fa-person-chalkboard"></i> Öğretmen Atamaları
                        </li>
                        <li class="list-group-item" @click="goToAdminGuidePage">
                            <i class="fas fa-chalkboard-teacher"></i> Kılavuz
                        </li>
                        <li class="list-group-item" @click="goToResultPage">
                            <i class="fas fa-diagram-project"></i> Sonuçlar
                        </li>
                    </ul>
                </div>
            </div>
            <div class="card" style="width: 80%; overflow-y: auto; overflow-x: hidden">
                <div class="form-inline">
                    <div class="form-group mr-2">
                        <div style="margin-left: 5px">
                            <label for="classDropdown">Dönem Seç:</label>
                            <select class="form-control" id="classDropdown" v-model="selectedPeriod">
                                <option v-for="(period, index) in periods" :key="index">
                                    {{ period }}
                                </option>
                            </select>
                        </div>
                        <button @click="showResults()" style="margin-left: 2px; margin-top: 6px"
                            class="btn btn-primary">
                            Sonuçları Göster
                        </button>
                    </div>
                    <div class="card-body"></div>
                </div>
            </div>
        </div>
        <div style="
        justify-content: center;
        display: flex;
        align-items: center;
        align-items: flex-start;
      ">
            <div class="card" style="width: 80%; margin-left: auto; overflow-x: auto">
                <div class="card-body">
                    <h5 style="color: #dc3545" class="card-title">
                        Program Çıktıları - Bölüm Sağlama Düzeyleri
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
                                <td class="description-cell">
                                    {{ outcome.programOutcome.number }}
                                </td>
                                <td class="description-cell">
                                    {{ outcome.programOutcome.description }}
                                </td>
                                <td style="text-align: center" class="description-cell">
                                    %{{
                isNaN(outcome.avgLevelOfProvision)
                    ? "Henüz hesaplanmadı"
                    : outcome.avgLevelOfProvision.toFixed(2)
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
    name: "AdminPoResults",
    computed: {
        ...mapGetters(["getUser"]),
        username() {
            const user = this.getUser;
            this.user = this.getUser;
            return user ? `${user.firstName} ${user.lastName}` : "";
        },
    },

    data() {
        return {
            user: null,
            periods: [],
            courseProgramOutcomes: [],
            outcomes: [],
            weightedAverages: [],
            selectedPeriod: null,
        };
    },

    created() {
        this.fetchPeriods();
    },

    methods: {
        goToLoginPage() {
            this.$router.push("/");
        },
        goToAdminGuidePage() {
            this.$router.push("/admin-guide");
        },
        goToProgramOutputPage() {
            this.$router.push("/program-output-admin");
        },
        goToAddCoursePage() {
            this.$router.push("/add-course");
        },
        goToLoadStudentPage() {
            this.$router.push("/admin-load-student");
        },
        refreshPage() {
            window.location.reload();
        },
        logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem("store");
            this.$store.dispatch("logoutUser");
            this.$router.push("/");
        },
        fetchPeriods() {
            const user = this.getUser;
            const departmentId = user.department.id;
            axios
                .get(
                    `http://localhost:8080/course/get-courses/department/${departmentId}`
                )
                .then((response) => {
                    const courses = response.data;
                    const periods = courses.flatMap((course) => course.period); // Her bir course'un periods alanını alıp yeni bir diziye ekler
                    const uniquePeriods = [...new Set(periods)]; // Duplicate değerleri silerek uniquePeriods dizisine atar
                    const sortedPeriods = uniquePeriods.sort(); // Unique periods dizisini alfabetik olarak sıralar
                    this.periods = sortedPeriods;
                })
                .catch((error) => {
                    console.error("Error fetching courses:", error);
                });
        },
        goToAdminCoursePage() {
            this.$router.push("/admin-course");
        },
        async showResults() {
            this.courseProgramOutcomes = [];
            if (this.selectedPeriod == null) {
                this.$toast.error("Lütfen bir dönem seçin!");
                return;
            }
            const user = this.getUser;
            const departmentId = user.department.id;

            try {
                const response = await axios.get(
                    "http://localhost:8080/course/getByPeriodAndDepartmentId",
                    {
                        params: {
                            period: this.selectedPeriod,
                            departmentId: departmentId,
                        },
                    }
                );

                const courses = response.data;
                console.log("x", courses);

                try {
                    const response = await axios.get(
                        `http://localhost:8080/program-outcomes/department/${departmentId}`
                    );
                    this.outcomes = response.data;
                    this.outcomes.sort((a, b) => a.number - b.number);
                } catch (error) {
                    console.error("Error fetching program outcomes:", error);
                }

                let results = [];
                let requests = [];

                for (let i = 0; i < courses.length; i++) {
                    const courseId = courses[i].courseId;
                    for (let j = 0; j < this.outcomes.length; j++) {
                        const programId = this.outcomes[j].id;
                        requests.push(
                            axios
                                .get(
                                    `http://localhost:8080/courseProgramOutcomeResults/course/${courseId}/program-outcome/${programId}`
                                )
                                .then((response) => {
                                    results.push(...response.data);
                                })
                                .catch((error) => {
                                    console.error(
                                        `Error fetching results for Course ID: ${courseId}, Program Outcome ID: ${programId}`,
                                        error
                                    );
                                })
                        );
                    }
                }

                Promise.all(requests)
                    .then(() => {
                        if (results.length > 0) {
                            this.groupResultsByProgramOutcome(results);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching all results:", error);
                    });
            } catch (error) {
                // Hata durumunda kullanıcıya bir mesaj gösterin
                this.$toast.error("Dersler getirilemedi. Lütfen tekrar deneyin.");
                console.error("API Error:", error);
            }
        },

        groupResultsByProgramOutcome(results) {
            let groupedResults = {};

            results.forEach((result) => {
                const programOutcome = result.programOutcome;
                if (!groupedResults[programOutcome.id]) {
                    groupedResults[programOutcome.id] = {
                        programOutcome: programOutcome,
                        results: [],
                    };
                }
                groupedResults[programOutcome.id].results.push(result);
            });

            console.log(groupedResults);
            // İstediğiniz formatta verileri işleyin
            let formattedResults = Object.values(groupedResults).map((group) => {
                return {
                    programOutcome: group.programOutcome,
                    results: group.results.map((result) => ({
                        course: result.course,
                        target: result.target,
                        assessmentValue: result.assessmentValue,
                        levelOfProvision: result.levelOfProvision,
                    })),
                };
            });

            console.log("format", formattedResults);
            // Artık formattedResults istediğiniz formatta

            let weightedAverages = formattedResults.map((group) => {
                let totalWeightedLevel = 0;
                let totalEcts = 0;

                group.results.forEach((result) => {
                    const levelOfProvision = result.levelOfProvision;
                    const ects = result.course.ects;

                    if (!isNaN(levelOfProvision) && levelOfProvision !== 0) {
                        totalWeightedLevel += levelOfProvision * ects;
                        totalEcts += ects;
                    }
                });

                const avgLevelOfProvision =
                    totalEcts > 0 ? totalWeightedLevel / totalEcts : 0;

                return {
                    programOutcome: group.programOutcome,
                    avgLevelOfProvision: avgLevelOfProvision,
                };
            });

            console.log(weightedAverages);
            this.weightedAverages = weightedAverages;
        },
    },
};
</script>
