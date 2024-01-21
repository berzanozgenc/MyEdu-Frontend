<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
        >myEdu</a
      >
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
        >Kişiselleştirilmiş Akademik Gelişim ve <br />
        Değerlendirme Sistemi</a
      >

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">
            Çıkış Yap
          </button>
        </span>
      </div>
    </nav>
    <div class="flex-container">
      <div class="card" style="width: 13rem; margin-left: 10px;">
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

      <div
        class="card"
        style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden"
      >
        
        <div class="card-body">
          <h5 class="card-title">Admin Sayfası</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Program Çıktısı</th>
                <th scope="col">Bölüm Adı</th>
                <th scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in programs" :key="index">
                <td>
                  <span v-if="editable === index && activeField === 'output'">
                    <input
                      v-model="item.output"
                      @blur="editable = -1; activeField = ''"
                    />
                  </span>
                  <span v-else @click="editCell(index, 'output')">{{ item.output }}</span>
                </td>
                <td>
                  <span v-if="editable === index && activeField === 'department'">
                    <select
                      v-model="item.department"
                      @blur="editable = -1; activeField = ''"
                    >
                      <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                      <option value="Elektrik Elektronik Mühendisliği">Elektrik Elektronik Mühendisliği</option>
                      <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                      <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                      <option value="Biyomedikal Mühendisliği">Biyomedikal Mühendisliği</option>
                    </select>
                  </span>
                  <span v-else @click="editCell(index, 'department')">{{ item.department }}</span>
                </td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteProgram(index)"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body">
            
            <button
              class="btn btn-outline-primary my-2 my-sm-0"
              style="width: 150px; height: 35px"
              type="submit"
              @click="addProgram"
            >
              Program Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPage",
  data() {
    return {
      programs: [
        { output: "Program Çıktısı 1", department: "Bilgisayar Mühendisliği" },

      ],
      selectedProgram: { output: "Program Çıktısı 1", department: "Bilgisayar Mühendisliği" },
      editable: -1,
      activeField: "",
    };
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    editCell(index, key) {
      this.editable = index;
      this.activeField = key;
    },
    deleteProgram(index) {
      this.programs.splice(index, 1);
    },
    addProgram() {
      this.programs.push({ output: "Program Çıktısı Yazınız...", department: "Bölümler" });
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
