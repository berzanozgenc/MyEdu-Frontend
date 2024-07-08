<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px" />
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
                <button style="margin-left: 8px" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0"
                    type="submit">
                    Çıkış Yap
                </button>
            </div>
        </nav>

        <div class="flex-container">
            <div class="card menu" style="width: 12%">
                <div class="card-body">
                    <h5 class="card-title">Menü</h5>
                    <ul class="list-group">
                        <li class="list-group-item" @click="goToCoursePage">
                            <i class="fas fa-book"></i> Derslerim
                        </li>
                        <li class="list-group-item" @click="goToAnalysisPage">
                            <i class="fas fa-diagram-project"></i> Analiz
                        </li>
                        <li class="list-group-item" @click="goToGuidePage">
                            <i class="fas fa-users"></i> Kılavuz
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card" style="width: 80%; overflow-y: auto; overflow-x: hidden">
                <div class="form-inline">
                    <div class="form-group mr-2">
                        <div style="margin-left: 5px">
                            <label for="classDropdown">Ders Seç:</label>
                            <select class="form-control" id="classDropdown" v-model="selectedClass">
                                <option v-for="(course, index) in courses" :key="index">
                                    {{ course }}
                                </option>
                            </select>
                        </div>
                        <button @click="analyzeCourse()" style="margin-left: 2px; margin-top: 6px"
                            class="btn btn-primary">
                            Dersi Analiz Et
                        </button>
                    </div>
                    <div class="form-group mr-2">
                        <div style="margin-left: 5px">
                            <br>
                            <label for="periodDropdown">Yıl Seç:</label>
                            <Multiselect v-model="selectedPeriods" :options="periods" :multiple="true" placeholder="Yıl Seçin" />
                        </div>
                    </div>
                    <div class="card-body"></div>
                </div>
            </div>
        </div>
        <div v-if="Object.keys(groupedOutcomes).length" class="card table-responsive"
            style="width: 90%; max-height: 500px; overflow-y: auto;">
            <div class="table-container">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th style="vertical-align: top" scope="col">PÇ. No</th>
                            <th style="vertical-align: top" scope="col">Tanım</th>
                            <th v-for="course in filteredCourses" :key="course.courseId" style="text-align: center"
                                scope="col">
                                {{ course.courseName }} {{ course.period }} {{ course.semester }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(group, key) in groupedOutcomes" :key="key">
                            <td class="description-cell">{{ group.programOutcome.number }}</td>
                            <td class="description-cell">
                                {{ group.programOutcome.description }}
                            </td>
                            <td v-for="course in filteredCourses" :key="course.courseId" style="text-align: center">
                                <template v-if="courseValue(group.courses, course.courseId) !== null">
                                    %{{ courseValue(group.courses, course.courseId).toFixed(2) }}
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="Object.keys(groupedLearningOutcomes).length" class="card table-responsive"
            style="width: 90%; max-height: 500px; overflow-y: auto;">
            <div class="table-container">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th style="vertical-align: top" scope="col">Tanım</th>
                            <th v-for="course in filteredCourses" :key="course.courseId" style="text-align: center"
                                scope="col">
                                {{ course.courseName }} {{ course.period }} {{ course.semester }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(group, key) in groupedLearningOutcomes" :key="key">
                            <td class="description-cell">
                                {{ group.learningOutcome.description }}
                            </td>
                            <td v-for="course in filteredCourses" :key="course.courseId" style="text-align: center">
                                <template v-if="courseValue(group.courses, course.courseId) !== null">
                                    %{{ courseValue(group.courses, course.courseId).toFixed(2) }}
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
    name: "PoAnalysis",
    components: { Multiselect },
    computed: {
        ...mapGetters(["getUser"]),
        username() {
            const user = this.getUser;
            return user ? `${user.firstName} ${user.lastName}` : "";
        },
        filteredCourses() {
            if (!this.selectedPeriods.length) {
                return this.allCourses;
            }
            return this.allCourses.filter(course => this.selectedPeriods.includes(course.period));
        },
        allCourses() {
            const courses = new Map();

            for (const group of Object.values(this.groupedOutcomes)) {
                for (const course of group.courses) {
                    courses.set(course.course.courseId, course.course);
                }
            }

            return Array.from(courses.values());
        }
    },
    data() {
        return {
            courses: [],
            userCourses: [],
            groupedOutcomes: {},
            groupedLearningOutcomes: {},
            selectedClass: null,
            periods: [],
            selectedPeriods: [],
        };
    },

    created() {
        this.fetchCourses();
    },

    methods: {
        courseValue(courses, courseId) {
            const course = courses.find(c => c.course.courseId === courseId);
            return course ? course.levelOfProvision : null;
        },
        async analyzeCourse() {
    const code = this.selectedClass;
    if (this.selectedClass == null) {
        this.$toast.error("Lütfen analiz etmek istediğiniz dersi seçin!");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/course/code/${code}`);
        const nonFilteredCourses = response.data;
        const filteredCourses = nonFilteredCourses.filter((course) =>
            this.userCourses.some((userCourse) => userCourse.course.courseId === course.courseId)
        );

        const allOutcomes = [];
        for (let i = 0; i < filteredCourses.length; i++) {
            const courseId = filteredCourses[i].courseId;
            const response = await axios.get(
                `http://localhost:8080/courseProgramOutcomeResults/${courseId}`
            );
            const outcomes = response.data.filter(
                (outcome) => !isNaN(outcome.levelOfProvision)
            );
            allOutcomes.push(...outcomes);
        }

        const groupedOutcomes = allOutcomes.reduce((groups, outcome) => {
            const key = outcome.programOutcome.number;
            if (!groups[key]) {
                groups[key] = {
                    programOutcome: outcome.programOutcome,
                    courses: []
                };
            }
            groups[key].courses.push(outcome);
            return groups;
        }, {});

        this.groupedOutcomes = groupedOutcomes;

        // Öğrenim çıktıları için benzer işlemler
        const allLearningOutcomes = [];
        for (let i = 0; i < filteredCourses.length; i++) {
            const courseId = filteredCourses[i].courseId;
            const response = await axios.get(
                `http://localhost:8080/learningOutcomes/course/${courseId}`
            );
            const learningOutcomes = response.data.filter(
                (outcome) => !isNaN(outcome.assessmentSum)
            );

            // Her öğrenim çıktısına ilgili kurs bilgisini ekleyin
            learningOutcomes.forEach(outcome => {
                outcome.course = filteredCourses[i];
            });

            allLearningOutcomes.push(...learningOutcomes);
        }

        const groupedLearningOutcomes = this.groupSimilarOutcomes(allLearningOutcomes);

        this.groupedLearningOutcomes = groupedLearningOutcomes;

    } catch (error) {
        this.$toast.error("Hata: " + error.response.data.message);
    }
},

        groupSimilarOutcomes(outcomes) {
            const similarityThreshold = 0.85;
            const groups = [];

            outcomes.forEach(outcome => {
                let found = false;
                for (const group of groups) {
                    const similarity = this.stringSimilarity(group.learningOutcome.description, outcome.description);
                    if (similarity >= similarityThreshold) {
                        group.courses.push(outcome);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    groups.push({
                        learningOutcome: outcome,
                        courses: [outcome]
                    });
                }
            });

            return groups.reduce((result, group, index) => {
                result[index] = group;
                return result;
            }, {});
        },
        stringSimilarity(str1, str2) {
            const [shorter, longer] = [str1, str2].sort((a, b) => a.length - b.length);
            const longerLength = longer.length;
            if (longerLength === 0) {
                return 1.0;
            }
            return (longerLength - this.editDistance(shorter, longer)) / parseFloat(longerLength);
        },
        editDistance(str1, str2) {
            const costs = [];
            for (let i = 0; i <= str1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= str2.length; j++) {
                    if (i === 0) {
                        costs[j] = j;
                    } else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            }
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0) {
                    costs[str2.length] = lastValue;
                }
            }
            return costs[str2.length];
        },
        goToCoursePage() {
            this.$router.push("/course-page");
        },
        goToAnalysisPage() {
            this.$router.push("/analysis-page");
        },
        goToGuidePage() {
            this.$router.push("/guide-page");
        },
        refreshPage() {
            location.reload();
        },
        fetchCourses() {
            const userId = this.getUser ? this.getUser.userId : null;
            axios
                .get(`http://localhost:8080/user-course-registrations/user/${userId}/courses`)
                .then((response) => {
                    this.userCourses = response.data;
                    let courseCodes = new Set();
                    let periodsSet = new Set();
                    response.data.forEach(item => {
                        courseCodes.add(item.course.code);
                        periodsSet.add(item.course.period);
                    });
                    this.courses = Array.from(courseCodes);
                    this.periods = Array.from(periodsSet);
                })
                .catch((error) => {
                    console.error("Hata:", error);
                });
        },
        logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem("store");
            this.$store.dispatch("logoutUser");
            this.$router.push("/");
        },
    },
};
</script>


