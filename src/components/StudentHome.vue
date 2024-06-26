<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
        </a>
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
        </a>
      
        <div style="margin-left: auto; margin-right: 2%;" class="ml-auto d-flex align-items-center">
          <span class="d-flex align-items-center">
            <img style="margin-right: 2px;" class="icon" src="../assets/profile.png" />
            <h6 class="mb-0 ml-2">{{ username }}</h6>
          </span>
          <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
        </div>
      </nav>
      <div class="flex-container">
      <!-- Side Menu -->
      <div class="card menu" style="width: 12%; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <i class="fas fa-book"></i> Derslerim
            </li>
      
          </ul>
        </div>
      </div>
      
    
        <div class="card" style="width: 80%; overflow-y: auto; overflow-x: hidden;">
          <div class="form-inline">
            <div class="card-body">
              <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToStudentProgramOutcomePage">Program Kazanımlarım</button>
              <br>
              <br>
              <h5 class="card-title">Derslerim</h5>
              <ul style="max-width: 73rem" class="list-group">
                <li class="list-group-item" v-for="(registration, index) in userCourses" :key="index">
                  <a :href="'#'" @click="goToStudentResultPage(registration.courseId)" class="course-link">
                    {{ registration.code }} - {{ registration.courseName }} - {{ registration.semester }}
                  </a>
                 
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Dersi Sil</h5>
            </div>
            <div class="modal-body">
              <p>Bu dersi silmek istediğinizden emin misiniz?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">İptal</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Sil</button>
            </div>
          </div>
        </div>
      </div>
      <!-- End Confirmation Modal -->
  
      <!-- New card added here, moved outside flex-container div -->
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import axios from "axios";
  import { mapGetters } from "vuex";
  
  export default {
    name: "StudentHome",
    computed: {
      ...mapGetters(["getUser"]),
      username() {
        const user = this.getUser;
        return user ? `${user.firstName} ${user.lastName}` : "";
      },
    },
    data() {
      return {
        userDepartment: null,
        userCourses: [], // Kullanıcıya ait derslerin listesi
      };
    },
    mounted() {
      this.fetchUserCourses();
    },
    methods: {
      goToCoursePage(registration) {
        const courseId = registration.courseId;
        this.$router.push({ name: 'Course', params: { courseId: courseId } });
        console.log(registration);
        this.selectedCourse = registration; // Seçilen dersin bilgilerini selectedCourse değişkenine atar
      },
      getDepartment(){
        const user = this.getUser
        this.userDepartment = user.department;
        this.fetchCourses(this.userDepartment);
      },
      fetchUserCourses() {
        const store = useStore(); // Vuex store'u al
      
      // Kullanıcının ID'sini Vuex store'undan al
      const userId = store.getters.getUser.userId;
      const studentId =  userId

        axios
          .get(`http://localhost:8080/student-course/${studentId}/courses`)
          .then((response) => {
            this.userCourses = response.data; // Kullanıcıya ait dersleri listesini güncelle
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Hata:", error);
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
            
            this.$toast.success("Ders başarıyla eklendi");
            
            this.fetchUserCourses();
          })
          .catch((error) => {
            console.error("Hata:", error);
            // Hata durumunda yapılacak işlemler
            this.$toast.error("Ders eklenemedi!");
          });
      },
      openConfirmationModal(registrationId) {
        // Silme işlemi için modal pencereyi aç
        this.registrationIdToDelete = registrationId;
        this.showModal = true;
      },
      closeModal() {
        // Modal pencereyi kapat
        this.showModal = false;
      },
      confirmDelete() {
        // Silme işlemini onayla ve işlemi gerçekleştir
        axios
          .delete(`http://localhost:8080/user-course-registrations/${this.registrationIdToDelete}`)
          .then((response) => {
            console.log(response.data);
            // Silme işlemi başarılıysa kullanıcıya ait derslerin listesini yeniden getir
            this.fetchUserCourses();
            // Modal pencereyi kapat
            this.showModal = false;
            this.$toast.success("Ders başarıyla silindi!");
          })
          .catch((error) => {
            console.error("Hata:", error);
          });
      },
      goToStudentResultPage(registrationId){
        console.log(registrationId)
        const courseId = registrationId;
        this.$router.push({ name: 'StudentPageMatrix', params: { courseId: courseId }});
      },
      goToStudentProgramOutcomePage(){
        this.$router.push("/student-program-outcomes");
      },
      logoutUser() {
        const store = useStore();
        const router = useRouter();
        localStorage.removeItem('store');
        this.$store.dispatch('logoutUser');
        this.$router.push("/");
      }
    }
  };
  </script>
  
  <style scoped>
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
    max-width: 24px;
    max-height: 24px;
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
  
  .course-link {
    text-decoration: none; /* Varsayılan link alt çizgisini kaldır */
    color: blue; /* Varsayılan metin rengini uygula */
  }
  
  .course-link:hover {
    text-decoration: underline; /* Hover durumunda alt çizgi ekle */
    color: navy; /* Hover durumunda renk değiştir */
  }
  </style>
  