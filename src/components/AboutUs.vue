<template>
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
      <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0"
        type="submit">Çıkış Yap</button>
    </div>
  </nav>

  <section class="py-5">
    <div class="container">
      <div class="row gx-4 align-items-center justify-content-between">
        <div class="col-md-5 order-2 order-md-1">
          <div class="mt-5 mt-md-0">
            <h2 class="display-5 fw-bold">Hakkımızda</h2>
            <p class="lead">

              Bu Web sitesi öğrenci-öğretim elemanı etkileşimini
              güçlendirme, kişiselleştirilmiş öğrenme deneyimleri sunma ve
              akademik performansın etkin bir şekilde yönetilmesi amacıyla
              Başkent Üniversitesi Mühendislik Fakültesi
              Bilgisayar Mühendisliği Bölümü öğrencileri tarafından
              bitirme projesi kapsamında, Doç. Dr. Mustafa Sert ve Doç. Dr. Barış Keçeci danışmanlığında geliştirilmiştir
            </p>
            <br>
            <h2 class="display-7 fw-bold">Proje Ekibimiz</h2>
            <p class="lead">
            <div class="contact-box">
              <strong>Berzan Özgenç -</strong> Full Stack Developer<br>
              <span class="contact-info"> <strong>Mail:</strong> berzanozgenc@gmail.com</span><br>
              <a href="https://www.linkedin.com/in/berzan-%C3%B6zgen%C3%A7-92a921227?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">
                <img style="width: 24px;" src="/src/assets/linkedin.png" alt="LinkedIn">
              </a>
              <a href="https://github.com/berzanozgenc">
                <img style="margin-left: 2px; width: 24px;" src="/src/assets/github.png" alt="gitHub">
              </a>
            </div>
            <div class="contact-box">
              <strong>Beyza Öztürk -</strong> Front-End Developer <br>
              <span class="contact-info"> <strong>Mail:</strong> beyza.ozturk002@gmail.com</span><br>
              <a href="https://www.linkedin.com/in/beyza-%C3%B6zt%C3%BCrk-441b72201?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">
                <img style="width: 24px;" src="/src/assets/linkedin.png" alt="LinkedIn">
              </a><br>
            </div>
            <div class="contact-box">
              <strong>Dilara Dündar -</strong> Front-End Developer <br>
              <span class="contact-info"> <strong>Mail:</strong> dilaradundar2002@gmail.com</span><br>
              <a href="https://www.linkedin.com/in/dilara-d%C3%BCndar-64a937201?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">
                <img style="width: 24px;" src="/src/assets/linkedin.png" alt="LinkedIn">
              </a><br>
            </div>
            <div class="contact-box">
              <strong>İdil Bilge Altun -</strong> Front-End Developer <br>
              <span class="contact-info"> <strong>Mail:</strong> idilaltun12@gmail.com</span><br>
              <a href="https://www.linkedin.com/in/idil-altun-325499201?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app">
                <img style="width: 24px;" src="/src/assets/linkedin.png" alt="LinkedIn">
              </a><br>
            </div>
            </p>
          </div>
        </div>
        <div class="col-md-6 offset-md-1 order-1 order-md-2">
          <div class="row gx-2 gx-lg-3">
            <img src="/src/assets/poster.jpg" alt="">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AboutUs",
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
  },
};
</script>

<style>

.contact-box {
  border: 2px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  width: 350px;
  /* İstenilen genişliği ayarlayabilirsiniz */
}
</style>
