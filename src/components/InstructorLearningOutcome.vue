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
  
  
    <div
      class="card"
      style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden"
    >
      <div class="container">
        <img class="icon" src="../assets/Profile_Icon.png" />
        <h2 style="margin-top: 12px; margin-left: 5px">Mustafa Sert</h2>
      </div>
      <div class="card-body">
        <h5 class="card-title">Derslerim</h5>
        <ul style="max-width: 73rem" class="list-group">
          <li class="list-group-item">
            <a href="#">Bil429 - Bilgisayar Ağları</a>
          </li>
          <li class="list-group-item">
            <a href="#">Bil477 - Veri Madenciliği</a>
          </li>
          <li class="list-group-item"><a href="#">Morbi leo risus</a></li>
          <li class="list-group-item"><a href="#">Porta ac consectetur ac</a></li>
          <li class="list-group-item"><a href="#">Vestibulum at eros</a></li>
        </ul>
      </div>
      <ul style="max-width: 73rem" class="list-group list-group-flush"></ul>
      <div class="card-body">
        <select style="border-radius: 8px" v-model="selectedItem">
          <option>Ders 1</option>
          <option>Ders 2</option>
          <option>Ders 3</option>
          <option>DenemeDenemeDeneme</option>
        </select>
        <button
          class="btn btn-outline-primary my-2 my-sm-0"
          style="width: 100px; height: 35px; margin-left: 15px"
          type="submit"
        >
          Ders Ekle
        </button>
      </div>
    </div>
  </div>
  
  </template>
  
  <script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "jquery";
  
  export default {
    name: "InstructorLearningOutcome",
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
  </style>
  