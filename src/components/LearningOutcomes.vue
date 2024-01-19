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
          <!-- li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li !-->
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
      <th scope="col">Öğrenme çıktıları</th>
      <th scope="col">quiz1</th>
      <th scope="col">quiz2</th>
      <th scope="col">quiz3</th>
      <th scope="col">∑</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">ÖÇ 1</th>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">ÖÇ 2</th>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">ÖÇ 3</th>
      <td colspan="2">-</td>
      <td>-</td>
    </tr>
    <tr>
      <th scope="row">Toplam (∑)</th>
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
    name: "LearningOutcome",
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
 
  
  </style>
  