<template>
  <div>
    <!-- Navbar -->
    <nav
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: #98bdff"
    >
      <a
        @click="refreshPage"
        style="margin-left: 10px"
        class="navbar-brand"
        href="#"
      >
        <img
          src="../assets/Baskent_University_Logo.png"
          alt="Logo"
          style="max-height: 50px"
        />myEdu</a
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
          <button
            @click="logoutUser"
            class="btn btn-outline-danger my-2 my-sm-0"
            type="submit"
          >
            Çıkış Yap
          </button>
        </span>
      </div>
    </nav>

    <!-- Ana İçerik -->
    <div class="flex-container">
      <!-- Side Menu -->
      <div class="card menu" style="width:18%;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <ul class="list-group">
            <li class="list-group-item" @click="goToAddCoursePage">
              <i class="fas fa-graduation-cap"></i> Ders Sayfası
            </li>
            <li class="list-group-item" @click="goToProgramOutputPage">
              <i class="fas fa-book"></i> Program Çıktıları Sayfası
            </li>
            <li class="list-group-item" @click="goToAdminCoursePage">
              <i class="fa-solid fa-person-chalkboard"></i> Öğretmen Atamaları
            </li>
            <li class="list-group-item" @click="goToLoadStudentPage">
                <i class="fa-solid fa-person-chalkboard"></i> Öğrenciler
              </li>
            <li class="list-group-item" @click="goToAdminGuidePage">
              <i class="fas fa-chalkboard-teacher"></i> Kılavuz
            </li>

            <li class="list-group-item" @click="goToResultPage">
              <i class="fas fa-diagram-project"></i> Sonuçlar
            </li>
          </ul>
        </div>
      </div>

      <!-- Program Çıktıları -->
      <div class="card" style="width: 80%; height: 100%">
        <div class="card-body" style="overflow-x: auto">
          <h5 class="card-title">Program Çıktıları</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" style="width: 15%">Program Çıktısı No.</th>
                <th scope="col" style="width: 70%">Tanım</th>
                <th scope="col" style="width: 15%">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in programs" :key="index">
                <td>
                  <input
                    v-if="item.editable"
                    type="number"
                    class="form-control editable"
                    v-model="item.number"
                    style="width: 100%"
                  />
                  <div v-else>{{ item.number }}</div>
                </td>

                <td>
                  <input
                    v-if="item.editable"
                    type="text"
                    class="form-control editable"
                    v-model="item.description"
                    style="width: 250px"
                  />
                  <div class="descriptionField" v-else>
                    {{ item.description }}
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteProgram(item.id, item)"
                  >
                    Sil
                  </button>
                  <button
                  style="margin-left: 2px;"
                    v-if="item.editable"
                    class="btn btn-success btn-sm text-white"
                    @click="updateProgram(item)"
                  >
                    Kaydet
                  </button>
                  <button
                    style="margin-left: 2px"
                    v-else
                    class="btn btn-warning btn-sm text-white"
                    @click="editProgram(item)"
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body">
            <h5 class="card-title">Program Çıktısı Ekle</h5>
            <div class="form-group">
              <label for="no">PÇ Numarası:</label>
              <input
                type="number"
                class="form-control"
                id="no"
                v-model="newProgram.number"
                style="width: 10%"
              />
              <label for="description">Tanım:</label>
              <textarea
                class="form-control"
                id="description"
                v-model="newProgram.description"
                style="width: 25%; height: 100px"
              ></textarea>
            </div>
            <br />
            <button
              class="btn btn-outline-primary my-2 my-sm-0"
              style="width: 150px; height: 35px"
              type="submit"
              @click="addProgram()"
            >
              PÇ Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showModal"
      class="modal"
      tabindex="-1"
      role="dialog"
      style="display: block"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Program Çıktısını Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu program çıktısını silmek istediğinizden emin misiniz?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              İptal
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "AdminPage",
  computed: {
    ...mapGetters(["getUser"]),
    // Diğer computed özellikler
  },
  data() {
    return {
      programs: [],
      selectedProgramOutcomeId: null,
      userDepartment: null,
      showModal: false,
      courses: [],
      newProgram: {
        output: "",
        description: "",
        number: "",
      },
    };
  },
  created() {
    this.getDepartment();
    this.fetchDepartmentProgramOutcomes();
  },
  methods: {
    goToResultPage(){
      this.$router.push("/admin-po-results");
    },
    confirmDelete() {
      axios
        .delete(
          `http://localhost:8080/program-outcomes/${this.selectedProgramOutcomeId}`
        )
        .then((response) => {
          console.log("Program silindi:", response.data);
          this.$toast.success(`Program çıktısı  başarıyla silindi.`);
          this.showModal = false;
          this.fetchDepartmentProgramOutcomes();
        })
        .catch((error) => {
          console.error("Program silinirken bir hata oluştu:", error);
        });
    },
    closeModal() {
      this.showModal = false;
    },
    getDepartment() {
      const user = this.getUser;
      this.userDepartment = user.department;
    },
    goToAdminGuidePage() {
      this.$router.push("/admin-guide");
    },
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
      axios
        .put(`http://localhost:8080/program-outcomes/${program.id}`, {
          description: program.description,
          department: program.department,
        })
        .then((response) => {
          console.log("Program güncellendi:", response.data);
          program.editable = false;
        })
        .catch((error) => {
          console.error("Program güncellenirken bir hata oluştu:", error);
        });
    },
    deleteProgram(programId) {
      this.selectedProgramOutcomeId = programId; // Silinecek programın ID'sini sakla
      this.showModal = true; // Modal'ı göster
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem("store");
      this.$store.dispatch("logoutUser");
      this.$router.push("/");
    },
    async addProgram() {
      const departmentId = this.userDepartment.id;
      try {
        const data = {
          description: this.newProgram.description,
          number: this.newProgram.number,
        };

        const existingProgram = this.programs.find(
          (program) => program.number === data.number
        );

        if (existingProgram) {
          this.$toast.error(
            `${data.number} numaralı program çıktısı zaten mevcut.`
          );
          return;
        } else {
          await axios.post(
          `http://localhost:8080/program-outcomes/${departmentId}`,
          data
        );
          this.$toast.success(
            `${this.newProgram.number} numaralı program çıktısı başarıyla oluşturuldu.`
          );
          this.fetchDepartmentProgramOutcomes();
        }
        this.fetchDepartmentProgramOutcomes();
      } catch (error) {
        console.error("Error adding program outcomes:", error);
        this.$toast.error("Program çıktısı eklenirken bir hata oluştu.");
      }
    },

    async fetchDepartmentProgramOutcomes() {
      console.log(this.userDepartment);
      try {
        const response = await axios.get(
          `http://localhost:8080/program-outcomes/department/${this.userDepartment.id}`
        );
        this.programs = response.data.sort((a, b) => a.number - b.number);
      } catch (error) {
        console.error("Error fetching outcomes:", error);
      }
    },

    async updateProgram(program) {
      const ownNumber = program.number;
      const existingProgram = this.programs.find(
    (existingProgram) => existingProgram.number === ownNumber && existingProgram.id !== program.id
  );

      try {
        if (existingProgram) {
          this.$toast.error(
            `${program.number} numaralı program çıktısı zaten mevcut.`
          );
          return;
        }else{
          const response = await axios.put(
          `http://localhost:8080/program-outcomes/${program.id}`,
          {
            description: program.description,
            number: program.number,
          }
        );
        console.log("Güncelleme isteği yanıtı:", response);

        if (response.status === 200) {
          program.editable = false; // Program düzenlenebilirlik durumunu güncelle
          this.fetchDepartmentProgramOutcomes();
          this.$toast.success("Program çıktısı başarıyla güncellendi.");
        } else {
          this.$toast.error("Program çıktısı güncellenirken bir hata oluştu.");
        }
        }
       
      } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı güncellenirken bir hata oluştu.");
        console.log("Hata:", error);
      }
    },

    goToAdminCoursePage() {
      this.$router.push("/admin-course");
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
