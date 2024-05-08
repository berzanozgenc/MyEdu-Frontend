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

    <div class="flex-container">
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim</a><br />
          <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToCourseProgramOutcomePage">Program Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
        </div>
      </div>

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Öğrenci Notları</h5>
          <table class="table">
  <thead>
    <tr>
      <th scope="col">Öğrenci</th>
      <!-- assessments dizisini kullanarak sütun başlıklarını oluştur -->
      <th v-for="(assessment, index) in assessments" :key="assessment.assessmentId" scope="col">
        <!-- İsimlendirme kontrolü -->
        <span v-if="isQuestionBased">Soru {{ index + 1 }}</span>
        <span v-else>{{ assessment.name }} {{ index + 1 }}</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="student in students" :key="student.id">
      <th scope="row">{{ student.firstName }} {{ student.lastName }} {{ student.studentNumber }}</th>
      <!-- Değerlendirme hücrelerini öğrenci sayısı kadar oluştur -->
      <td v-for="(assessment, index) in assessments" :key="assessment.assessmentId" contenteditable="true">-</td>
    </tr>
  </tbody>
</table>
<button type="button" class="btn btn-primary">Notları Kaydet</button>
          
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: "StudentInfo",
  data() {
    return {
      assessments: [],
      isQuestionBased: false,
      students: [], // Öğrenci listesini tutmak için yeni bir veri alanı
    };
  },
  created() {
    const courseId = this.$route.params.courseId;
    const generalAssessmentId = this.$route.params.generalAssessmentId;

    // Dersi alan öğrencileri getir
    axios.get(`http://localhost:8080/student-course/${courseId}/students`)
      .then(response => {
        this.students = response.data; // Öğrenci listesini al
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching student list:', error);
      });

    // Genel değerlendirmeye ait soruları veya değerlendirmeleri getir
    axios.get(`http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`)
      .then(response => {
        this.assessments = response.data; // Aldığımız veriyi assessments değişkenine atadık
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });

    // Genel değerlendirmenin soru tabanlı olup olmadığını kontrol et
    axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`)
      .then(response => {
        this.isQuestionBased = response.data; // Aldığımız veriyi kullanarak isQuestionBased değişkenini güncelle
      })
      .catch(error => {
        console.error('Error fetching question based status:', error);
      });
  },
  methods: {
    goToLoginPage() {
      this.$router.push("/");
    },
    goToInstructorLearningOutcomePage() {
  const courseId = this.$route.params.courseId;
  this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
},
    goToMatchMatrixPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToCourseProgramOutcomePage(){
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId }});
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
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

.card {
  margin-top: 3%;
  margin-left: auto;
  margin-right: auto;
}

.icon {
  width: 60px;
}

.list-group a {
  text-decoration: none;
  color: black;
  font-family: "Calibri", sans-serif;
  font-size: 17px;
  font-weight: bold;
}

.table th,
.table td {
  border: 1px solid #dee2e6;
}

.table th {
  background-color: #f8f9fa;
}

.table td {
  background-color: #fff;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}

.btn-outline-success {
  border-color: #28a745;
  color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: #fff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.card-body table {
  width: 100%;
  overflow-x: auto;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

input,
select {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input.editable,
select.editable {
  border-color: #007bff;
}
</style>
