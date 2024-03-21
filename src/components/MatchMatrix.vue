<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#"> <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;"></a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
        <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <div class="flex-container mt-4">
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim</a><br />
          <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />    
          <a href="#" class="card-link">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
        </div>
      </div>

      <div class="card" style="width: auto; margin-left: 100px; overflow-x: auto;">
      <div class="card-body">
        <h5 class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

        <!-- Your matrix code goes here -->
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
                  <!-- Değiştirilmiş kısım: Onay kutusunu metin alanı ile değiştir -->
                  <input placeholder="%" type="text" v-model="program.outcomes[outcomeIndex]">
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="saveMatrix" class="btn btn-primary mt-3">Kaydet</button>
        <!-- End of matrix code -->

      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios'; // axios'ı projenize dahil edin


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
    this.fetchLearningOutcomes(courseId); // dersin öğrenim çıktılarını al
    this.fetchProgramOutcomes(); // Program çıktılarını al
  },
  watch: {
    rowCount: 'generateMatrix',
    colCount: 'generateMatrix',
  },
  mounted() {
    this.generateMatrix();
  },
  methods: {
    goToLoginPage() {
      this.$router.push("/");
    },
    async fetchLearningOutcomes(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        if (!response.ok) {
          throw new Error('Öğrenim çıktıları getirilirken bir hata oluştu.');
        }
        const data = await response.json();
        // Gelen veriyi matris olarak ayarla
        this.matrix = data.map(item => item.description); // Öğrenim çıktılarının açıklamalarını kullanarak matrisi oluştur
        // Dersin öğrenim çıktılarını sütun olarak ekleyin
        this.outcomes = data;
        this.colCount = data.length;
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },
    async saveMatrix() {
  try {
    for (let i = 0; i < this.programs.length; i++) {
      const program = this.programs[i];
      for (let j = 0; j < program.outcomes.length; j++) {
        const outcome = program.outcomes[j];
        const learningOutcomeId = this.outcomes[j].id;
        const programOutcomeId = program.id;
        const contribution = parseFloat(outcome); // Veri tipini doğru bir şekilde dönüştür

        // Eğer boş bir değer girilmişse veya geçerli bir sayı değilse atla
        if (!isNaN(contribution)) {
          console.log('Kaydedilen Learning Outcome ID:', learningOutcomeId, 'Kaydedilen Program Outcome ID:', programOutcomeId);
          const response = await axios.post('http://localhost:8080/learning-outcome-program-outcome', {
            learningOutcomeId,
            programOutcomeId,
            contribution
          });
          if (response.status === 201) {
            console.log('Başarıyla kaydedildi.');
            this.$toast.success("Çıktı ilişkileri başarıyla kaydedildi!");
          } else {
            console.error('Kaydedilirken bir hata oluştu:', response.data);
            this.$toast.error("Çıktı ilişkileri güncellenirken bir hata oluştu!");
          }
        }
      }
    }
    console.log('Outcome ilişkileri başarıyla güncellendi');
    this.$toast.success("Çıktı ilişkileri başarıyla güncellendi!");
  } catch (error) {
    console.error('Outcome ilişkileri güncellenirken bir hata oluştu:', error);
    this.$toast.error("Çıktı ilişkileri güncellenirken bir hata oluştu!");
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
        outcomes: Array(this.outcomes.length).fill(false) // Öğrenim çıktılarına karşılık gelen varsayılan değerler içeren bir dizi oluştur
      };
    });
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
},
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
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
    generateMatrix() {
      this.matrix = Array.from({ length: this.rowCount }, () => Array(this.colCount).fill(false));
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
  },
};
</script>

<style scoped>

.table {
  width: max-content;
  table-layout: auto;
}
.flex-container {
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

.with-margin {
  margin-left: 10px;
}

.table input[type="text"] {
  width: 80px; /* Boyutunu en olarak kısalt */
  margin: 0 auto; /* Metin kutusunu yatayda ortala */
  display: block; /* Blok öğe olarak ayarla */
}

</style>