<style src="vue-multiselect/dist/vue-multiselect.css" scoped>


.container {
    display: flex;
}

.logout {
    margin-left: auto;
    margin-right: 20px;
}

.card {
    margin-top: 3%;
    margin-left: auto;
    margin-right: auto;
}

.icon {
    max-width: 24px;
    max-height: 24px;
}

.modal {
    background: rgba(0, 0, 0, 0.5);
    /* Background rengi ve saydamlık */
    position: fixed;
    /* Sayfanın üzerinde sabit kalacak */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    /* İçerik merkezi konumlandırma için */
    align-items: center;
    justify-content: center;
}

.list-group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-dialog {
    background: white;
    padding: 20px;
    border-radius: 5px;
}

.modal-title {
    margin-bottom: 0;
}

.course-link {
    text-decoration: none;
    /* Varsayılan link alt çizgisini kaldır */
    color: blue;
    /* Varsayılan metin rengini uygula */
}

.course-link:hover {
    text-decoration: underline;
    /* Hover durumunda alt çizgi ekle */
    color: navy;
    /* Hover durumunda renk değiştir */
}

.description-cell {
    max-height: 4.5em;
    /* approx 3 lines of text */
    overflow-y: auto;
}

.table-container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
}

.table-container table {
    width: 100%;
    table-layout: auto;
}

th,
td {
    white-space: normal;
}
</style>
