<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">myEdu</a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <!-- Add your menu items here if needed -->
        </ul>
        <span class="logout">
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <div class="flex-container">
      <div class="card" style="width: 13rem;margin-left: 10px;">
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

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <!-- Existing code for the profile header -->
        <div class="card-body">
          <h5 class="card-title">PROGRAM YETERLİLİKLERİ (P) / DERSİN ÖĞRENME KAZANIMLARI (Ö) MATRİSİ</h5>

          <!-- Clear existing content and add the dynamic matrix -->
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col"></th> <!-- Empty corner cell -->
                <th v-for="(col, colIndex) in matrix[0]" :key="colIndex" scope="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in matrix.slice(1)" :key="rowIndex">
                <td scope="row">{{ row[0] }}</td>
                <td v-for="(cell, cellIndex) in row.slice(1)" :key="cellIndex">
                  <input type="checkbox" @change="handleCheckboxChange(rowIndex, cellIndex)" v-model="matrix[rowIndex][cellIndex + 1]" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "jquery";

export default {
  name: "MatchMatrix",
  data() {
    return {
      matrix: [],
      rowCount: 3,
      colCount: 3,
    };
  },
  created() {
    this.initializeMatrix();
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    handleCheckboxChange(rowIndex, colIndex) {
      // Handle the checkbox change event
      // You can add your logic here
      console.log("Checkbox clicked:", rowIndex, colIndex);
    },
    updateMatrix() {
      // Update the matrix based on row count
      this.matrix = [
        [...Array(this.colCount).fill("").map((_, index) => `ÖÇ ${index + 1}`)],
        ...Array(this.rowCount).fill(0).map((_, index) => [`PÇ ${index + 1}`, ...Array(this.colCount).fill(false)]),
      ];
    },
    initializeMatrix() {
      // Initialize the matrix when the component is created
      this.updateMatrix();
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
</style>
