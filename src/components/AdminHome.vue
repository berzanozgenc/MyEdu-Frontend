<template>
    <div>
    <nav class="navbar navbar-expand-lg navbar-light+" style="background-color: #98bdff;">
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
        <ul class="navbar-nav mr-auto">
        </ul>
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
            <a href="#" class="card-link" @click="goToLoadStudentPage" >Öğrenci Yükleme Sayfası</a><br />
          </div>
        </div>
  
    <div
      class="card"
      style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden"
    >
      <div class="container">
        <img class="icon" src="../assets/Profile_Icon.png" />
        <h2 style="margin-top: 12px; margin-left: 5px">ADMIN</h2>
      </div>
      <div class="card-body">
        
      </div>

      
    </div>
  </div>
</div>
  </template>
  
  <script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "jquery";
  import { resolveTransitionHooks } from "vue";
  
  export default {
    name: "AdminHome",
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
      window.location.reload();
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
