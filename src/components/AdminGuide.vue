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
          <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0">Çıkış Yap</button>
        </div>
      </nav>
  
      <div class="container">
        <div class="steps-wrapper">
          <div class="steps-container">
            <div v-for="(step, index) in steps" :key="index" class="step-card">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <h5>{{ step.title }}</h5>
                <p>{{ step.description }}</p>
                <button v-if="index === 0" class="btn btn-primary" @click="goToAdminGuidePage">Başla</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: "AdminGuide",
    data() {
      return {
        steps: [
          { title: "Ders Ekleme", description: "Bölüme ders ekleyin." },
          { title: "Program Çıktısı Ekleme", description: "Program çıktılarını görüntüleyin ve yönetin.", route: "/instructor-home" },
          { title: "Öğrenci Yükleme", description: "Sisteme öğrenci yükleyin." }
        ]
      };
    },
    computed: {
      ...mapGetters(["getUser"]),
      username() {
        const user = this.getUser;
        return user ? `${user.firstName} ${user.lastName}` : "";
      },
    },
    methods: {
      goToAdminGuidePage() {
        this.$router.push("/add-course");
      },
      refreshPage() {
        this.$router.push("/instructor-home");
      },
      logoutUser() {
        // Burada store ve router nesnelerini doğrudan almak yerine kullanmak için veri üyeleri olarak tanımlanmış olmalıdırlar.
        // const store = useStore();
        // const router = useRouter();
        
        localStorage.removeItem('store');
        this.$store.dispatch('logoutUser');
        this.$router.push("/");
      }
      // Diğer yönlendirme metotları buraya eklenebilir.
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
  }
  
  .menu-card {
    width: 13rem;
    margin-left: 10px;
  }
  
  .steps-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .steps-container {
    display: flex;
    justify-content: center;
  }
  
  .step-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin: 5px;
    width: 150px;
  }
  
  .step-number {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 5px;
  }
  
  .step-content {
    flex: 1;
  }
  
  .icon {
    max-width: 24px;
    max-height: 24px;
  }
  </style>
  