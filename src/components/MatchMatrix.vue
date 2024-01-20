<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" class="navbar-brand with-margin" href="#">myEdu</a>
      <a @click="refreshPage" class="navbar-brand with-margin" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <!-- Add your menu items here if needed -->
        </ul>
        <span class="logout">
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="flex-container">
        <div class="card" style="width: 13rem; margin-left: 0px;">
          <div class="card-body">
            <h5 class="card-title">menu</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
            <p class="card-text">Navigasyon menüsü</p>
            <a href="#" class="card-link">Derslerim   </a><br />
            <a href="#" class="card-link">Öğrenci bilgileri</a><br />
            <a href="#" class="card-link">Ders bilgileri</a><br />
            <a href="#" class="card-link">Öğrenme çıktıları</a>
          </div>
        </div>

        <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden; margin-left: 100px;">
          <!-- Existing code for the profile header -->
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
    generateMatrix() {
      this.matrix = Array.from({ length: this.rowCount }, () => Array(this.colCount).fill(false));
    },
    refreshPage() {
      // Implement your page refresh logic here
    },
  },
};
</script>

<style scoped>
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
.with-margin {
  margin-left: 10px;
}

</style>
