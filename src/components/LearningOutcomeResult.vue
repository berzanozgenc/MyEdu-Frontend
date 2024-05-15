<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!-- Logo -->
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <!-- Title -->
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <!-- Logout Button -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="button">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <!-- Flex container -->
    <div class="flex-container mt-4">
      <!-- Menu -->
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim</a><br />
          <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />
          <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToCourseProgramOutcomePage">Program Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a><br />
          <a href="#" class="card-link" @click="goToStudentListPage">Öğrenci Listesi</a><br />
        </div>
      </div>
      <div class="card" style="width: auto; margin-left: 0%; overflow-x: auto;">
        <div class="card-body">
          <h5 class="card-title">ÖĞRENİM ÇIKTILARI</h5>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Öğr. Çıktı</th>
                <th scope="col">ÖÇ'leri Sağlama Düzeyi</th>
                <th scope="col">HEDEFLER</th>
                <th scope="col">ARAÇLAR</th>
                <th scope="col">SKOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(outcome, index) in outcomes" :key="index">
                <td class="description-cell" style="text-align: center;">{{ outcome.description }}</td>
                <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(3) }}</td>
                <td style="text-align: center;">{{ outcome.desiredTarget.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.assessmentSum.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.scoreSum.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Grafik -->
        </div>
      </div>
    </div>
  </div>
  <div style="align-items: center">
    <div class="card" style="width: 90%; margin-left: 2%; overflow-x: auto;">
      <BarChart :course-id="courseId" /> 
  </div>
</div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import BarChart from './BarChart.vue'

export default {
  components: { BarChart },
  data() {
    return {
      outcomes: [],
      courseId: null,
    };
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.calculateValues();
    this.fetchLearningOutcomes();
  },
  methods: {
    async calculateValues() {
      try {
        const courseId = this.$route.params.courseId;
        await axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}/calculate-and-set-assessment-sum`);
        await axios.post(`http://localhost:8080/learningOutcomes/course/${courseId}/calculate-and-set-score-sum`);
      } catch (error) {
        console.error("Error calculate learning outcome values:", error);
      }
    },
    async fetchLearningOutcomes() {
      try {
        const courseId = this.$route.params.courseId;
        const response = await axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        this.outcomes = response.data;
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
      }
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
      this.$router.push("/instructor-match-matrix");
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
    },
    goToInstructorLearningOutcome() {
      this.$router.push("/instructor-learning-outcome");
    },
    goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId } });
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    async logoutUser() {
      const router = useRouter();
      localStorage.removeItem('store');
      await this.$store.dispatch('logoutUser');
      await router.push("/");
    },
  },
};
</script>

<style scoped>
.math-sum {
  font-weight: bold;
}

.description-cell {
  max-width: 600px; /* Adjust the width as needed */
  word-wrap: break-word;
}

</style>
