<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">myEdu</a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>
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
        <div class="card" style="width: 13rem; margin-left: 10px;">
          <div class="card-body">
            <h5 class="card-title">Menü</h5>
            <a href="#" class="card-link" >Ders Sayfası</a><br />
            <a href="#" class="card-link" @click="goToProgramOutputPage">Program Çıktıları Sayfası</a><br />
            <a href="#" class="card-link" @click="goToLoadStudentPage" >Öğrenci Yükleme Sayfası</a><br />
          </div>
        </div>

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Ders Sayfası</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Fakülte Adı</th>
                <th scope="col">Bölüm Adı</th>
                <th scope="col">Ders Adı</th>
                <th scope="col">AKTS</th>
                <th scope="col">Kredi</th>
                <th scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in courses" :key="index">
                <td>
                  <span v-if="editable === index && activeField === 'faculty'">
                    <select
                      v-model="item.faculty"
                      @blur="editable = -1; activeField = ''"
                    >
                      <option value="Mühendislik">Mühendislik</option>
                    </select>
                  </span>
                  <span v-else @click="editCell(index, 'faculty')">{{ item.faculty }}</span>
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
                  <span v-if="editable === index && activeField === 'courseName'">
                    <input v-model="item.courseName" @blur="editable = -1; activeField = ''" />
                  </span>
                  <span v-else @click="editCell(index, 'courseName')">{{ item.courseName }}</span>
                </td>
                <td>
                  <span v-if="editable === index && activeField === 'akts'">
                    <input v-model="item.akts" @blur="editable = -1; activeField = ''" />
                  </span>
                  <span v-else @click="editCell(index, 'akts')">{{ item.akts }}</span>
                </td>
                <td>
                  <span v-if="editable === index && activeField === 'credit'">
                    <input v-model="item.credit" @blur="editable = -1; activeField = ''" />
                  </span>
                  <span v-else @click="editCell(index, 'credit')">{{ item.credit }}</span>
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="deleteCourse(index)">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body">
            <button
              class="btn btn-outline-primary my-2 my-sm-0"
              style="width: 150px; height: 35px"
              type="submit"
              @click="addCourse"
            >
              Ders Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddCoursePage",
  data() {
    return {
      courses: [
        { faculty: "Mühendislik", department: "Bilgisayar Mühendisliği", courseName: "BİL477-Veri Madenciliğine Giriş", akts: 7, credit: 4 },
      ],
      selectedCourse: { faculty: "Mühendislik", department: "Bilgisayar Mühendisliği", courseName: "Program Çıktısı 1", akts: 7, credit: 4 },
      editable: -1,
      activeField: "",
    };
  },
  methods: {
    
    goToProgramOutputPage(){
      this.$router.push("/program-output");
    }, 
    goToLoadStudentPage(){
      this.$router.push("/admin-load-student");
    },
    goToLoginPage(){
      this.$router.push("/");
    },
    refreshPage() {
      //window.location.reload();
      this.$router.push("/admin-home");
    },
    editCell(index, key) {
      this.editable = index;
      this.activeField = key;
    },
    deleteCourse(index) {
      this.courses.splice(index, 1);
    },
    addCourse() {
      this.courses.push({ faculty: "Fakülte Adı", department: "Bölümler", courseName: "Ders Adı", akts: 0, credit: 0 });
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
