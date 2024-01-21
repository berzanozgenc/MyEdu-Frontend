<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
      >myEdu</a>
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
      >Kişiselleştirilmiş Akademik Gelişim ve <br />
        Değerlendirme Sistemi</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="goToLoginPage" class="btn btn-outline-danger my-2 my-sm-0" type="submit">
            Çıkış Yap
          </button>
        </span>
      </div>
    </nav>
    <div class="flex-container">
  <div class="card" style="width: 13rem;margin-left: 10px;">
  <div class="card-body">
    <h5 class="card-title">Menü</h5>
    <a href="#" class="card-link" @click="goToCoursePage">Derslerim   </a><br />
    <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />    
    <a href="#" class="card-link" @click="goToInstructorLearningOutcome">Öğrenim Çıktıları</a><br />
    <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
  </div>
</div>
      <div class="card">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Öğrenme çıktıları</th>
              
              <!-- Dinamik olarak eklenen sütunlar -->
              <th v-for="(quiz, index) in quizColumns" :key="index" scope="col">
                <div class="d-flex align-items-center">
                  <span @click="selectColumn(index)">{{ `quiz${index + 1}` }}</span>
                  <button
                    v-if="selectedColumn === index"
                    class="btn btn-sm btn-danger ml-2"
                    @click="removeQuiz(index)"
                  >
                    Sil
                  </button>
                </div>
              </th>

              <th scope="col">∑</th>
              <th scope="col">
                <button type="button" class="btn btn-success" @click="addNewQuiz">+</button>
              </th>
              
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Puan</th>
              <td contenteditable="true">-</td>

              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="(quiz, index) in quizColumns" :key="index" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 1</th>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="(quiz, index) in quizColumns" :key="index" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 2</th>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="(quiz, index) in quizColumns" :key="index" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 3</th>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="(quiz, index) in quizColumns" :key="index" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">Toplam (∑)</th>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="(quiz, index) in quizColumns" :key="index" contenteditable="true"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-light">kaydet</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LearningOutcome",
  data() {
    return {
      quizColumns: [1, 2, 3], // Başlangıçta üç sütun var
      selectedColumn: null,
    };
  },
  methods: {
    goToLoginPage(){
      this.$router.push("/");
    },
    goToCoursePage(){
      this.$router.push("/instructor-home");
    },
      goToLearningOutcomePage(){
      this.$router.push("/learning-outcome");
    },
    goToMatchMatrixPage(){
      this.$router.push("/instructor-match-matrix");
    },
    goToStudentInfoPage(){
      this.$router.push("/student-info");
    },
    goToInstructorLearningOutcome(){
      this.$router.push("/instructor-learning-outcome");
    },
    refreshPage() {
      //window.location.reload();
      this.$router.push("/instructor-home");
    },
    addNewQuiz() {
      this.quizColumns.push(this.quizColumns.length + 1);
    },
    removeQuiz(index) {
      if (this.quizColumns.length > 1) {
        this.quizColumns.splice(index, 1);
        this.selectedColumn = null;
      }
    },
    selectColumn(index) {
      this.selectedColumn = index;
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
</style>
