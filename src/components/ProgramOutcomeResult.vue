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
      <div class="card" style="width: 16%; margin-left: 10px;">
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
      <div class="card" style="width: 80%; margin-left: 2%; overflow-x: auto;">
        <div class="card-body">
          <h5 class="card-title">PROGRAM ÇIKTILARI</h5>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Prg. Çıktı</th>
                <th scope="col">PÇ'leri Sağlama Düzeyi</th>
                <th scope="col">HEDEFLER</th>
                <th scope="col">ARAÇLAR</th>
                <th scope="col">SKOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(outcome, index) in outcomes" :key="index">
                <td class="description-cell">{{ outcome.description }}</td>
                <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(3) }}</td>
                <td style="text-align: center;">{{ outcome.target.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.assessmentValue.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.score.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <button @click="downloadExcel" class="btn btn-outline-primary mt-3">Sonuçları İndir</button>
        </div>
      </div>
    </div>
  </div>
  <div style="align-items: center">
    <div id="chart-container" class="card" style="width: 90%; margin-left: 2%; overflow-x: auto;">
      <BarChartTwo :course-id="courseId" />  
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import BarChartTwo from './BarChartTwo.vue';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

export default {
  components: { BarChartTwo },
  data() {
    return {
      outcomes: [],
      courseId: null,
    };
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.calculateValues()
      .then(() => this.fetchProgramOutcomes())
      .then(() => {
       
      })
      .catch(error => {
        console.error('Bir hata oluştu:', error);
      });
  },
  methods: {
    async calculateValues() {
      try {
        const courseId = this.$route.params.courseId;
        await axios.get(`http://localhost:8080/program-outcomes/course/${courseId}/calculate-and-set-target`);
        await axios.put(`http://localhost:8080/program-outcomes/course/${courseId}/calculate-and-set-assessment-value`);
        await axios.post(`http://localhost:8080/program-outcomes/course/${courseId}/calculate-and-set-score-and-level-of-provision`);
      } catch (error) {
        console.error("Error calculate program outcome values:", error);
      }
    },
    async fetchProgramOutcomes() {
      try {
        const courseId = this.$route.params.courseId;
        const response = await axios.get(`http://localhost:8080/program-outcomes/course/${courseId}`);
        this.outcomes = response.data;
        this.outcomes.sort((a, b) => {
            return a.id - b.id;
        });
      } catch (error) {
        console.error("Error fetching program outcomes:", error);
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
    async downloadExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Program Çıktıları');

      // Başlıkları ekleyin
      worksheet.columns = [
        { header: 'Prg. Çıktı', key: 'description', width: 30 },
        { header: 'PÇ\'leri Sağlama Düzeyi', key: 'levelOfProvision', width: 20 },
        { header: 'HEDEFLER', key: 'target', width: 15 },
        { header: 'ARAÇLAR', key: 'assessmentValue', width: 15 },
        { header: 'SKOR', key: 'score', width: 15 },
      ];

      // Verileri ekleyin
      this.outcomes.forEach(outcome => {
        worksheet.addRow({
          description: outcome.description,
          levelOfProvision: `%${outcome.levelOfProvision.toFixed(3)}`,
          target: outcome.target.toFixed(2),
          assessmentValue: outcome.assessmentValue.toFixed(2),
          score: outcome.score.toFixed(2),
        });
      });
      // Grafiği yakalayın
  const chartElement = document.getElementById('chart-container');
  const canvas = await html2canvas(chartElement, { scale: 5 }); // Resmi yüksek çözünürlükte yakalamak için scale değerini artırdık
  const imageData = canvas.toDataURL('image/png');


      // Yeni bir çalışma sayfası ekleyin ve grafiği ekleyin
      const chartWorksheet = workbook.addWorksheet('Grafik');
      const imageId = workbook.addImage({
        base64: imageData,
        extension: 'png',
      });

      chartWorksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: canvas.width / 7.5, height: canvas.height / 7.5 },
      });
      // Excel dosyasını oluşturun
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Dosyayı indirin
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ProgramCiktilariSonuclari.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>


<style scoped>
.description-cell {
  max-width: 600px; /* Adjust the width as needed */
  word-wrap: break-word;
}
</style>