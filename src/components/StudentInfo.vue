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
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">
            Çıkış Yap
          </button>
        </span>
      </div>
    </nav>
    <div class="flex-container">
  <div class="card" style="width: 13rem;margin-left: 10px;">
  <div class="card-body">
    <h5 class="card-title">menu</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
    <p class="card-text">Navigasyon menüsü</p>
    <a href="#" class="card-link">Derslerim   </a><br />
    <a href="#" class="card-link">Öğrenci bilgileri</a><br />
    <a href="#" class="card-link">Ders bilgileri</a><br />
    <a href="#" class="card-link">Öğrenme çıktıları</a>
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
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 2</th>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 3</th>
      <td colspan="2">-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">Öğrenci 4</th>
      <td colspan="2"></td>

    </tr>

  </tbody>

</table>
</div>
</div>

<div class="d-flex justify-content-end">
    <button type="button" class="btn btn-light">Düzenle</button>
  </div>
  </template>
  
  <script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "jquery";
  
  export default {
    name: "StudentInfo",
    methods: {
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
 .card{
  display: flex;
  width: 100%; /* Set the table width to 100% of its container */

 }

  
  </style>
  