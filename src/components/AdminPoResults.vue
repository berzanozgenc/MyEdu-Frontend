<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff">
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px" />myEdu
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
                            <multiselect v-model="selectedPeriods" :options="periods" multiple />
                        </div>

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
                                <th v-for="(period, index) in selectedPeriods" :key="index" style="text-align: center"
                                    scope="col">
                                    {{ period }} PÇ Sağlama Düzeyi
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
                                <td v-for="(period, pIndex) in selectedPeriods" :key="pIndex" style="text-align: center"
                                    class="description-cell">
                                    %{{
                isNaN(outcome[period])
                    ? "Henüz hesaplanmadı"
                    : outcome[period].toFixed(2)
            }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <Bar :data="chartData" :options="chartOptions" />
                    </div>
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
import Multiselect from 'vue-multiselect';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);



export default {
    name: "AdminPoResults",
    components: {
        Multiselect,
        Bar
    },
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
            selectedPeriods: [],
            chartData: {
                labels: [],
                datasets: []
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Program Çıktıları Sağlama Düzeyi'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        };
    },

    created() {
        this.fetchPeriods();
    },

    watch: {
        selectedPeriods: {
            handler: 'showResults',
            immediate: true,
            deep: true
        }
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
            if (this.selectedPeriods.length === 0) {
                this.$toast.error("Lütfen en az bir dönem seçin!");
                return;
            }
            const user = this.getUser;
            const departmentId = user.department.id;

            try {
                const response = await axios.get(
                    `http://localhost:8080/program-outcomes/department/${departmentId}`
                );
                this.outcomes = response.data;
                this.outcomes.sort((a, b) => a.number - b.number);

                let results = [];
                let requests = [];

                for (let period of this.selectedPeriods) {
                    const periodResults = await this.fetchResultsForPeriod(departmentId, period);
                    results.push({ period, results: periodResults });
                }

                this.calculateWeightedAverages(results);

            } catch (error) {
                // Hata durumunda kullanıcıya bir mesaj gösterin
                this.$toast.error("Dersler getirilemedi. Lütfen tekrar deneyin.");
                console.error("API Error:", error);
            }
        },
        async fetchResultsForPeriod(departmentId, period) {
            try {
                const response = await axios.get(
                    "http://localhost:8080/course/getByPeriodAndDepartmentId",
                    {
                        params: {
                            period: period,
                            departmentId: departmentId,
                        },
                    }
                );

                const courses = response.data;
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

                await Promise.all(requests);
                return results;

            } catch (error) {
                console.error("Error fetching courses:", error);
                return [];
            }
        },
        calculateWeightedAverages(results) {
            let groupedResults = {};

            results.forEach(({ period, results }) => {
                results.forEach((result) => {
                    const programOutcome = result.programOutcome;
                    if (!groupedResults[programOutcome.id]) {
                        groupedResults[programOutcome.id] = {
                            programOutcome: programOutcome,
                            periodResults: {}
                        };
                    }
                    if (!groupedResults[programOutcome.id].periodResults[period]) {
                        groupedResults[programOutcome.id].periodResults[period] = [];
                    }
                    groupedResults[programOutcome.id].periodResults[period].push(result);
                });
            });

            let weightedAverages = Object.values(groupedResults).map((group) => {
                let avgResults = { programOutcome: group.programOutcome };

                for (let period of this.selectedPeriods) {
                    let totalWeightedLevel = 0;
                    let totalEcts = 0;

                    if (group.periodResults[period]) {
                        group.periodResults[period].forEach((result) => {
                            const levelOfProvision = result.levelOfProvision;
                            const ects = result.course.ects;

                            if (!isNaN(levelOfProvision) && levelOfProvision !== 0) {
                                totalWeightedLevel += levelOfProvision * ects;
                                totalEcts += ects;
                            }
                        });
                    }

                    const avgLevelOfProvision =
                        totalEcts > 0 ? totalWeightedLevel / totalEcts : 0;
                    avgResults[period] = avgLevelOfProvision;
                }

                return avgResults;
            });

            console.log(weightedAverages);
            this.weightedAverages = weightedAverages;
            this.updateChart();
        },
        updateChart() {
            const labels = this.weightedAverages.map(item => item.programOutcome.number);
            const datasets = this.selectedPeriods.map(period => {
                return {
                    label: period,
                    backgroundColor: this.getRandomColor(),
                    data: this.weightedAverages.map(item => item[period] || 0)
                };
            });

            this.chartData = {
                labels: labels,
                datasets: datasets
            };
        },
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
