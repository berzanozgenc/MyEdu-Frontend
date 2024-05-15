<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
                <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px" />
                myEdu</a>
            <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik
                Gelişim ve <br />
                Değerlendirme Sistemi</a>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto"></ul>
                <span class="logout">
                    <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış
                        Yap</button>
                </span>
            </div>
        </nav>

        <div class="flex-container">
            <div class="card" style="width: 13rem; margin-left: 10px">
                <div class="card-body">
                    <h5 class="card-title">Menü</h5>
                    <a href="#" class="card-link" @click="goToCoursePage">Derslerim </a><br />
          <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToCourseProgramOutcomePage">Program Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a><br />
          <a href="#" class="card-link" @click="goToStudentListPage">Öğrenci Listesi</a><br />
                </div>
            </div>


            <div class="card mt-3" style="width: 80%">
                <div class="card-body">
                    <br />
                    <h5 class="card-title">Öğrenim Çıktısı - Araç Eşleştirme</h5>
                    <div style="max-width: 100%; overflow-x: auto">
                        <div>
                            <button v-if="!isEditMode" @click="enableEditMode" class="btn btn-primary mb-2"><i
                                    class="fas fa-pencil-alt"></i> </button>
                            <button v-if="isEditMode" @click="saveAllChanges"
                                class="btn btn-success mb-2">Kaydet</button>
                            <button style="margin-left: 2px;" v-if="isEditMode" @click="disableEditMode"
                                class="btn btn-danger mb-2">Vazgeç</button>

                        </div>
                        <div style="max-height: 300px; overflow-y: auto">
                            <table class="table table-stretched mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th v-for="(assessment, index) in assessments" :key="'assessment-' + index"
                                            scope="col">
                                            <div class="d-flex align-items-center">
                                                <span @click="selectColumn(index)">{{ !useCustomNames ? assessment.name
                :
                'Soru' }} {{ index + 1 }}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(outcome, outcomeIndex) in outcomes" :key="outcomeIndex">
                                        <th class="loDescription" scope="row">{{ outcome.description }}</th>
                                        <td :ref="`cell_${outcomeIndex}_${assessmentIndex}`"
                                            v-for="(assessment, assessmentIndex) in assessments"
                                            :key="'assessment-' + assessmentIndex" :contenteditable="isEditMode">
                                            <span style="align-items: center; justify-content: center; display: flex;">
                                                <input style="text-align: center;" v-if="isEditMode" type="text" v-bind:placeholder="fillTable(outcomeIndex, assessmentIndex)"
                                                    v-model="cellData[outcomeIndex][assessmentIndex]" /> <span
                                                    v-else></span>
                                                <span v-else>{{ fillTable(outcomeIndex, assessmentIndex) }}</span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
    name: "Aloc",
    props: ["generalAssessmentId", "courseId"],
    data() {
        return {
            learningOutcomes: [],
            cellData: [],
            assessments: [],
            contributions: [],
            isEditMode: false
        };
    },
    created() {

    },
    mounted() {
        this.fetchLearningOutcomes()
    .then(() => this.fetchAssessments())
    .then(() => this.fetchUseCustomNames())
    .catch(error => {
      console.error('Fetch işlemi başarısız:', error);
    });
    },
    methods: {
        fillTable(outcomeIndex, assessmentIndex) {
            var learningId = this.learningOutcomes[outcomeIndex].id
            var assessmentId = this.assessments[assessmentIndex].assessmentId
            var contribution = 0;


            for (var i = 0; i < this.contributions.length; i++) {
                let cont = this.contributions[i]
                if (cont.assessmentId == assessmentId && cont.learningOutcomeId == learningId) {
                    contribution = cont.contribution;
                }

            }
            return contribution;
        },
        async saveAllChanges() {
            try {
                const outcomeIds = this.outcomes.map(outcome => outcome.id);
                const assessmentIds = this.assessments.map(assessment => assessment.assessmentId);

                let alocArr = [];
                for (let outcomeIndex = 0; outcomeIndex < outcomeIds.length; outcomeIndex++) {
                    const outcomeId = outcomeIds[outcomeIndex];
                    for (let assessmentIndex = 0; assessmentIndex < assessmentIds.length; assessmentIndex++) {
                        const assessmentId = assessmentIds[assessmentIndex];
                        const cellValue = this.cellData[outcomeIndex][assessmentIndex];

                        if (cellValue < 0 || cellValue > 100 || cellValue == NaN)
                            this.$toast.error("Lütfen Geçerli Değer Giriniz!");

                        if (isNaN(cellValue)) {
                            this.$toast.error("Lütfen geçerli bir sayı giriniz!");
                        }

                        // dolu boş kontrolü
                        if (cellValue == 0 || cellValue == undefined || cellValue == "" || cellValue == NaN || cellValue < 0 || cellValue > 100)
                            continue;


                        let obj = {
                            "assessmentId": assessmentId,
                            "learningOutcomeId": outcomeId,
                            "contribution": parseFloat(cellValue)
                        }

                        alocArr.push(obj);

                    }
                }

                const response = await axios.post('http://localhost:8080/aloc', {
                    "alocList": alocArr
                })

                if (response.status == 200) {
                    this.$toast.success("Tüm değişiklikler başarıyla kaydedildi!");
                    await this.fetchTable();
                }

            } catch (error) {
                console.error("Error saving changes:", error);
            }
            this.isEditMode = false
        },
        async fetchTable() {
            try {
                const outcomeIds = this.outcomes.map(outcome => outcome.id);
                const assessmentIds = this.assessments.map(assessment => assessment.assessmentId);

                let alocArr = [];
                for (let outcomeIndex = 0; outcomeIndex < outcomeIds.length; outcomeIndex++) {
                    const outcomeId = outcomeIds[outcomeIndex];
                    for (let assessmentIndex = 0; assessmentIndex < assessmentIds.length; assessmentIndex++) {
                        const assessmentId = assessmentIds[assessmentIndex];
                        let obj = {
                            "assessmentId": assessmentId,
                            "learningId": outcomeId,
                        }
                        alocArr.push(obj);
                    }
                }

                const response = await axios.post('http://localhost:8080/aloc/contribution', {
                    "assessmentContributionDTOList": alocArr
                },
                );
                if (response.status == 200) {

                    var tempList = [];
                    for (var i = 0; i < response.data.contributions.length; i++) {
                        var obj = {
                            contribution: response.data.contributions[i].contribution,
                            learningOutcomeId: response.data.contributions[i].learningOutcome.id,
                            assessmentId: response.data.contributions[i].assessment.assessmentId
                        }
                        tempList.push(obj)
                    }
                    this.contributions = tempList;
                    console.log(this.contributions);
                }

            } catch (error) {
                console.error("Error filling table:", error);
            }

        },
        enableEditMode() {
            this.isEditMode = true;
        },
        disableEditMode() {
            this.isEditMode = false;
        },
        async fetchUseCustomNames() {
            try {
                const generalAssessmentId = this.$route.params.generalAssessmentId;
                const response = await axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`);
                this.useCustomNames = response.data; // Backend'den gelen veriyi useCustomNames değişkenine atar
            } catch (error) {
                console.error("Error fetching useCustomNames:", error);
            }
        },
        async fetchLearningOutcomes() {
            try {
                const courseId = this.$route.params.courseId;
                const response = await axios.get(
                    `http://localhost:8080/learningOutcomes/course/${courseId}`
                );
                this.outcomes = response.data;
                this.learningOutcomes = response.data
                if (this.assessments && this.outcomes) {
                    this.cellData = new Array(this.outcomes.length).fill().map(() => new Array(this.assessments.length).fill(''));
                }
            } catch (error) {
                console.error("Error fetching learning outcomes:", error);
            }
        },
        async fetchAssessments() {
            try {
                const generalAssessmentId = this.$route.params.generalAssessmentId;
                const response = await axios.get(
                    `http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`
                );
                this.assessments = response.data.sort((a, b) => a.assessmentId - b.assessmentId);
                if (this.assessments && this.outcomes) {
                    this.cellData = new Array(this.outcomes.length).fill().map(() => new Array(this.assessments.length).fill(''));
                    console.log("asssess")
                    this.fetchTable();
                }
            } catch (error) {
                console.error("Error fetching assessments:", error);
            }
        },
        goToLoginPage() {
            this.$router.push("/");
        },
        logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem('store');
            this.$store.dispatch('logoutUser');
            this.$router.push("/");
        },
        goToCoursePage() {
            this.$router.push("/instructor-home");
        },
        goToLearningOutcomePage() {
            this.$router.push("/learning-outcome");
        },
        goToMatchMatrixPage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({ name: "MatchMatrix", params: { courseId: courseId } });
        },
        goToStudentInfoPage() {
            this.$router.push("/student-info");
        },
        goToCourseProgramOutcomePage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
        },
        goToInstructorLearningOutcomePage() {
            const courseId = this.$route.params.courseId;
            this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
        },
        goToStudentListPage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "StudentList", params: { courseId: courseId }});
        },
    },
};
</script>
<style>
.container {
    display: flex;
}

.logout {
    margin-left: auto;
    margin-right: 20px;
}

.loDescription{
           max-width: 600px; /* Adjust the width as needed */
  word-wrap: break-word;
}
</style>
