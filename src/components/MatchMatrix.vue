<template>
  <div class="flex-container">
    <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
      <!-- Existing code for the profile header -->
      <div class="card-body">
        <h5 class="card-title">Derslerim</h5>

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
                <input type="checkbox" @change="handleCheckboxChange(rowIndex, cellIndex)" />
              </td>
            </tr>
          </tbody>
        </table>
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
      rowCount: 6,
      colCount: 7,
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
        ["", ...Array(this.colCount).fill("").map((_, index) => `Col ${index + 1}`)],
        ...Array(this.rowCount).fill(["Row", ...Array(this.colCount).fill(false)]),
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
