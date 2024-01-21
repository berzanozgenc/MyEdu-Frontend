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
            <a href="#" class="card-link" @click="goToAddCoursePage">Ders Sayfası</a><br />
            <a href="#" class="card-link" @click="goToProgramOutputPage">Program Çıktıları Sayfası</a><br />
            <a href="#" class="card-link">Öğrenci Yükleme Sayfası</a><br />
          </div>
        </div>
  
        <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
          <div class="card-body">
            <h5 class="card-title">Admin Sayfası</h5>
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
  
            <button class="btn btn-primary" style="position: absolute; bottom: 10px; left: 10px;" @click="loadStudents">
              Öğrencileri Yükle
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminLoadStudentPage",
    data() {
      return {
        students: [],
      };
    },
    methods: {
    goToLoginPage(){
      this.$router.push("/");
    },
    goToProgramOutputPage(){
      this.$router.push("/program-output");
    },   
    goToAddCoursePage(){
      this.$router.push("/add-course");
    },
    goToLoadStudentPage(){
      this.$router.push("/admin-load-student");
    },
    refreshPage() {
      //window.location.reload();
      this.$router.push("/admin-home");
    },
   
      loadStudents() {
        const fakeStudentData = [
          { name: "Ahmet", surname: "Yılmaz", studentNumber: "12345976", studentMail:"ayilmaz@mail.baskent.edu.tr" },
          { name: "Ayşe", surname: "Kara", studentNumber: "67890798", studentMail:"akara@mail.baskent.edu.tr" },
          { name: "Hüseyin", surname: "Öztürk", studentNumber: "43434456", studentMail:"hozturk@mail.baskent.edu.tr" },
          { name: "Mehmet", surname: "Gün", studentNumber: "76876223", studentMail:"mgun@mail.baskent.edu.tr" },
          { name: "Beril", surname: "Öz", studentNumber: "53544635", studentMail:"boz@mail.baskent.edu.tr" },
          { name: "Cemile", surname: "Can", studentNumber: "34244434", studentMail:"ccan@mail.baskent.edu.tr" },
          
        ];
  
        this.students = fakeStudentData;
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
