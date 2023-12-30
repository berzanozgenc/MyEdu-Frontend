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
    
<button type="button" class="btn btn-light">Düzenle</button>

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
  