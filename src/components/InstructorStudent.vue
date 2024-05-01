<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
        </a>
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          Kişiselleştirilmiş Akademik Gelişim ve <br />Değerlendirme Sistemi
        </a>
  
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto"></ul>
          <span class="logout">
            <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
          </span>
        </div>
      </nav>
      <div class="flex-container">
        <!-- Menu Card -->
        <div class="card" style="width: 20%; margin-left: 10px">
          <div class="card-body">
            <h5 class="card-title">Menü</h5>
            <a href="#" class="card-link">Derslerim</a><br />
          </div>
        </div>
  
     <!-- Classes Card -->
<div class="card" style="width: 50%; margin-left: 10px">
  <div class="card-body">
    <h5 class="card-title">Öğrencinin Skor Tabloları</h5>

    <!-- First Table: Pç1, Pç2, Pç3 -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">PÇ/Skor</th>
          <th scope="col">Pç1</th>
          <th scope="col">Pç2</th>
          <th scope="col">Pç3</th>
        </tr>
      </thead>
      <tbody>
        <!-- Replace the dummy data with actual data -->
        <tr>
          <td>Skor </td>
          <td>53,00</td>
          <td>0.00</td>
          <td>44,00</td>
        </tr>
        <!-- Add more rows if needed -->
      </tbody>
    </table>

    <!-- Second Table: Öç1, Öç2, Öç3 -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ÖÇ/Skor</th>
          <th scope="col">Öç1</th>
          <th scope="col">Öç2</th>
          <th scope="col">Öç3</th>
        </tr>
      </thead>
      <tbody>
        <!-- Replace the dummy data with actual data -->
        <tr>
          <td>Skor </td>
          <td>80.00</td>
          <td>20.00</td>
          <td>0.00</td>
        </tr>
        <!-- Add more rows if needed -->
      </tbody>
    </table>
  </div>
</div>

        <!-- Student Info Card -->
        <div class="card" style="width: 20%; margin-left: 10px">
          <div class="card-body">
            <h5 class="card-title">Öğrenci Bilgileri</h5>
            <img class="icon" src="../assets/Profile_Icon.png" />
            <p class="card-text">Öğrenci Adı: {{ studentName }}</p>
            <p class="card-text">Öğrenci no: 22094638</p>
            <p class="card-text">Fakülte: Mühendislik</p>
            <p class="card-text">Bölüm: Bilgisayar Mühendisliği</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentPage",
    data() {
      return {
        courses: [
          { code: "VERI101", courseName: "Veri Madenciliği", semester: "2024 Spring", expanded: false, info: "This course covers data mining techniques." },
          // Add more courses here if needed
        ],
        studentName: "John Doe", // Change this to display actual student name
        studentInfo: "Öğrenci bilgisi buraya gelecek." // Change this to display actual student info
      };
    },
    methods: {
      toggleAccordion(course) {
        // Toggle accordion for the clicked course
        course.expanded = !course.expanded;
      },
      showExplanation(course) {
        course.showExplanation = true;
      },
      hideExplanation(course) {
        course.showExplanation = false;
      },
      logoutUser() {
        // Implement logout functionality
        console.log("Logging out...");
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
  
  .accordion-content {
    margin-left: 20px; /* Adjust as needed */
  }
  
  .info-icon {
    font-size: 0.8em;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .explanation {
    font-size: 0.8em;
    margin-bottom: 5px;
  }
  
  .modal {
    background: rgba(0, 0, 0, 0.5); /* Background rengi ve saydamlık */
    position: fixed; /* Sayfanın üzerinde sabit kalacak */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex; /* İçerik merkezi konumlandırma için */
    align-items: center;
    justify-content: center;
  }
  
  .modal-dialog {
    background: white;
    padding: 20px;
    border-radius: 5px;
  }
  
  .modal-title {
    margin-bottom: 0;
  }
  
  .custom-navbar {
    background-color: skyblue !important;
  }
  </style>
  