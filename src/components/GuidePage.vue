<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <div class="logout ml-auto d-flex align-items-center">
        <span class="d-flex align-items-center">
          <img style="margin-right: 2px;" class="icon" src="../assets/profile.png" />
          <h6 class="mb-0 ml-2">{{ username }}</h6>
        </span>
        <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
      </div>
    </nav>

    
      <div class="steps-wrapper">
        <div class="steps-container">
          <div v-for="(step, index) in steps" :key="index" class="step-card">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h5>{{ step.title }}</h5>
              <p>{{ step.description }}</p>
              <button v-if="index === 0" class="btn btn-primary" @click="navigateTo(step.route)">Başla</button>
            </div>
          </div>
        </div>
      </div>
    </div>
 
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';

export default {
  name: "GuidePage",
  data() {
    return {
      steps: [
        { title: "Derslerim", description: "Derslerinizi görüntüleyin ve yönetin.", route: "/instructor-home" },
        { title: "Derse Araç Ekleme", description: "İlgili ders için araçları ekleyin." },
        { title: "Araç Bilgilerini Ekleme", description: "İlgili ders için girilen araçların bilgilerini görüntüleyin ve yönetin." },
        { title: "Program Çıktıları", description: "Program çıktılarınızı inceleyin ve düzenleyin.", route: "/course-program-outcome" },
        { title: "Öğrenim Çıktıları", description: "Öğrenim çıktılarınızı inceleyin ve düzenleyin.", route: "/learning-outcome" },
        { title: "ÖÇ ve PÇ Eşleştirme", description: "Öğrenim ve program çıktılarını eşleştirin.", route: "/match-matrix" },
        { title: "ÖÇ-Araç Eşleştirme", description: "Öğrenim çıktılarını ilgili dersin araçlarıyla eşleştirin." },
        { title: "Derse Öğrenci Ekleme", description: "İlgili derse öğrenci ekleyin." },
        { title: "Not Girişi", description: "İlgili dersin seçilen aracı için not girişi yapın.", route: "/student-list" }
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
    navigateTo(route) {
      this.$router.push(route);
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    },
  }
};
</script>

<style scoped>
.guide-page .container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.guide-page .steps-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.guide-page .steps-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Kartları sayfanın sol ve sağ kenarlarına yerleştir */
  width: 100%;
}

.guide-page .step-card {
  flex: 0 1 calc(33.33% - 20px); /* Her bir kartın genişliğini %33.33 olarak ayarla ve aralarında 20 piksel boşluk bırak */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 5px;
  box-sizing: border-box;
}

.guide-page .step-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.guide-page .step-content {
  flex: 1;
}

.guide-page .icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
