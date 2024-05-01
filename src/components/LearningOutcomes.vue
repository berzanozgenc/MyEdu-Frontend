<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
      >
        <img
          src="../assets/Baskent_University_Logo.png"
          alt="Logo"
          style="max-height: 50px"
        />
        myEdu</a
      >
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
        >Kişiselleştirilmiş Akademik Gelişim ve <br />
        Değerlendirme Sistemi</a
      >

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
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim </a
          ><br />
          <a href="#" class="card-link" @click="goToStudentInfoPage"
            >Not Girişi</a
          ><br />
          <a href="#" class="card-link" @click="goToInstructorLearningOutcome"
            >Öğrenim Çıktıları</a
          ><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage"
            >ÖÇ ve PÇ Eşleştirme</a
          >
        </div>
      </div>

      <!-- Both tables in the same card -->
      <div class="card mt-3" style="width: 1000px">
        <div class="card-body">
          <h5 class="card-title">Araç Yüzdelerini Belirleme</h5>
          <div style="max-width: 100%; overflow-x: auto">
            <div style="max-height: 300px; overflow-y: auto">
              <table class="table table-stretched">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th v-for="(assessment, index) in assessments" :key="assessment.id" scope="col">
  <div class="d-flex align-items-center justify-content-between">
    <span>{{!useCustomNames ?  assessment.name  : 'Soru'}} {{ index + 1 }}</span>
    <button @click="deleteAssessment(assessment.assessmentId)" class="btn btn-sm btn-danger ml-2">
      <i class="fa fa-trash" style="font-size: 12px;"></i> <!-- Silme ikonu -->
    </button>
  </div>
</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Katkı (%)</th>
                    <td v-for="(assessment, index) in assessments" :key="assessment.id">
                      <input
                        type="number"
                        v-model="assessment.contribution"
                        @input="updateContribution(index, $event.target.value)"
                        style="width: 60px;"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-bottom: 10px;">
                <label for="contributionInput" style="margin-right: 10px;">Katkı Değeri:</label>
                <input
                  type="number"
                  id="contributionInput"
                  v-model="contributionValue"
                  style="width: 100px;"
                />
              </div>

              <button
                type="button"
                class="btn btn-success mb-2"
                @click="addNewAssessment"
              >
                Yeni Araç Ekle
              </button>
              <input style="margin-left: 4px;" type="checkbox" v-model="useCustomNames" @change="toggleQuestionBased">Soru Bazlı Değerlendirme
              <br />
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="saveContributions"
              >
                Kaydet
              </button>
            </div>
          </div>

          <!-- Second table -->
          <br />
          <h5 class="card-title">Öğrenim Çıktısı - Araç Eşleştirme</h5>
          <div style="max-width: 100%; overflow-x: auto">
            <div>
  <button v-if="!isEditMode" @click="enableEditMode" class="btn btn-primary mb-2"><i class="fas fa-pencil-alt"></i> </button>
  <button v-if="isEditMode" @click="saveAndDisableEditMode" class="btn btn-success mb-2">Kaydet</button>
