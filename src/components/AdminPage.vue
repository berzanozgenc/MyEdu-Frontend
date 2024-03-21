<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#"> <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;"></a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <!-- Ana İçerik -->
    <div class="flex-container">
      <!-- Sol Menü -->
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToAddCoursePage">Ders Sayfası</a><br />
          <a href="#" class="card-link">Program Çıktıları Sayfası</a><br />
          <a href="#" class="card-link" @click="goToLoadStudentPage">Öğrenci Yükleme Sayfası</a><br />
        </div>
      </div>

      <!-- Program Çıktıları -->
      <div class="card" style="width: 80rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Program Çıktıları Sayfası</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Program Çıktısı</th>
                <th scope="col">Program Çıktısı Açıklaması</th>
                <th scope="col">Bölüm Adı</th>
                <th scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in programs" :key="item.id">
                <td>{{ 'PÇ ' + (index + 1) }}</td>
                <td>
                  <span v-if="!item.editable">{{ item.description }}</span>
                  <input v-else type="text" class="form-control" id="description" v-model="item.description" style="width: 250px;" @blur="saveProgram(index)" />
                </td>
                <td>
                  <span v-if="!item.editable">{{ item.department }}</span>
                  <select v-else class="form-control" id="department" v-model="item.department" style="width: 250px;" @blur="saveProgram(index)">
                    <option disabled selected value="">Bölüm Seçiniz</option>
                    <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                    <option value="Elektrik Elektronik Mühendisliği">Elektrik Elektronik Mühendisliği</option>
                    <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                    <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                    <option value="Biyomedikal Mühendisliği">Biyomedikal Mühendisliği</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-danger btn-sm" @click="deleteProgram(item.id, index)">Sil</button>
                  <button v-if="!item.editable" class="btn btn-warning btn-sm ml-2 text-white" @click="editProgram(item)">Düzenle</button>
                  <button v-else class="btn btn-success btn-sm ml-2" @click="saveProgram(index)">Kaydet</button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Ekle Butonu ve Alanlar -->
          <div class="card-body">
            <div class="form-group">
              <label for="newProgramOutput">Program Çıktısı Açıklaması:</label>
              <input type="text" class="form-control" id="newProgramOutput" v-model="newProgramOutput" style="width: 250px;">
            </div>
            <div class="form-group">
              <label for="newProgramDepartment">Bölüm Adı:</label>
              <select class="form-control" id="newProgramDepartment" v-model="newProgramDepartment" style="width: 250px;">
                <option disabled selected value="">Bölüm Seçiniz</option>
                <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                <option value="Elektrik Elektronik Mühendisliği">Elektrik Elektronik Mühendisliği</option>
                <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                <option value="Biyomedikal Mühendisliği">Biyomedikal Mühendisliği</option>
              </select>
            </div>
            <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px" type="submit" @click="addProgram">PÇ Ekle</button>
          </div>
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
  name: "AdminPage",
  data() {
    return {
      programs: [],
      newProgramOutput: "",
      newProgramDepartment: "",
    };
  },
  methods: {
    goToLoadStudentPage() {
      this.$router.push("/admin-load-student");
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToAddCoursePage() {
      this.$router.push("/add-course");
    },
    refreshPage() {
      this.$router.push("/admin-home");
    },
    editProgram(item) {
      item.editable = true;
    },
    saveProgram(index) {
      const program = this.programs[index];
      axios.put(`http://localhost:8080/program-outcomes/${program.id}`, {
          description: program.description,
          department: program.department
        })
        .then(response => {
          console.log('Program güncellendi:', response.data);
          program.editable = false;
        })
        .catch(error => {
          console.error('Program güncellenirken bir hata oluştu:', error);
        });
    },
    deleteProgram(programId, index) {
      axios.delete(`http://localhost:8080/program-outcomes/${programId}`)
        .then(response => {
          console.log('Program silindi:', response.data);
          this.programs.splice(index, 1);
        })
        .catch(error => {
          console.error('Program silinirken bir hata oluştu:', error);
        });
    },
    logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem('store');
            this.$store.dispatch('logoutUser');
            this.$router.push("/");
        },
    addProgram() {
      axios.post('http://localhost:8080/program-outcomes', {
          description: this.newProgramOutput,
          department: this.newProgramDepartment
        })
        .then(response => {
          console.log('Yeni program çıktısı eklendi:', response.data);
          this.$toast.success("Yeni program çıktısı eklendi");
          this.programs.push(response.data);
          // Yeni program ekledikten sonra inputları temizle
          this.newProgramOutput = "";
          this.newProgramDepartment = "";
        })
        .catch(error => {
          console.error('Program eklenirken bir hata oluştu:', error);
          this.$toast.success("Program çıktısı eklenirken bir hata oluştu:");
        });
    },
    getPrograms() {
      axios.get('http://localhost:8080/program-outcomes')
        .then(response => {
          console.log('Alınan program çıktıları:', response.data);
          this.programs = response.data.map(program => ({
            ...program,
            editable: false
          }));
        })
        .catch(error => {
          console.error('Programlar alınırken bir hata oluştu:', error);
        });
    },
  },
  created() {
    this.getPrograms();
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
