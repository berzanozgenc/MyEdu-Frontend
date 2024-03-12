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
          <button
            @click="goToLoginPage"
            class="btn btn-outline-danger my-2 my-sm-0"
            type="submit"
          >
            Çıkış Yap
          </button>
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
                    <th
                      v-for="(assessment, index) in assessments"
                      :key="assessment.id"
                      scope="col"
                    >
                      <div class="d-flex align-items-center">
                        <span @click="selectColumn(index)">{{
                          assessment.name + " " + (index + 1)
                        }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Katkı (%)</th>
                    <td
                      v-for="(assessment, index) in assessments"
                      :key="assessment.id"
                      contenteditable="true"
                    >
                      <span v-if="assessment.contribution !== 0">{{
                        assessment.contribution
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                type="button"
                class="btn btn-success mb-2"
                @click="addNewAssessment"
              >
                Yeni Araç Ekle
              </button>
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
                        <span @click="selectColumn(index)">{{
                          assessment.name + " " + (index + 1)
                        }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(outcome, outcomeIndex) in outcomes"
                    :key="outcomeIndex"
                  >
                    <th scope="row">{{ outcome.description }}</th>
                    <td
                      v-for="(assessment, assessmentIndex) in assessments"
                      :key="'assessment-' + assessmentIndex"
                      contenteditable="true"
                    >
                      <!-- Her bir assessment için contenteditable hücresi -->
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="saveContributions"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  },

  methods: {
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
    async addNewAssessment() {
      const generalAssessmentId = this.$route.params.generalAssessmentId;
      try {
        const response = await axios.post(
          "http://localhost:8080/assessments/create-assessment",
          {
            contribution: 0.0,
            generalAssessmentId: generalAssessmentId,
          }
        );

        // Yeni değerlendirme başarıyla oluşturulduğunda bir mesaj gösterilebilir veya diğer gerekli işlemler yapılabilir
        console.log("Yeni araç başarıyla oluşturuldu:", response.data);

        // Değerlendirmeleri tekrar yükleme işlemi
        this.fetchAssessments();
      } catch (error) {
        console.error("Yeni araç oluşturulurken hata oluştu:", error);
      }
    },

    goToLoginPage() {
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
      //window.location.reload();
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
