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
          <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToCourseProgramOutcomePage">Program Çıktıları</a><br />
          <a href="#" class="card-link">ÖÇ - PÇ Eşleştirme</a><br />
        </div>
      </div>

      <!-- Matrix -->
      <div class="card" style="width: auto; margin-left: 100px; overflow-x: auto;">
        <div class="card-body">
          <h5 class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

          <!-- Düzenle butonu -->
          <button v-if="!editMode" @click="toggleEditMode" class="btn btn-primary mt-2 mr-2 float-right">
  <i class="fas fa-pencil-alt"></i> 
</button>

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
                    <input v-if="editMode" v-bind:placeholder="dummy(outcomeIndex, programIndex)" type="text" v-model="program.outcomes[outcomeIndex]">
                    <span v-else>{{ dummy(outcomeIndex, programIndex) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End of matrix table -->

          <!-- Tümünü kaydet butonu -->
          <button v-if="editMode" @click="saveAllChanges" class="btn btn-primary mt-3">Tümünü Kaydet</button>

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
      editMode: false,
      outcomes: [],
      programs: [],
      contributions: []
    };
  },
  created() {
    const courseId = this.$route.params.courseId;
    console.log("Current Course ID : ", courseId);
    this.fetchLearningOutcomes(courseId);
    this.fetchProgramOutcomes(courseId);
  },
  methods: {
    dummy(outcomeIndex, programIndex) {
  
      var learningId = this.outcomes[outcomeIndex].id 
      var programId = this.programs[programIndex].id 
      var contribution = 0;

      console.log("dummy");
      console.log(learningId)
      console.log(programId);

      for(var i = 0; i < this.contributions.length; i++) {
        let cont = this.contributions[i]
        if(cont.programId == programId && cont.learningId == learningId) {
          contribution = cont.contribution;
        }
      
      }
      return contribution;
    },

    async fillTable(){
      console.log("fill table")
      console.log(this.outcomes[0].id)

      let items = [];
      for(var i= 0; i < this.outcomes.length; i++) {
        for(var j = 0; j < this.programs.length; j++) {
          console.log("outcomes:" + this.outcomes[i].id + "programs:" + this.programs[j].id)
          let obj = {
            learningId: this.outcomes[i].id,
            programId: this.programs[j].id
          } 
          items.push(obj);
        }
      }
      console.log(items);

      const response = await axios.post('http://localhost:8080/learning-outcome-program-outcome/contribution', {
        "learningOutcomeContributionDTOList": items
        }, // async () => {
          //await axios.get('http://localhost:8080/contribution/program/1/learning/2')
        //}
      );
      if(response.status == 200) {

        var tempList = [];
        for(var i = 0; i < response.data.contributions.length; i++) {
          console.log("girdi")
          var obj = {
            contribution: response.data.contributions[i].contribution,
            learningId: response.data.contributions[i].learningOutcome.id,
            programId: response.data.contributions[i].programOutcome.id
          }
          console.log(obj)
          tempList.push(obj)
        }
        this.contributions = tempList;
        console.log("***-----****-------")
        console.log(this.contributions);
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
    goToCourseProgramOutcomePage(){
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId }});
    },
    goToLearningOutcomePage() {
      this.$router.push("/learning-outcome");
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
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
      await router.push("/");
    },

    async fetchLearningOutcomes(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        if (!response.ok) {
          throw new Error('Öğrenim çıktıları getirilirken bir hata oluştu.');
        }
        const data = await response.json();
        this.outcomes = data;
        this.fillTable();
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    },

    async fetchProgramOutcomes(courseId) {
      try {
        const response = await axios.get(`http://localhost:8080/program-outcomes/course/${courseId}`);
        if (response.status !== 200) {
          throw new Error('Program çıktıları getirilirken bir hata oluştu.');
        }
        this.programs = response.data.map(program => {
          return {
            ...program,
            outcomes: Array(this.outcomes.length).fill(null)
          };
        });
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
        }, // async () => {
          //await axios.get('http://localhost:8080/contribution/program/1/learning/2')
        //}
      );

        if (response.status === 201 || response.status === 200) {
          console.log('Başarıyla kaydedildi.');
          
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
  },
};
</script>

<style scoped>
/* Your CSS styles */
</style>
