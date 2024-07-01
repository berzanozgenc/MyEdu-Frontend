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
      <!-- Side Menu -->
      <div class="card menu" style="width: 20%; ">
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
    


      <!-- Course table -->
      <div class="card" style="width: 78%; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Ders Sayfası</h5>
          <div>
        <a @mouseenter="showInfoBox = true" @mouseleave="showInfoBox = false" style="cursor: pointer; color: #007bff;;">
          <i class="fas fa-info-circle"></i> Excel Formatı
        </a>
        <div v-if="showInfoBox" class="info-box">
          <p>Ders için yükleyeceğiniz Excel'in sütun bazlı formatı:
            Sömestir, Ders Kodu,	Ders Adı,	Şube,	AKTS,	Kredi
            şeklinde olmalıdır. İlk satır başlığa ayrılmalıdır. Verilerin önü ve arkasında BOŞLUK bulunmamalıdır.

          </p>
        </div>
      </div>

          <input id="fileInput" type="file" @change="onFileChange" accept=".xlsx, .xls">
          <table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th style="width: 12%;"scope="col">Departman</th>
        <th scope="col">Dönem</th>
        <th scope="col">Sömestir</th>
        <th scope="col">Ders Kodu</th>
        <th scope="col">Ders Adı</th>
        <th scope="col">Şube</th>
        <th scope="col">AKTS</th>
        <th scope="col">Kredi</th>
        <th scope="col">Düzenlenilebilinir</th>
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
              <select v-model="item.period" class="editable-input">
                <option v-for="period in periods" :key="period" :value="period">
                  {{ period }}
                </option>
              </select>
            </span>
            <span v-else>{{ item.period }}</span>
          </td>
        <td>
          <span v-if="editable === index">
        <select v-model="item.semester" class="editable-input">
          <option value="Güz">Güz</option>
          <option value="Bahar">Bahar</option>
          <option value="Yaz">Yaz</option>
        </select>
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
          <span v-if="editable === index">
          <select v-model="item.editable" class="editable-input">
            <option :value="true">Evet</option>
            <option :value="false">Hayır</option>
          </select>
        </span>
          <span v-else> {{ item.editable ? 'Evet' : 'Hayır' }} </span>
        </td>
        <td>
          <button :class="editable === index ? 'btn btn-success btn-sm' : 'btn btn-warning btn-sm'" @click="editable === index ? saveCourse(index) : toggleEdit(index)">
            {{ editable === index ? 'Kaydet' : 'Düzenle' }}
          </button>
          <button class="btn btn-danger btn-sm" style="margin-left: 2px;" @click="openModal(item)">Sil</button>
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
    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ders Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu dersi silmek istediğinizden emin misiniz? <br> <br> Dersi silerseniz içindeki bütün veriler silinecektir!
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">İptal</button>
            <button type="button" class="btn btn-danger" @click="deleteCourse">Sil</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Confirmation Modal -->
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { mapGetters } from 'vuex';
import ExcelJS from 'exceljs';
import { ref, onMounted, computed } from 'vue';
import { Suspense } from 'vue';