</div>
            <div style="max-height: 300px; overflow-y: auto">
              <table class="table table-stretched mt-3">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <!-- Dinamik olarak eklenen sütunlar -->
                    <th
                      v-for="(assessment, index) in assessments"
                      :key="'assessment-' + index"
                      scope="col"
                    >
                      <div class="d-flex align-items-center">
                        <span @click="selectColumn(index)">{{!useCustomNames ?  assessment.name  : 'Soru'}} {{ index + 1 }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
  <tr v-for="(outcome, outcomeIndex) in outcomes" :key="outcomeIndex">
    <th scope="row">{{ outcome.description }}</th>
    <td v-for="(assessment, assessmentIndex) in assessments" :key="'assessment-' + assessmentIndex" :contenteditable="isEditMode" contenteditable="true">

      <!-- Her bir assessment için contenteditable hücresi -->
      <div 
      ref="assessmentCells"
      :id="'cell-' + outcome.id + '-' + assessment.id"
      @blur="updateRelationship(outcome.id, assessment.id, $event.target.innerText)"
    ></div>
    <div>
      <input v-if="isEditMode" placeholder="%" type="number" v-model="editedOutcome">
      <span v-else>{{ outcome.value }}</span>
    </div>
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
  name: "LearningOutcome",
  props: ["generalAssessmentId", "courseId"],
  data() {
    return {
      outcomes: [],
      assessments: [],
      quizColumns: [1, 2, 3], // Başlangıçta üç sütun var
      selectedColumn: null,
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
  },
  methods: {
    async saveAndDisableEditMode() {
    await this.saveLearningOutcomeContributions(); // İlişkileri kaydet
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
        this.assessments = response.data; // Backend'den assessment'ları al
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    },
    async saveContributions() {
      try {
        for (const assessment of this.assessments) {
          const newContribution = parseFloat(assessment.contribution);
          console.log(assessment.contribution);
          console.log("ASSESMENT",assessment);
          await axios.put(`http://localhost:8080/assessments/update-assessment-contribution/${assessment.assessmentId}?newContribution=${newContribution}`);
          console.log(`Assessment contribution updated for assessmentId ${assessment.assessmentId} to ${newContribution}`);
        }
        // Backend'deki veriler güncellendikten sonra frontend'deki verileri yeniden yükle
        this.fetchAssessments();
        this.$toast.success("Katkı değeri başarıyla kaydedildi!");
      } catch (error) {
        console.error("Error updating assessment contributions:", error);
        this.$toast.error("Katkı değeri kaydedilirken hata oluştu!");
      }
    },
    async saveLearningOutcomeContributions() {
  try {
    const requests = [];
    for (const outcome of this.outcomes) {
      const outcomeId = outcome.id;
      for (const assessment of this.assessments) {
        const assessmentId = assessment.id;
        const contributionCell = this.$refs[outcomeId + "-" + assessmentId];
        if (contributionCell) {
          let relationship = parseFloat(contributionCell.innerText);
          if (isNaN(relationship)) {
            relationship = 0.0; // Geçersiz değerler için varsayılan 0 atanır
          }
          const data = {
            assessmentId,
            learningOutcomeId: outcomeId,
            relationship
          };
          console.log("Gönderilecek veri:", data); // Veriyi konsola yazdırarak kontrol edin
          const request = axios.post(`http://localhost:8080/aloc`, data);
          requests.push(request);
        }
      }
    } 
    const responses = await Promise.all(requests);
    responses.forEach(response => {
      if (response.status === 201) {
        console.log('Başarıyla kaydedildi.');
      } else {
        console.error('Kaydedilirken bir hata oluştu:', response.data);
        this.$toast.error("Kaydedilirken bir hata oluştu!");
      }
    });
  } catch (error) {
    console.error("İlişkileri kaydederken hata oluştu:", error);
    this.$toast.error("İlişkileri kaydederken hata oluştu!");
  }
},
updateRelationship(outcomeId, assessmentId, value) {
    const relationship = parseFloat(value);
    if (isNaN(relationship)) {
      // Eğer değer girilmemişse veya geçersizse, varsayılan değer olan 0 atanır
      return;
    }
    // İlişkiyi güncelleme veya başka bir işlem yapma
  },

    updateContribution(index, value) {
      this.assessments[index].contribution = parseFloat(value);
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
      this.$router.push("/instructor-match-matrix");
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToInstructorLearningOutcome() {
      this.$router.push("/instructor-learning-outcome");
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    addNewQuiz() {
      this.quizColumns.push(this.quizColumns.length + 1);
    },
    removeQuiz(index) {
      if (this.quizColumns.length > 1) {
        this.quizColumns.splice(index, 1);
        this.selectedColumn = null;
      }
    },
    selectColumn(index) {
      this.selectedColumn = index;
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
