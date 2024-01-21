<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
  <div class="card" style="width: 13rem;margin-left: 10px;">
  <div class="card-body">
    <h5 class="card-title">Menü</h5>
    <a href="#" class="card-link" @click="goToCoursePage">Derslerim   </a><br />
    <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />    
    <a href="#" class="card-link" @click="goToInstructorLearningOutcome">Öğrenim Çıktıları</a><br />
    <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
  </div>
</div>
<div class="card">  
    <table class="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col">Öğrenci</th>
      <th scope="col"> Quiz</th>
      <th scope="col">Ödev</th>
      <th scope="col">Ara Sınav</th>
      <th scope="col">Final</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Öğrenci 1</th>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 2</th>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 3</th>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 4</th>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
      <td contenteditable="true">-</td>
    </tr>

  </tbody>

</table>
</div>
</div>

<div class="d-flex justify-content-end">
    <button type="button" class="btn btn-light">kaydet</button>
  </div>
  </template>
  
  <script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "jquery";
  
  export default {
    name: "StudentInfo",
    methods: {
      goToLoginPage(){
      this.$router.push("/");
    },
      goToCoursePage(){
      this.$router.push("/instructor-home");
    },
      goToLearningOutcomePage(){
      this.$router.push("/learning-outcome");
    },
    goToMatchMatrixPage(){
      this.$router.push("/instructor-match-matrix");
    },
    goToStudentInfoPage(){
      this.$router.push("/student-info");
    },
    goToInstructorLearningOutcome(){
      this.$router.push("/instructor-learning-outcome");
    },
      refreshPage() {
        //window.location.reload();
      this.$router.push("/instructor-home");
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
 .card{
  display: flex;
  width: 100%; /* Set the table width to 100% of its container */

 }

  
  </style>
  