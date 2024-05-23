<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
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
    

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Öğrenci Yükleme Sayfası</h5>
          <input id="fileInput" type="file" @change="onFileChange" accept=".xlsx, .xls">
          <table class="table mt-4">
            <thead>
              <tr>
                <th scope="col">Adı</th>
                <th scope="col">Soyadı</th>
                <th scope="col">Numarası</th>
                <th scope="col">E-Posta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="index">
                <td>{{ student.name }}</td>
                <td>{{ student.surname }}</td>
                <td>{{ student.studentNumber }}</td>
                <td>{{ student.studentMail }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" style="position: absolute; bottom: 10px; left: 10px;" @click="sendDataToServer">
            Verileri Sisteme Aktar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExcelJS from 'exceljs';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: "AdminLoadStudentPage",
  data() {
    return {
      students: [],
      userDepartment: null
    };
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  mounted() {
    this.getDepartment();
  },
  methods: {
    goToAdminGuidePage(){
      this.$router.push("/admin-guide");
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToAdminCoursePage(){
        this.$router.push("/admin-course");
      },
    goToProgramOutputPage() {
      this.$router.push("/program-output-admin");
    },
    goToAddCoursePage() {
      this.$router.push("/add-course");
    },
    refreshPage() {
      this.$router.push("/admin-home");
    },
    getDepartment() {
      const user = this.getUser;
      if (user && user.department) {
        this.userDepartment = user.department;
        console.log('Kullanıcı departmanı:', this.userDepartment);
      } else {
        console.error("Kullanıcı departmanı bulunamadı!");
      }
    },
    logoutUser() {
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.readExcelFile(file);
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
            if (rowNumber !== 1) { // Skip header row
              rows.push({
                name: row.getCell(1).value,
                surname: row.getCell(2).value,
                studentNumber: row.getCell(3).value,
                studentMail: row.getCell(4).value.text // Sadece metin kısmını al
              });
            }
          });
          this.students = rows;
        });
      };
      reader.readAsArrayBuffer(file);
    },
    sendDataToServer() {
      if (!this.userDepartment) {
        console.error("Kullanıcı departmanı bulunamadı!");
        return;
      }
      if (this.students.length === 0) {
        console.error("Öğrenci verisi bulunamadı!");
        return;
      }

      this.students.forEach(student => {
        const studentData = {
          firstName: student.name,
          lastName: student.surname,
          statusCode: "2",
          email: student.studentMail,
          password: "deneme",
          department: this.userDepartment,
          studentNumber: student.studentNumber
        };

        axios.post('http://localhost:8080/students', studentData)
          .then(response => {
            console.log("Öğrenci bilgileri başarıyla gönderildi:", studentData);
          })
          .catch(error => {
            console.error("Öğrenci bilgileri gönderme hatası:", error);
          });
      });
    },
    loadStudents() {
      document.getElementById('fileInput').click();
    }
  }
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
