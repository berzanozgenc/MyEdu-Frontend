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
        <a href="#" class="card-link">Derslerim   </a><br />
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
          <li class="list-group-item" v-for="(course, index) in courses.coursesNameAndCode" :key="index">
            <a :href="'#'" @click="goToCoursePage(course)">
              {{ course }}
            </a>
          </li>
        </ul>
      </div>
      <ul style="max-width: 73rem" class="list-group list-group-flush"></ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InstructorHome",
  data() {
    return {
      courses: [], // Ders bilgilerini saklamak için bir dizi
    };
  },
  mounted() {
    console.log("mounted() yöntemi çağrıldı.");
    this.fetchCourses();
  },
  methods: {
    fetchCourses() {
      axios.get("http://localhost:8080/course/get-all-courses-name-and-code")
        .then((response) => {
          this.courses = response.data;
          console.log("Kurs verileri alındı:", this.courses); // Verilerin doğru şekilde alındığını kontrol etmek için konsola yazdırın
        })
        .catch((error) => {
          console.error("Ders bilgileri alınamadı:", error);
        });
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToCoursePage(course) {
      this.$router.push({ name: "CoursePage", params: { courseId: course.id } });
    },
    refreshPage() {
      window.location.reload();
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
