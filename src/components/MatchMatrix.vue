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

      <!-- Matrix -->
      <div class="card" style="width: 80%;  overflow-x: auto;">
        <div class="card-body">
          <h5 style="color: #dc3545;" class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

          <span v-if="courseEditable">
            <button v-if="!editMode" @click="toggleEditMode" class="btn btn-primary mt-2 mr-2 float-right">
            <i class="fas fa-pencil-alt"></i>
          </button>
        </span>
          <!-- Düzenle butonu -->
         
          <br>
          <br>

          <!-- Matrix table -->
          <table class="table" style="min-width: 600px;">
  <thead>
    <tr>
      <th scope="col"></th>
      <th class="loDescription" v-for="(outcome, index) in outcomes" :key="index" scope="col">{{ outcome.description }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(program, programIndex) in programs" :key="programIndex">
      <th class="prDescription" scope="row">{{ program.number }}</th>
      <td v-for="(outcome, outcomeIndex) in outcomes" :key="outcomeIndex">
        <div style="align-items: center; justify-content: center; display: flex;">
          <input style="align-items: center; text-align: center" v-if="editMode" v-bind:placeholder="dummy(outcomeIndex, programIndex)" type="text" v-model="program.outcomes[outcomeIndex]">
          <span v-else>{{ dummy(outcomeIndex, programIndex) }}</span>
        </div>
      </td>
    </tr>
  </tbody>
</table>
          <!-- End of matrix table -->

          <!-- Uyarı mesajı -->
          <div v-if="!isColumnTotalValid" class="alert alert-danger">
            Sütun toplamları 100 olmalı!
          </div>

          <!-- Tümünü kaydet butonu -->
          <button v-if="editMode" @click="saveAllChanges" class="btn btn-success mt-3">Tümünü Kaydet</button>
          <button style="margin-left: 2px;" v-if="editMode" @click="disableEditMode" class="btn btn-danger mt-3">Vazgeç</button>
        </div>
      </div>
    </div>
    <div class="card" style="width: 80%; margin-left: 18%">
      <div class="card-body">
        <h5 class="card-title">Program Çıktıları</h5>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Program Numarası</th>
              <th scope="col">Program Adı</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(program, index) in programs" :key="index">
              <td>{{ program.number }}</td>
              <td>{{ program.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      editMode: false,
      isColumnTotalValid: true,
      courseEditable: null,
      outcomes: [],
      programs: [],
      course: null,
      contributions: []
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
    const courseId = this.$route.params.courseId;
    this.fetchLearningOutcomes(courseId);
    this.fetchProgramOutcomes(courseId);
    this.fetchCourse();
  },
  methods: {
    goToAboutUs(){
      this.$router.push('/about-us');
    },
    fetchCourse() {
      const courseId = this.$route.params.courseId;
      axios.get(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          this.course = response.data;
          this.courseEditable = this.course.editable
        })
        .catch(error => {
          console.error('Error fetching course:', error);
        });
    },
    contributionCalculate() {
      const contributionSums = this.contributions.reduce((accumulator, currentValue) => {
      const { learningId, contribution } = currentValue;
      accumulator[learningId] = (accumulator[learningId] || 0) + contribution;
      return accumulator;}, {});

      const isNotEqualTo100 = Object.values(contributionSums).some(sum => sum !== 100);

      if (isNotEqualTo100) {
        this.isColumnTotalValid = false
      } else {
        this.isColumnTotalValid = true
      }
    },

    dummy(outcomeIndex, programIndex) {
      var learningId = this.outcomes[outcomeIndex].id;
      var programId = this.programs[programIndex].id;
      var contribution = 0;

      for (var i = 0; i < this.contributions.length; i++) {
        let cont = this.contributions[i];
        if (cont.programId == programId && cont.learningId == learningId) {
          contribution = cont.contribution;
        }
      }
      return contribution;
    },
    async fillTable() {

      let items = [];
      for (var i = 0; i < this.outcomes.length; i++) {
        for (var j = 0; j < this.programs.length; j++) {
          let obj = {
            learningId: this.outcomes[i].id,
            programId: this.programs[j].id
          };
          items.push(obj);
        }
      }

      const response = await axios.post('http://localhost:8080/learning-outcome-program-outcome/contribution', {
        "learningOutcomeContributionDTOList": items
      });

      if (response.status == 200) {
        var tempList = [];
        for (var i = 0; i < response.data.contributions.length; i++) {
          var obj = {
            contribution: response.data.contributions[i].contribution,
            learningId: response.data.contributions[i].learningOutcome.id,
            programId: response.data.contributions[i].programOutcome.id
          };
          tempList.push(obj);
        }
        this.contributions = tempList;
        console.log(this.contributions);
        this.contributionCalculate();
      }
    },
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
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
    },
    goToLearningOutcomePage() {
      this.$router.push("/learning-outcome");
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    goToGuidePage() {
      this.$router.push('/guidance');
    },
    goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId } });
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    async saveAllChanges() {
      try {
        for (let i = 0; i < this.programs.length; i++) {
          const program = this.programs[i];
          for (let j = 0; j < program.outcomes.length; j++) {
            if (program.outcomes[j] !== undefined && program.outcomes[j] !== null) {
              await this.saveChanges(i, j);
            }
          }
        }
        this.$toast.success("Tüm değişiklikler başarıyla kaydedildi!");
        this.editMode = false; // Düzenleme modunu kapat
        await this.fillTable();
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
      this.$router.push("/");
    },
    async fetchLearningOutcomes(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        if (!response.ok) {
          throw new Error('Öğrenim çıktıları getirilirken bir hata oluştu.');
        }
        const data = await response.json();
        this.outcomes = data;
        this.outcomes.sort((a, b) => a.id - b.id);
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
        this.fillTable();
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },
    async fetchProgramOutcomes(courseId) {
      try {
        const responseDepartment = await axios.get(`http://localhost:8080/course/get-department/course/${courseId}`);
        const departmentId = responseDepartment.data.id;
        const response = await axios.get(`http://localhost:8080/program-outcomes/department/${departmentId}`);
        if (response.status !== 200) {
          throw new Error('Program çıktıları getirilirken bir hata oluştu.');
        }
        this.programs = response.data.map(program => {
          return {
            ...program,
            outcomes: Array(this.outcomes.length).fill(null)
          };
        });
        this.programs.sort((a, b) => a.number - b.number);
        this.fillTable();
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },
    async saveChanges(programIndex, outcomeIndex) {
      try {
        const program = this.programs[programIndex];
        const outcome = program.outcomes[outcomeIndex];
        const learningOutcomeId = this.outcomes[outcomeIndex].id;
        const programOutcomeId = program.id;
        const contribution = parseFloat(outcome);
        const courseId = this.$route.params.courseId;

        if (isNaN(contribution) || contribution < 0 || contribution > 100 || outcome.trim() === '') {
          // Girilen değer geçerli bir sayı değil veya boşsa
          this.$toast.error("Lütfen geçerli bir değer giriniz.");
          return;
        }

        const response = await axios.post('http://localhost:8080/learning-outcome-program-outcome', {
          learningOutcomeId,
          programOutcomeId,
          contribution,
          courseId
        });

        if (response.status === 201 || response.status === 200) {
        } else {
          console.error('Kaydedilirken bir hata oluştu:', response.data);
          this.$toast.error("Kaydedilirken bir hata oluştu!");
        }
      } catch (error) {
        console.error('Kaydedilirken bir hata oluştu:', error);
        this.$toast.error("Kaydedilirken bir hata oluştu!");
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    disableEditMode() {
      this.editMode = false;
    },
  },
};
</script>



<style scoped>

.prDescription {
  max-width: 800px; /* Adjust the width as needed */
  word-wrap: break-word;
}

.table th.loDescription {
  text-align: left;
  vertical-align: top;
}


.loDescription
{
  max-width: 700px; /* Adjust the width as needed */
  word-wrap: break-word;
}

.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
