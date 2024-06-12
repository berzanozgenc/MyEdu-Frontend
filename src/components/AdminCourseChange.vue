<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #98bdff;">
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#"> <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">myEdu</a>
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto"></ul>
          <span class="logout">
            <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
          </span>
        </div>
      </nav>
      <div class="flex-container">
        <!-- Side Menu -->
        <div class="card menu" style="width: 18%;">
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
      
  
        <div class="card" style="width: 80%; overflow-y: auto; overflow-x: hidden">
          <div class="card-body">
            <h5 class="card-title">Ders Sayfası</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Bölüm Adı</th>
                  <th scope="col">Ders Adı</th>
                  <th scope="col">Ders Kodu</th>
                  <th scope="col">AKTS</th>
                  <th scope="col">Kredi</th>
                  <th scope="col">Eğitmen</th>
                  <th scope="col">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in courses" :key="index">
                  <td>
                    <span >{{ this.userDepartment.name }}</span>
                  </td>
                  <td>
                    <span >{{ item.courseName }}</span>
                  </td>
                  <td>
                    <span >{{ item.code }}</span>
                  </td>
                  <td>
                    <span v-if="editable === index && activeField === 'akts'">
                      <input v-model="item.akts" @blur="editable = -1; activeField = ''" />
                    </span>
                    <span v-else @click="editCell(index, 'akts')">{{ item.ects }}</span>
                  </td>
                  <td>
                    <span v-if="editable === index && activeField === 'credit'">
                      <input v-model="item.credit" @blur="editable = -1; activeField = ''" />
                    </span>
                    <span v-else @click="editCell(index, 'credit')">{{ item.credit }}</span>
                  </td>
                  <td>{{ this.instructors[item.courseId] }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteInstructor(item.courseId)">Öğretmen atamasını kaldır</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="card-body">
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
    name: "AdminCourseChange",
    computed: {
    getInstructorName(courseId) {
      // instructors objesinde courseId'ye göre öğretmen adını bul
      console.log(this.instructors[4]);
    }
  },
    data() {
      return {
        userDepartment: null,
        instructors: {},
        courses: []
      };
    },
    created(){
        this.getDepartment();
    },
    methods: {
        getDepartment(){
            const store = useStore();
            const user = store.state.user; // Kullanıcı bilgilerini state'den alıyoruz
            this.userDepartment = user.department
            this.fetchCourses(this.userDepartment)
    },
    async fetchCourses(userDepartment) {
  const departmentId = this.userDepartment.id;
  try {
    const response = await axios.get(`http://localhost:8080/course/get-courses/department/${departmentId}`);
    this.courses = response.data;
    // Her ders için öğretmen bilgisini al
    for (const course of this.courses) {
      const instructor = await this.getInstructor(course.courseId);
      // instructors objesine normal bir şekilde atama yap
      this.instructors[course.courseId] = instructor;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
},
    async deleteInstructor (courseId){
        try {
        await axios.delete(`http://localhost:8080/user-course-registrations/delete/instructor/${courseId}`);
        this.$toast.success("Atama başarıyla kaldırıldı");
        setTimeout(() => {
      this.refreshPage();
    }, 2000); // 3 saniye bekleyip sayfayı yenile
      } catch (error) {
        console.error("Error:", error);
        this.$toast.error("Atama kaldırılamadı!");
      }
    },
    async getInstructor(courseId) {
      try {
        const response = await axios.get(`http://localhost:8080/user-course-registrations/course/${courseId}/user`);
        const instructor = response.data[0].user.firstName + " " + response.data[0].user.lastName;
        return instructor;
      } catch (error) {
        console.error("Error fetching instructor:", error);
        return null;
      }
    },
    goToAddCoursePage(){
      this.$router.push("/add-course");
    },
      goToAdminGuidePage(){
        this.$router.push("/admin-guide");
      },
      goToAdminCoursePage(){
        this.$router.push("/admin-course");
      },
      goToProgramOutputPage(){
        this.$router.push("/program-output-admin");
      }, 
      goToLoadStudentPage(){
        this.$router.push("/admin-load-student");
      },
      goToLoginPage(){
        this.$router.push("/");
      },
      refreshPage() {
        window.location.reload();
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
  