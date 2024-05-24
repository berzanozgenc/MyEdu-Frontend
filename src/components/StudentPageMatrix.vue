<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br />Değerlendirme Sistemi
      </a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>
    <div class="flex-container">
      <!-- Side Menu -->
      <div class="card menu" style="width: 12%; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <ul class="list-group">
            <li class="list-group-item" @click="goToStudentHome">
              <i class="fas fa-book"></i> Derslerim
            </li>
      
          </ul>
        </div>
      </div>

   <!-- Classes Card -->
<div class="card" style="width: 50%; margin-left: 10px">
<div class="card-body">
  <h5 class="card-title">Öğrenci Sağlama Düzeyleri</h5>

  <!-- First Table: Pç1, Pç2, Pç3 -->
  <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Öğr. Çıktı</th>
              <th scope="col">ÖÇ'leri Sağlama Düzeyi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(outcome, index) in learningOutcomeResults" :key="index">
              <td class="description-cell">{{ outcome.learningOutcome.description }}</td>
              <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">Prg. Çıktı</th>
              <th scope="col">PÇ'leri Sağlama Düzeyi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(outcome, index) in programOutcomeResults" :key="index">
              <td class="description-cell">{{ outcome.programOutcome.description }}</td>
              <td style="text-align: center;">%{{ outcome.levelOfProvision.toFixed(3) }}</td>
       
            </tr>
          </tbody>
        </table>
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
  name: "StudentPageMatrix",
  data() {
    return {
      student: null,
      outcomes: [],
      programOutcomes: [],
      programOutcomeResults: [],
      learningOutcomeResults: []
    };
  },
  created(){
    this.getStudentById();
    this.courseId = this.$route.params.courseId;
    this.calculateStudentValues();
  },
  methods: {
    async calculateStudentValues() {
    try {
        const store = useStore(); // Vuex store'u al
        const student = store.getters.getUser;
        const userId = student.userId;
        const courseId = this.$route.params.courseId;
        const response = await axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        const learningOutcomeList = response.data;
        console.log(userId);
        console.log("lolist",learningOutcomeList);
        const requestBody = {
            userId: userId,
            learningOutcomeList: learningOutcomeList
        };
        await axios.post(`http://localhost:8080/student-learning-outcome`, requestBody);
        this.calculateStudentValuesPO(learningOutcomeList, userId);
    } catch (error) {
        console.error("Error calculate student calculation values:", error);
    }
},
      async calculateStudentValuesPO(learningOutcomeList, userId){
        try {
        const courseId = this.$route.params.courseId;
        const response = await axios.get(`http://localhost:8080/program-outcomes/course/${courseId}`);
        const programOutcomeList = response.data;
        const requestBody = {
            userId: userId,
            programOutcomeList: programOutcomeList
        };
        await axios.post(`http://localhost:8080/student-program-outcome`, requestBody);
        this.getProgramOutcomeResults(programOutcomeList, userId);
        this.getLearningOutcomeResults(learningOutcomeList, userId);
    } catch (error) {
        console.error("Error calculate student calculation values:", error);
    }
},
async getProgramOutcomeResults(programOutcomeList, userId) {
    try {
        const programOutcomeIds = programOutcomeList.map(outcome => outcome.id);

        // Kullanıcının program outcome'larına göre sonuçları alma
        const userProgramOutcomeResponse = await axios.post(`http://localhost:8080/student-program-outcome/user/${userId}/program-outcome`, programOutcomeIds);
        
        // Gelen verileri kullanabilirsiniz
        let programOutcomeResults = userProgramOutcomeResponse.data;
        
        // Program outcome'ları idsine göre sırala
        programOutcomeResults.sort((a, b) => {
            return a.programOutcome.id - b.programOutcome.id;
        });

        programOutcomeResults = programOutcomeResults.filter(result => !isNaN(result.levelOfProvision));
        this.programOutcomeResults = programOutcomeResults;
    } catch (error) {
        console.error("Error fetching program outcome results:", error);
    }
},

async getLearningOutcomeResults(learningOutcomeList, userId) {
    try {
        const learningOutcomeIds = learningOutcomeList.map(outcome => outcome.id);

        // Kullanıcının program outcome'larına göre sonuçları alma
        const userLearningOutcomeResponse = await axios.post(`http://localhost:8080/student-learning-outcome/user/${userId}/learning-outcome`, learningOutcomeIds);
        
        // Gelen verileri kullanabilirsiniz
        let learningOutcomeResults = userLearningOutcomeResponse.data;
        
        // Program outcome'ları idsine göre sırala
        learningOutcomeResults.sort((a, b) => {
            return a.learningOutcome.id - b.learningOutcome.id;
        });

        console.log(learningOutcomeResults);
        learningOutcomeResults = learningOutcomeResults.filter(result => !isNaN(result.levelOfProvision));
        this.learningOutcomeResults = learningOutcomeResults;
    } catch (error) {
        console.error("Error fetching learning outcome results:", error);
    }
},  

    async getStudentById(){
      const store = useStore(); // Vuex store'u al
      this.student = store.getters.getUser.userId;
    },
    goToLoginPage() {
    this.$router.push("/");
  },
  goToInstructorLearningOutcomePage() {
    const courseId = this.$route.params.courseId;
    this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
  },
  goToMatchMatrixPage() {
    const courseId = this.$route.params.courseId;
    this.$router.push({ name: "MatchMatrix", params: { courseId: courseId } });
  },
  goToStudentInfoPage() {
    this.$router.push("/student-info");
  },
  goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId }});
      },
  goToCourseProgramOutcomePage() {
    const courseId = this.$route.params.courseId;
    this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
  },

  goToStudentHome() {
    this.$router.push({ name: "StudentHome" });
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
  }
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

.accordion-content {
  margin-left: 20px; /* Adjust as needed */
}

.info-icon {
  font-size: 0.8em;
  cursor: pointer;
  margin-right: 5px;
}

.explanation {
  font-size: 0.8em;
  margin-bottom: 5px;
}

.modal {
  background: rgba(0, 0, 0, 0.5); /* Background rengi ve saydamlık */
  position: fixed; /* Sayfanın üzerinde sabit kalacak */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex; /* İçerik merkezi konumlandırma için */
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  background: white;
  padding: 20px;
  border-radius: 5px;
}

.modal-title {
  margin-bottom: 0;
}

.custom-navbar {
  background-color: skyblue !important;
}
</style>