export default {
  name: "AddCoursePage",
  data() {
    return {
      courses: [],
      editable: null,
      userDepartment: null,
      showInfoBox: false,
      showModal: false,
      selectedCourse: null,
      currentDate: 0,
      currentYear: 0,
      periods: [],
    courseToDeleteIndex: null
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    formattedDate() {
      return new Date(this.currentDate).toLocaleString();
    }
  },
  created() {
  },
  mounted() {
    this.getDepartment();
    const now = new Date();
    this.currentDate = now.getTime();
    this.currentYear = now.getFullYear();
    this.generatePeriods();
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      this.readExcelFile(file);
    },
    generatePeriods() {
      const startYear = this.currentYear - 3;
      const endYear = this.currentYear + 3;
      this.periods = [];
      for (let year = startYear; year < endYear; year++) {
        this.periods.push(`${year} - ${year + 1}`);
      }
    },
    addCoursesFromExcel() {
  if (!this.userDepartment) {
    console.error("Kullanıcı departmanı bulunamadı!");
    return;
  }

  console.log(this.userDepartment);

  // Her bir kurs için POST isteği yap
  this.courses.forEach(course => {
    const newCourse = {
      department: this.userDepartment,
      period: course.period,
      semester: course.semester,
      code: course.code,
      courseName: course.courseName,
      section: course.section,
      ects: course.ects,
      credit: course.credit
    };

    axios.post('http://localhost:8080/course/create-course', newCourse)
      .then(response => {
        console.log('Course added:', response.data); // Başarılı bir şekilde eklendiğinde işlem sonucunu konsola yazdırabiliriz
        // Yeni kursu courses dizisine eklemek gerekmiyor çünkü zaten tablodan geliyor
        this.$toast.success("Ders başarıyla eklendi!");
        this.fetchCourses(this.userDepartment);
      })
      .catch(error => {
        console.error('Error adding course:', error); // Ekleme sırasında bir hata oluştuğunda hatayı konsola yazdırabiliriz
        this.$toast.error("Ders eklenemedi!");
      });
  });

  // Tüm kursları yeniden getir
},
  readExcelFile(file) {
  const workbook = new ExcelJS.Workbook();
  const reader = new FileReader();
  reader.onload = (event) => {
    const arrayBuffer = event.target.result;
    workbook.xlsx.load(arrayBuffer).then((workbook) => {
      const worksheet = workbook.getWorksheet(1);
      const rows = [];
      worksheet.eachRow((row, rowNumber) => {
        console.log(this.userDepartment.name);
        if (rowNumber !== 1) { // Skip header row
          rows.push({
            department: this.userDepartment,
            semester: row.getCell(1).value,
            code: row.getCell(2).value,
            courseName: row.getCell(3).value,
            section: row.getCell(4).value,
            ects: row.getCell(5).value,
            credit: row.getCell(6).value
          });
        }
      });
      this.courses = rows;
      this.addCoursesFromExcel();
    });
  };
  reader.readAsArrayBuffer(file);
  
},
goToAdminGuidePage(){
  this.$router.push("/admin-guide");
}
,
goToAdminCoursePage(){
  this.$router.push("/admin-course");
},

    loadCourses() {
      document.getElementById('fileInput').click();
    },
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
      this.$toast.success("Ders bilgileri güncellendi!");
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
          this.courses.sort((a, b) => {
        if (a.code < b.code) {
          return -1;
        }
        if (a.code > b.code) {
          return 1;
        }
        return 0;
      });
          console.log(this.courses); // courses dizisini konsola yazdır
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
    },
    deleteCourse(index) {
      const courseId = this.selectedCourse.courseId;
      this.showModal=false;
      if (!courseId) {
        console.error('courseId is undefined');
        return;
      }

      axios.delete(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          console.log('Course deleted:', response.data);
          this.$toast.success("Kurs başarıyla silindi!");
          this.fetchCourses(this.userDepartment);
        })
        .catch(error => {
          if (error.response) {
            console.error('Error deleting course:', error.response.data);
            this.$toast.error("Kurs silinemedi!");
          } else {
            console.error('Error deleting course:', error.message);
          }
        });

      console.log(`Deleting course with courseId: ${courseId}`);

     
    },
    openModal(course) {
    this.showModal = true; // Modalı açmak için showModal değişkenini true olarak ayarlayın
    this.selectedCourse=course;
  },
  
  closeModal() {
    this.showModal = false; // Modalı kapatmak için showModal değişkenini false olarak ayarlayın
  },
    goToProgramOutputPage() {
      this.$router.push("/program-output-admin");
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
          this.$toast.success("Kurs başarıyla eklendi!");
          console.log(response.data); // Başarılı bir şekilde eklendiğinde işlem sonucunu konsola yazdırabiliriz
          this.courses.push(response.data); // Yeni kursu courses dizisine ekleyin
          
          this.fetchCourses(this.userDepartment);
          
        })
        .catch(error => {
          console.error('Error adding course:', error); // Ekleme sırasında bir hata oluştuğunda hatayı konsola yazdırabiliriz
          this.$toast.error("Kurs eklenemedi!");
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
.info-box {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 999; /* Kutucuğun diğer öğelerin üstünde olmasını sağlar */
}

</style>
