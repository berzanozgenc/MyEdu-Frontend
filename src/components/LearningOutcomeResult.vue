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
            <a href="#" class="card-link" @click="goToLearningOutcomePage">Öğrenim Çıktıları</a><br />
            <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
          </div>
        </div>
  
        <!-- Matrix -->
        <div class="card" style="width: auto; margin-left: 100px; overflow-x: auto;">
          <div class="card-body">
            <h5 class="card-title">ÖĞRENİM ÇIKTILARI</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Öğrenim Çıktısı</th>
                  <th scope="col">ÖÇ'leri Sağlama Düzeyi</th>
                  <th scope="col">HEDEFLER</th>
                  <th scope="col">ARAÇLAR</th>
                  <th scope="col">SKOR</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(outcome, index) in outcomes" :key="index">
                  <td>{{ outcome.description }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <!-- Son satır kontrolü -->
                <tr :key="'last-row'">
                  <td v-for="column in 5" :key="column" :class="{ 'math-sum': column === 1 }">
                    {{ column === 1 ? '∑' : '' }}
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
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    data() {
      return {
        outcomes: [],
      };
    },
    created() {
      this.fetchLearningOutcomes();
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
      goToLearningOutcomePage() {
        this.$router.push("/learning-outcome");
      },
      goToInstructorLearningOutcome() {
        this.$router.push("/instructor-learning-outcome");
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
  /* Your CSS styles */
  </style>
  