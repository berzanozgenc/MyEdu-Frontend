<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
            <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">myEdu
        </a>
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
            Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
        </a>
        <div v-if="course" style="margin: 0 auto; margin-top: 2%;">
      </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto"></ul>
            <span class="logout">
                <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
            </span>
        </div>
    </nav>

    <div class="flex-container">
        <div class="card menu" style="width: 18%; margin-left: 10px;">
        <div class="card-body">
            <h5 class="card-title">Menü</h5>
            <ul class="list-group">
                <li class="list-group-item" @click="goToAddCoursePage">
                    <i class="fas fa-graduation-cap"></i> Ders Sayfası
                </li>
                <li class="list-group-item" @click="goToProgramOutputPage">
                    <i class="fas fa-book"></i> Program Çıktıları Sayfası
                </li>
                <li class="list-group-item" @click="goToLoadStudentPage">
                    <i class="fas fa-chalkboard-teacher"></i> Öğrenci Yükleme Sayfası
                </li>
                <li class="list-group-item" @click="goToAdminCoursePage">
                    <i class="fa-solid fa-person-chalkboard"></i> Öğretmen Atamaları
                </li>
                <li class="list-group-item" @click="goToAdminGuidePage">
                    <i class="fas fa-chalkboard-teacher"></i> Kılavuz
                </li>
            </ul>
        </div>
    </div>
    <div class="card" style="width: auto; margin-left: 0%; overflow-x: auto;">
        <div style="margin: 0 auto;"class="card-body">
          <h5 style="color: #dc3545;" class="card-title">ÖĞRENİM ÇIKTILARI</h5>
          <h6>{{ course.code }} {{ course.courseName }} | {{ course.period }} {{ course.semester }}</h6>
          <table class="table table-sm">
            <thead>
              <tr>
                <th scope="col">Tanım</th>
                <th style="text-align: center;" scope="col">ÖÇ Sağlama Düzeyi</th>
                <th style="text-align: center;" scope="col">HEDEF</th>
                <th style="text-align: center;" scope="col">ARAÇ</th>
                <th style="text-align: center;" scope="col">SKOR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(outcome, index) in outcomes" :key="index">
                <td class="description-cell">{{ outcome.description }}</td>
                <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.desiredTarget.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.assessmentSum.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.scoreSum.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    <div class="card" style="width: 80%; margin-left: 2%; margin: 0 auto; overflow-x: auto;">
        <div class="card-body">
          <h5 style="color: #dc3545" class="card-title">PROGRAM ÇIKTILARI</h5>
          <h6>{{ course.code }} {{ course.courseName }} | {{ course.period }} {{ course.semester }}</h6>
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
              <tr v-for="(outcome, index) in programOutcomes" :key="index">
                <td class="description-cell">{{ outcome.programOutcome.number }}</td>
                <td class="description-cell">{{ outcome.programOutcome.description }}</td>
                <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.target.toFixed(2) }}</td>
                <td style="text-align: center;">{{ outcome.assessmentValue.toFixed(2)}}</td>
                <td style="text-align: center;">{{ outcome.score.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    


</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
    name: 'AdminCourseResults',
    data() {
    return {
      outcomes: [],
      programOutcomes: [],
      courseId: null,
      course: null
    };
  },
  created() {
    this.courseId = this.$route.params.courseId;
    this.calculateValues();
    this.fetchLearningOutcomes();
    this.calculateValuesPO()
      .then(() => this.fetchProgramOutcomes())
  },
    methods: {
        async calculateValuesPO() {
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
    this.programOutcomes = response.data.filter(outcome => !isNaN(outcome.levelOfProvision));
    // Sonrasında sırala
    this.programOutcomes.sort((a, b) => a.programOutcome.number - b.programOutcome.number);
  } catch (error) {
    console.error("Error fetching program outcomes:", error);
  }
},
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
        this.outcomes = response.data.filter(outcome => !isNaN(outcome.levelOfProvision));
        this.outcomes.sort((a, b) => {
            return a.id - b.id;
        });
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
      }
    },
        refreshPage() {
            window.location.reload();
        },
        async logoutUser() {
            const router = useRouter();
            localStorage.removeItem('store');
            await this.$store.dispatch('logoutUser');
            this.$router.push("/");
        },
        goToAddCoursePage() {
            // Ders sayfasına yönlendirme
            this.$router.push('/add-course');
        },
        goToProgramOutputPage() {
            // Program çıktıları sayfasına yönlendirme
            this.$router.push('/program-output-admin');
        },
        goToLoadStudentPage() {
            // Öğrenci yükleme sayfasına yönlendirme
            this.$router.push('/admin-load-student');
        },
        goToAdminCoursePage() {
            // Öğretmen atamaları sayfasına yönlendirme
            this.$router.push('/admin-course');
        },
        goToAdminGuidePage() {
            // Kılavuz sayfasına yönlendirme
            this.$router.push('/admin-guide');
        }
    }
}
</script>


<style scoped>
.math-sum {
  font-weight: bold;
}

.description-cell {
  max-width: 600px; /* Adjust the width as needed */
  word-wrap: break-word;
}

.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
