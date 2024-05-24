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
      <!-- Side Menu -->
      <div class="card menu" style="width: 12%; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <ul class="list-group">
            <li class="list-group-item" @click="goToAddCoursePage">
              <i class="fas fa-graduation-cap"></i> Ders Sayfası
            </li>
            <li class="list-group-item" @click="goToProgramOutputPage">
              <i class="fas fa-book"></i> Program Çıktıları Sayfası
            </li>
            <li class="list-group-item" @click="goToLoadStudentPage">
              <i class="fas fa-chalkboard-teacher"></i> Öğrenci Yükleme Sayfası
            </li>
            <li class="list-group-item" @click="goToAdminCoursePage">
                <i class="fa-solid fa-person-chalkboard"></i> Öğretmen Atamaları
              </li>
            <li class="list-group-item" @click="goToAdminGuidePage">
              <i class="fas fa-chalkboard-teacher"></i> Kılavuz
            </li>
          </ul>
        </div>
      </div>
    
      <!-- Program Çıktıları -->
      <div class="card" style="width: 80%; height: 100%">
        <div class="card-body" style="overflow-x: auto;">
          <h5 class="card-title">Program Çıktıları</h5>

          <div class="card-body">
            <h5 class="card-title">Program Çıktısı Ekle</h5>
            <div class="form-group">
              <label for="no">PÇ Numarası:</label>
              <input type="number" class="form-control" id="no" v-model="newProgram.number" style="width: 10%;">
              <label for="description">Açıklama:</label>
              <textarea class="form-control" id="description" v-model="newProgram.description"
                style="width: 25%; height: 100px;"></textarea>
            </div>
            <br>
            <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px" type="submit"
              @click="addProgram($route.params.courseId)">
              PÇ Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: "AdminPage",
  computed: {
    ...mapGetters(['getUser']),
    // Diğer computed özellikler
  },
  data() {
    return {
      programs: [],
      selectedProgramOutcomeId: null,
      userDepartment: null,
      courses: [],
      newProgram: {
        output: '',
        description: '',
        number: ''
      }
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    getDepartment(){
      const user = this.getUser;
      this.userDepartment = user.department;
    },
    goToAdminGuidePage(){
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
    async addProgram() {
      const departmentId = this.userDepartment.id
      axios
  .get(`http://localhost:8080/course/get-courses/department/${departmentId}`)
  .then(async (response) => {
    this.courses = response.data;

    // Her bir kurs için POST isteği yap
    for (const course of this.courses) {
      const data = {
        description: this.newProgram.description,
        number: this.newProgram.number,
        courseId: course.courseId // Her bir kurs için farklı courseId kullan
      };

      try {
        await axios.post(`http://localhost:8080/program-outcomes/${course.courseId}`, data);
        this.$toast.success("Program çıktısı başarıyla oluşturuldu.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı eklenirken bir hata oluştu.");
      }
      
    }
  })
  .catch((error) => {
    console.error("Error fetching courses:", error);
  });
    },
    goToAdminCoursePage(){
        this.$router.push("/admin-course");
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
