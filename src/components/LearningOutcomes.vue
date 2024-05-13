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
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
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

      <!-- Both tables in the same card -->
      <div class="card mt-3" style="width: 1000px">
        <div class="card-body">
          <h5 class="card-title">Araç Puanlarını Belirleme</h5>
          <div style="max-width: 100%; overflow-x: auto">
            <div style="max-height: 300px; overflow-y: auto">
              <table class="table table-stretched">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th v-for="(assessment, index) in assessments" :key="assessment.id" scope="col">
                      <div class="d-flex align-items-center justify-content-between">
                        <span>{{ !useCustomNames ? assessment.name : 'Soru' }} {{ index + 1 }}</span>
                        <button @click="deleteAssessment(assessment.assessmentId)" class="btn btn-sm btn-danger ml-2">
                          <i class="fa fa-trash" style="font-size: 12px;"></i> <!-- Silme ikonu -->
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Puan</th>
                    <td v-for="(assessment, index) in assessments" :key="assessment.id">
                      <input type="number" v-model="assessment.contribution" style="width: 60px;" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-bottom: 10px;">
                <label for="contributionInput" style="margin-right: 10px;">Katkı Değeri:</label>
                <input type="number" id="contributionInput" v-model="contributionValue" style="width: 100px;" />
              </div>

              <button type="button" class="btn btn-success mb-2" @click="addNewAssessment">
                Yeni Araç Ekle
              </button>
              <input style="margin-left: 4px;" type="checkbox" v-model="useCustomNames"
                @change="toggleQuestionBased">Soru Bazlı Değerlendirme
              <br />
              <button type="button" class="btn btn-outline-primary" @click="saveContributions">
                Kaydet
              </button>
            </div>
          </div>
          <br />
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
  name: "LearningOutcome",
  props: ["generalAssessmentId", "courseId"],
  data() {
    return {
      assessments: [],
      contributions: [],
      contributionValue: 0.0, // Kullanıcı tarafından girilen katkı değeri
      useCustomNames: null,
      isEditMode: false,
    };
  },
  created() {
    console.log("Course ID:", this.$route.params.courseId);
    console.log(
      "General Assessment ID:",
      this.$route.params.generalAssessmentId
    );
    // Burada parametreleri kullanarak gerekli işlemleri gerçekleştirebilirsiniz.
  },
  mounted() {
    this.fetchLearningOutcomes();
    this.fetchAssessments();
    this.fetchUseCustomNames();
    console.log(this.assessments.contribution)
  },
  methods: {
    async saveAndDisableEditMode() {
      await this.saveLearningOutcomeContributions();
      this.disableEditMode(); // Düzenleme modunu kapat
    },
    async toggleQuestionBased() {
      console.log("deneme");
      try {
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        await axios.put(`http://localhost:8080/generalAssesment/${generalAssessmentId}/toggleQuestionBased`);
        console.log("Question based toggled successfully.");
      } catch (error) {
        console.error("Error toggling question based:", error);
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
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
      }
    },
    async fetchAssessments() {
      try {
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        console.log(generalAssessmentId);
        const response = await axios.get(
          `http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`
        );
        // Assessmentları id'ye göre sırala
        this.assessments = response.data.sort((a, b) => a.assessmentId - b.assessmentId);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
},

    async saveContributions() {
      this.assessments.forEach(assessment => {
      console.log(`assessment Id: ${assessment.assessmentId} - cellValue: ${assessment.contribution}`);
      console.log( "Kaydet butonu:",assessment.contribution);
    });
      try {
        for (const assessment of this.assessments) {
          const newContribution = parseFloat(assessment.contribution);
          await axios.put(`http://localhost:8080/assessments/update-assessment-contribution/${assessment.assessmentId}?newContribution=${newContribution}`);
          console.log(`Assessment contribution updated for assessmentId ${assessment.assessmentId} to ${newContribution}`);
        }

        this.fetchAssessments();
        this.$toast.success("Katkı değeri başarıyla kaydedildi!");
      } catch (error) {
        console.error("Error updating assessment contributions:", error);
        this.$toast.error("Katkı değeri kaydedilirken hata oluştu!");
      }
    },
    async addNewAssessment() {
      const generalAssessmentId = this.$route.params.generalAssessmentId;
      try {
        const response = await axios.post(
          "http://localhost:8080/assessments/create-assessment",
          {
            contribution: this.contributionValue,
            generalAssessmentId: generalAssessmentId,
          }
        );

        console.log("Yeni araç başarıyla oluşturuldu:", response.data);
        this.fetchAssessments();
        this.$toast.success("Yeni araç başarıyla oluşturuldu!");
      } catch (error) {
        console.error("Yeni araç oluşturulurken hata oluştu:", error);
        this.$toast.error("Yeni araç oluşturulurken hata oluştu!");
      }
    },
    async deleteAssessment(assessmentId) {
      console.log("Delete:",assessmentId)
      try {
        await axios.delete(`http://localhost:8080/assessments/delete-assessment/${assessmentId}`);
        console.log("Assessment silindi:", assessmentId);
        this.fetchAssessments();
      } catch (error) {
        console.error("Assessment silinemedi:", error);
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
    goToStudentListPage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "StudentList", params: { courseId: courseId }});
        },
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    refreshPage() {
      this.$router.push("/instructor-home");
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
</style>
