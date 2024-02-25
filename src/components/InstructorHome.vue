<template>
  <div>
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
        >Kişiselleştirilmiş Akademik Gelişim ve <br />Değerlendirme Sistemi</a
      >

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <span class="logout">
          <button
            @click="goToLoginPage"
            class="btn btn-outline-danger my-2 my-sm-0"
            type="submit"
          >
            Çıkış Yap
          </button>
        </span>
      </div>
    </nav>
    <div class="flex-container">
      <div class="card" style="width: 13rem; margin-left: 10px">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link">Derslerim</a><br />
        </div>
      </div>

      <div
        class="card"
        style="
          width: 75rem;
          height: 40rem;
          overflow-y: auto;
          overflow-x: hidden;
        "
      >
        <div class="container">
          <img class="icon" src="../assets/Profile_Icon.png" />
          <h2 style="margin-top: 12px; margin-left: 5px">{{ username }}</h2>
        </div>

        <div class="card-body">
          <h5 class="card-title">Derslerim</h5>
          <ul style="max-width: 73rem" class="list-group">
            <li
              class="list-group-item"
              v-for="(course, index) in userCourses"
              :key="index"
            >
              <a :href="'#'" @click="goToCoursePage(course)">
                {{ course.code }} - {{ course.courseName }} -
                {{ course.semester }}
              </a>
              <button class="btn btn-danger btn-sm ml-2" @click="deleteCourse">
                Sil
              </button>
            </li>
          </ul>
        </div>

        <ul style="max-width: 73rem" class="list-group list-group-flush"></ul>
      </div>
    </div>

    <!-- New card added here, moved outside flex-container div -->
    <div class="card" style="margin-top: 20px">
      <div class="card-body">
        <h5 class="card-title">Ders</h5>
        <div class="form-inline">
          <div class="form-group mr-2">
            <label for="classDropdown">Ders Seç:</label>
            <select
              class="form-control"
              id="classDropdown"
              v-model="selectedClass"
            >
              <option
                v-for="(course, index) in courses"
                :key="index"
                :value="course.courseId"
              >
                {{ course.code }} - {{ course.courseName }} -
                {{ course.semester }}
              </option>
            </select>
          </div>
          <button class="btn btn-primary" @click="editClass">Ekle</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "InstructorHome",
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
  },
  data() {
    return {
      userCourses: [], // Kullanıcıya ait derslerin listesi
      courses: [],
      selectedClass: null,
    };
  },
  mounted() {
    this.fetchCourses();
    this.fetchUserCourses();
  },
  methods: {
    fetchUserCourses() {
      // Vuex'tan kullanıcı ID'sini alın
      const userId = this.getUser ? this.getUser.userId : null;
      console.log(userId);

      // Kullanıcının derslerini getiren istek
      axios
        .get(
          `http://localhost:8080/user-course-registrations/user/${userId}/courses`
        )
        .then((response) => {
          this.userCourses = response.data; // Kullanıcıya ait dersleri listesini güncelle
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Hata:", error);
        });
    },
    fetchCourses() {
      axios
        .get("http://localhost:8080/course/get-courses")
        .then((response) => {
          // Backend'den gelen veriyi uygun formata dönüştür
          this.courses = response.data.map((course) => ({
            courseId: course.courseId,
            courseName: course.courseName,
            code: course.code,
            semester: course.semester,
          }));
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    },
    editClass() {
      // Kullanıcının seçtiği dersin ID'si
      const courseId = this.selectedClass;
      // Vuex'tan kullanıcı ID'sini alın
      const userId = this.getUser ? this.getUser.userId : null;

      // Backend'e istek yapmak için kullanılacak veri
      const requestData = {
        userId: userId,
        courseId: courseId,
      };

      console.log(courseId);
      console.log(userId);

      // Backend'e istek yapma
      axios
        .post("http://localhost:8080/user-course-registrations", requestData)
        .then((response) => {
          console.log(response.data);
          // Başarılı cevap durumunda yapılacak işlemler
        })
        .catch((error) => {
          console.error("Hata:", error);
          // Hata durumunda yapılacak işlemler
        });
    },
    deleteCourse() {
      // SİLME EKLENCEKS
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
