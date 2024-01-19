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
        >Kişiselleştirilmiş Akademik Gelişim ve <br />
        Değerlendirme Sistemi</a
      >

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
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

      <div class="card">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Öğrenme çıktıları</th>
              
              <!-- Dinamik olarak eklenen sütunlar -->
              <th v-for="i in quizColumns" :key="i" scope="col">quiz{{ i }}</th>
              <th scope="col">∑</th>
              <th scope="col">
                <button type="button" class="btn btn-success" @click="addNewQuiz">+</button>
              </th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Puan</th>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="i in quizColumns" :key="i" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 1</th>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="i in quizColumns" :key="i" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 2</th>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="i in quizColumns" :key="i" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">ÖÇ 3</th>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <td contenteditable="true">-</td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="i in quizColumns" :key="i" contenteditable="true">-</td>
            </tr>
            <tr>
              <th scope="row">Toplam (∑)</th>
              <td colspan="3"></td>
              <!-- Dinamik olarak eklenen hücreler -->
              <td v-for="i in quizColumns" :key="i" contenteditable="true"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-light">Düzenle</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LearningOutcome",
  data() {
    return {
      quizColumns: 3,
    };
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    addNewQuiz() {
      this.quizColumns++;
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
