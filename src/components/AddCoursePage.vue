<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">myEdu
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </span>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-container">
      <!-- Menu -->
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link">Ders Sayfası</a><br />
          <a href="#" class="card-link" @click="goToProgramOutputPage">Program Çıktıları Sayfası</a><br />
          <a href="#" class="card-link" @click="goToLoadStudentPage">Öğrenci Yükleme Sayfası</a><br />
        </div>
      </div>

      <!-- Course table -->
      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Ders Sayfası</h5>
          <table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th scope="col">Departman</th>
        <th scope="col">Dönem</th>
        <th scope="col">Ders Kodu</th>
        <th scope="col">Ders Adı</th>
        <th scope="col">Şube</th>
        <th scope="col">AKTS</th>
        <th scope="col">Kredi</th>
        <th scope="col">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in courses" :key="index">
        <td>
          <span>{{ item.department.name }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.semester" class="editable-input" />
          </span>
          <span v-else>{{ item.semester }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.code" class="editable-input" />
          </span>
          <span v-else>{{ item.code }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.courseName" class="editable-input" />
          </span>
          <span v-else>{{ item.courseName }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.section" class="editable-input" />
          </span>
          <span v-else>{{ item.section }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.ects" class="editable-input" />
          </span>
          <span v-else>{{ item.ects }}</span>
        </td>
        <td>
          <span v-if="editable === index">
            <input v-model="item.credit" class="editable-input" />
          </span>
          <span v-else>{{ item.credit }}</span>
        </td>
        <td>
          <button :class="editable === index ? 'btn btn-success btn-sm' : 'btn btn-warning btn-sm'" @click="editable === index ? saveCourse(index) : toggleEdit(index)">
            {{ editable === index ? 'Kaydet' : 'Düzenle' }}
          </button>
          <button class="btn btn-danger btn-sm" style="margin-left: 2px;" @click="deleteCourse(index)">Sil</button>
        </td>
      </tr>
    </tbody>
  </table>
          <!-- Ders Ekle buttonu -->
          <div class="card-body">
            <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px" type="submit" @click="addCourseColumn">
              Ders Ekle
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
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: "AddCoursePage",
  data() {
    return {
      courses: [],
      editable: null,
      userDepartment: null
    };
  },
  computed: {
    ...mapGetters(["getUser"]) 
  },
  created() {
  },
  mounted() {
    this.getDepartment();
  },
  methods: {
    updateCourse(index, updatedCourse) {
  // Güncellenen kursun bilgilerini kontrol et
  console.log('Updated Course:', updatedCourse);

  const courseId = updatedCourse.id;
  if (!courseId) {
    console.error('Course ID is undefined');
    return;
  }

  axios.put(`http://localhost:8080/course/${courseId}`, updatedCourse)
    .then(response => {
      console.log('Course updated:', response.data);
      this.editable = -1;
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        console.error('Course not found.');
      } else {
        console.error('Error updating course:', error);
      }
    });
},

    getDepartment() {
      const user = this.getUser;
      if (user && user.department) {
        this.userDepartment = user.department;
        console.log('Kullanıcı departmanı:', this.userDepartment);
        this.fetchCourses(this.userDepartment);
      } else {
        console.error("Kullanıcı departmanı bulunamadı!");
      }
    },
    toggleEdit(index) {
      this.editable = index;
    },
    saveCourse(index) {
      const course = this.courses[index];
      const courseId = this.courses[index].courseId;
      console.log(course);
      console.log(courseId)

      // Example PUT request using Axios
      axios.put(`http://localhost:8080/course/${courseId}`, course)
        .then(response => {
          console.log('Course updated:', response.data);
          this.editable = null; // Exit edit mode
        })
        .catch(error => {
          console.error('Error updating course:', error);
        });
    },
    fetchCourses(userDepartment) {
      const departmentId = userDepartment.id
      axios.get(`http://localhost:8080/course/get-courses/department/${departmentId}`)
        .then(response => {
          this.courses = response.data;
          console.log(this.courses); // courses dizisini konsola yazdır
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
    },
    deleteCourse(index) {
      const courseId = this.courses[index].courseId;

      if (!courseId) {
        console.error('courseId is undefined');
        return;
      }

      console.log(`Deleting course with courseId: ${courseId}`);

      axios.delete(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          console.log('Course deleted:', response.data);

          // Silinen kursu courses dizisinden kaldır
          this.courses.splice(index, 1);

          // Alternatif olarak, filter yöntemini kullanabilirsiniz:
          // this.courses = this.courses.filter(course => course.courseId !== courseId);
        })
        .catch(error => {
          if (error.response) {
            console.error('Error deleting course:', error.response.data);
          } else {
            console.error('Error deleting course:', error.message);
          }
        });
    },
    goToProgramOutputPage() {
      this.$router.push("/program-output");
    },
    goToLoadStudentPage() {
      this.$router.push("/admin-load-student");
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    refreshPage() {
      this.$router.push("/admin-home");
    },
    addCourseColumn() {
      if (!this.userDepartment) {
        console.error("Kullanıcı departmanı bulunamadı!");
        return;
      }

      console.log(this.userDepartment);

      const newCourse = {
        semester: "-",
        section: 0,
        code: "-",
        courseName: "-",
        ects: 0,
        credit: 0,
        department: this.userDepartment
      };

      axios.post('http://localhost:8080/course/create-course', newCourse)
        .then(response => {
          console.log(response.data); // Başarılı bir şekilde eklendiğinde işlem sonucunu konsola yazdırabiliriz
          this.courses.push(response.data); // Yeni kursu courses dizisine ekleyin
          this.fetchCourses(this.userDepartment);
        })
        .catch(error => {
          console.error('Error adding course:', error); // Ekleme sırasında bir hata oluştuğunda hatayı konsola yazdırabiliriz
        });
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
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

.editable-input {
  width: 100%;
  max-width: 150px; /* Add max-width to control input size */
  box-sizing: border-box;
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

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
}
</style>
