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
   
    <div
      class="card"
      style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden"
    >
      <div class="container">
        <img class="icon" src="../assets/Profile_Icon.png" />
        <h2 style="margin-top: 12px; margin-left: 5px">BIL477</h2>
        <div class="buttons-container">
      <!-- Left-aligned buttons -->
      <button class="btn btn-outline-primary" @click="handleButton1">Öğrenme çıktıları</button>
      <button class="btn btn-outline-success" @click="handleButton2">Öğrenci bilgileri</button>
    </div>
      </div>
  
      <div class="card-body">

        <h5 class="card-title">Araç Çıktıları</h5>
        
        <ul style="max-width: 73rem" class="list-group">
          <li class="list-group-item">
            <a href="#">Ödev</a>
            <input type="text" v-model="odevInput" placeholder="%Ödev" />
          </li>
          <li class="list-group-item">
            <a href="#">Lab</a>
            <input type="text" v-model="labInput" placeholder="%Lab" />

          </li>
          <li class="list-group-item">
            <a href="#">Katılım</a>
            <input type="text" v-model="katilimInput" placeholder="%Katılım" />

          </li>
          <li class="list-group-item">
            <a href="#">Ara Sınav</a>
            <input type="text" v-model="araSınavInput" placeholder="%Ara Sınav" />

          </li>
          <li class="list-group-item">
            <a href="#">Final</a>
            <input type="text" v-model="finalInput" placeholder="%Final" />

          </li><li class="list-group-item">
            <a href="#">araç ekle</a>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
            </button>
          <ul class="dropdown-menu">
         <li><button class="dropdown-item" type="button">Lab</button></li>
          <li><button class="dropdown-item" type="button">Katılım</button></li>
         <li><button class="dropdown-item" type="button">Proje</button></li>
        </ul>
          </div>
          </li>
          
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
  </template>
  
  <script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "jquery";
  
  export default {
    name: "Course",
    data() {
    return {
      odevInput: "",
      labInput: "",
      katilimInput: "",
      araSınavInput: "",
      finalInput: "",
      selectedItem: null,
    };
  },
    methods: {
      refreshPage() {
        window.location.reload();
      },
      handleButton1(){
        console.log("Button 1 clicked");
      },
      handleButton2() {
      // Logic for button 2
      console.log("Button 2 clicked");
    },
    },
  };
  </script>
  
  <style>
  .container {
    display: flex;
    margin-left: 20px;
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
  .buttons-container {
  display: flex;
  align-items: center;
  margin-right: 25px;
}

.buttons-container button {
  margin-right: 25px;
  
}

.container {
  display: flex;
  align-items: center;
}
.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-group-item input {
  margin-left: 10px;
}

  </style>
  