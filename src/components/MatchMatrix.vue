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
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
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
          <a href="#" class="card-link">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
        </div>
      </div>

      <!-- Matrix -->
      <div class="card" style="width: auto; margin-left: 100px; overflow-x: auto;">
        <div class="card-body">
          <h5 class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

          <!-- Matrix table -->
          <table class="table" style="min-width: 600px;">
  <thead>
    <tr>
      <th scope="col"></th>
      <th v-for="(outcome, index) in outcomes" :key="index" scope="col">{{ outcome.description }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(program, programIndex) in programs" :key="programIndex">
      <th scope="row">{{ program.description }}</th>
      <td v-for="(outcome, outcomeIndex) in outcomes" :key="outcomeIndex">
        <div>
          <input v-if="program.editMode[outcomeIndex]" placeholder="%" type="text" v-model="program.outcomes[outcomeIndex]">
          <span v-else>{{ program.outcomes[outcomeIndex] }}</span>
          <button @click="toggleEditMode(programIndex, outcomeIndex)" class="btn btn-sm btn-primary ml-1">
            {{ program.editMode[outcomeIndex] ? 'Vazgeç' : 'Düzenle' }}
          </button>
          <button v-if="program.editMode[outcomeIndex]" @click="saveChanges(programIndex, outcomeIndex)" class="btn btn-sm btn-success ml-1">Kaydet</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
          <!-- End of matrix table -->
          
  <button @click="saveAllChanges" class="btn btn-primary mt-3">Tümünü Kaydet</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      rowCount: 12,
      colCount: 3,
      matrix: [],
      outcomes: [],
      programs: [],
    };
  },
  created() {
    const courseId = this.$route.params.courseId;
    console.log("Current Course ID : ", courseId);
    this.fetchLearningOutcomes(courseId);
    this.fetchProgramOutcomes();
  },
  watch: {
    rowCount: 'generateMatrix',
    colCount: 'generateMatrix',
  },
  mounted() {
    this.generateMatrix();
  },
  methods: {
    // Functions for navigation
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
    async saveAllChanges() {
    try {
      for (let i = 0; i < this.programs.length; i++) {
        const program = this.programs[i];
        for (let j = 0; j < program.outcomes.length; j++) {
          if (program.editMode[j]) {
            await this.saveChanges(i, j);
          }
        }
      }
      this.$toast.success("Tüm değişiklikler başarıyla kaydedildi!");
    } catch (error) {
      console.error('Tüm değişiklikler kaydedilirken bir hata oluştu:', error);
      this.$toast.error("Tüm değişiklikler kaydedilirken bir hata oluştu!");
    }
  },
    async logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      await router.push("/");
    },
    async fetchLearningOutcomes(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        if (!response.ok) {
          throw new Error('Öğrenim çıktıları getirilirken bir hata oluştu.');
        }
        const data = await response.json();
        this.matrix = data.map(item => item.description);
        this.outcomes = data;
        this.colCount = data.length;
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },
    async fetchProgramOutcomes() {
      try {
        const response = await axios.get(`http://localhost:8080/program-outcomes`);
        if (response.status !== 200) {
          throw new Error('Program çıktıları getirilirken bir hata oluştu.');
        }
        const data = response.data;
        this.programs = data.map(program => {
          return {
            ...program,
            outcomes: Array(this.outcomes.length).fill(false),
            editMode: Array(this.outcomes.length).fill(false) // Edit mode for each outcome
          };
        });
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },
    toggleEditMode(programIndex, outcomeIndex) {
      this.programs[programIndex].editMode[outcomeIndex] = !this.programs[programIndex].editMode[outcomeIndex];
    },
    async saveChanges(programIndex, outcomeIndex) {
  try {
    const program = this.programs[programIndex];
    const outcome = program.outcomes[outcomeIndex];
    const learningOutcomeId = this.outcomes[outcomeIndex].id;
    const programOutcomeId = program.id;
    const contribution = parseFloat(outcome);

    if (isNaN(contribution) || contribution < 0 || contribution > 100 || outcome.trim() === '') {
      // Girilen değer geçerli bir sayı değil veya boşsa
      this.$toast.error("Lütfen geçerli bir değer giriniz.");
      return;
    }

    console.log('Kaydedilen Learning Outcome ID:', learningOutcomeId, 'Kaydedilen Program Outcome ID:', programOutcomeId);
    const response = await axios.post('http://localhost:8080/learning-outcome-program-outcome', {
      learningOutcomeId,
      programOutcomeId,
      contribution
    });

    if (response.status === 201) {
      console.log('Başarıyla kaydedildi.');
      this.$toast.success("Başarıyla kaydedildi!");
      // Success message or other actions
    } else {
      console.error('Kaydedilirken bir hata oluştu:', response.data);
      this.$toast.error("Kaydedilirken bir hata oluştu!");
      // Error handling
    }
    // Disable edit mode after saving
    this.programs[programIndex].editMode[outcomeIndex] = false;
  } catch (error) {
    console.error('Kaydedilirken bir hata oluştu:', error);
    this.$toast.error("Kaydedilirken bir hata oluştu!");
    // Error handling
  }
},
    generateMatrix() {
      this.matrix = Array.from({ length: this.rowCount }, () => Array(this.colCount).fill(false));
    },
  },
};
</script>

<style scoped>
/* Your CSS styles */
</style>
