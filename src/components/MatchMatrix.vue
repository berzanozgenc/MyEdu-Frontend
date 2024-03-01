<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">myEdu</a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="goToLoginPage" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
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

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden; margin-left: 100px;">
        <div class="card-body">
          <h5 class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

          <!-- Your matrix code goes here -->
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th v-for="(col, colIndex) in matrix[0]" :key="colIndex" scope="col">ÖÇ{{ colIndex + 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in matrix" :key="rowIndex">
                <th scope="row">PÇ{{ rowIndex + 1 }}</th>
                <td v-for="(col, colIndex) in row" :key="colIndex">
                  <input type="checkbox" v-model="matrix[rowIndex][colIndex]">
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End of matrix code -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rowCount: 12,
      colCount: 3,
      matrix: [],
    };
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
    goToCoursePage() {
      this.$router.push("/instructor-home");
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

</style>
