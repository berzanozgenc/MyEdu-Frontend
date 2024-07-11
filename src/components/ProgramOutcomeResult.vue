<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <div v-if="course" style="margin: 0 auto; margin-top: 2%;">
        <h5>{{ course.code }} {{ course.courseName }} | {{ course.period }} {{ course.semester }}</h5>
      </div>
      <div style="margin-left: auto; margin-right: 2%;" class="ml-auto d-flex align-items-center">
        <span class="d-flex align-items-center">
          <img style="margin-right: 2px;" class="icon" src="../assets/profile.png" />
          <h6 class="mb-0 ml-2">{{ username }}</h6>
        </span>
        <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
      </div>
    </nav>

    <!-- Flex container -->
    <div class="flex-container">
      <!-- Side Menu -->
      <div class="card menu" style="width: 12%; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <ul class="list-group">
            <li class="list-group-item" @click="goToCoursePage">
              <i class="fas fa-book"></i> Derslerim
            </li>
            <li class="list-group-item" @click="goToInstructorLearningOutcomePage">
              <i class="fas fa-graduation-cap"></i> Öğrenim Çıktıları
            </li>
            <li class="list-group-item" @click="goToCourseProgramOutcomePage">
              <i class="fas fa-chalkboard-teacher"></i> Program Çıktıları
            </li>
            <li class="list-group-item" @click="goToMatchMatrixPage">
              <i class="fas fa-exchange-alt"></i> ÖÇ ve PÇ Eşleştirme
            </li>
            <li class="list-group-item" @click="goToStudentListPage">
              <i class="fas fa-users"></i> Öğrenci Listesi
            </li>
            <li class="list-group-item" @click="goToGuidePage">
              <i class="fas fa-users"></i> Kılavuz
            </li>
            <li class="list-group-item" @click="goToAboutUs">
              <i class="fas fa-info-circle"></i> Hakkımızda
            </li>
          </ul>
        </div>
      </div>
      <div class="card" style="width: 80%; margin-left: 2%; overflow-x: auto;">
        <div class="card-body">
          <h5 style="color: #dc3545" class="card-title">PROGRAM ÇIKTILARI</h5>
          <table class="table table-sm">
            <thead>
              <tr>
                <th style="vertical-align: top;" scope="col">No</th>
                <th style="vertical-align: top;" scope="col">Tanım</th>
                <th style="text-align: center;" scope="col">PÇ Sağlama Düzeyi</th>
                <th style="text-align: center;" scope="col">HEDEF</th>
                <th style="text-align: center;" scope="col">ARAÇ</th>
                <th style="text-align: center;" scope="col">SKOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(outcome, index) in outcomes" :key="index">
                <td class="description-cell">{{ outcome.programOutcome.number }}</td>
                <td class="description-cell">{{ outcome.programOutcome.description }}</td>
                <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.target.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.assessmentValue.toFixed(2)}}</td>
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
    <div id="chart-container" class="card" style="width: 90%; margin: 0 auto; overflow-x: auto;">
      <BarChartTwo :course-id="courseId" />  
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import BarChartTwo from './BarChartTwo.vue';
import { mapGetters } from 'vuex';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

export default {
  components: { BarChartTwo },
  data() {
    return {
      outcomes: [],
      courseId: null,
      course: null
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
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
    goToAboutUs(){
      this.$router.push('/about-us');
    },
    async calculateValues() {
      try {
        const courseId = this.$route.params.courseId;  
        await axios.post(`http://localhost:8080/courseProgramOutcomeResults/${courseId}`);
      } catch (error) {
        console.error("Error calculate program outcome values:", error);
      }
    },
    async fetchProgramOutcomes() {
  try {
    const courseId = this.$route.params.courseId;
    const response = await axios.get(`http://localhost:8080/courseProgramOutcomeResults/${courseId}`);
    // Geçerli olanları filtrele
    this.outcomes = response.data.filter(outcome => !isNaN(outcome.levelOfProvision));
    // Sonrasında sırala
    console.log("burası",this.outcomes)
    this.outcomes.sort((a, b) => a.programOutcome.number - b.programOutcome.number);
    const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
    this.course = responseCourse.data;
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
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
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
    goToGuidePage(){
this.$router.push('/guidance');
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
      this.$router.push("/");
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
.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>