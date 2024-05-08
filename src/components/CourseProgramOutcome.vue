<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
        </a>
        <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
          Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
        </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto"></ul>
          <span class="logout">
            <button @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
          </span>
        </div>
      </nav>
      <div class="flex-container">
        <div class="card" style="width: 13rem;margin-left: 10px;">
          <div class="card-body">
            <h5 class="card-title">Menü</h5>
            <a href="#" class="card-link" @click="goToCoursePage">Derslerim   </a><br /> 
            <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
            <a href="#" class="card-link">Program Çıktıları</a><br />
            <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
          </div>
        </div>
        <div class="card" style="width: 75rem;">
          <div class="card-body" style="overflow-x: auto;">
            <h5 class="card-title">Dersin Program Çıktıları</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style="width: 150px;">Program Çıktısı</th>
                  <th scope="col" style="width: 400px;">Açıklama</th>
                  <th scope="col" style="width: 150px;">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in programs" :key="index">
                  <td>Program Çıktısı {{ index + 1 }}</td>
                  <td>
                    <input v-if="item.editable" type="text" class="form-control editable" v-model="item.description" style="width: 250px;">
                    <div v-else>{{ item.description }}</div>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteProgram(item.id, item)">Sil</button>
                    <button v-if="item.editable" class="btn btn-success btn-sm text-white" @click="updateProgram(item)">Kaydet</button>
                    <button style="margin-left: 2px;" v-else class="btn btn-warning btn-sm text-white" @click="editProgram(item)">Düzenle</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="card-body">
              <h5 class="card-title">PÇ Ekle</h5>
              <div class="form-group">
                <label for="description">Açıklama:</label>
                <input type="text" class="form-control" id="description" v-model="newProgram.description" style="width: 250px;">
              </div>
              <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px" type="submit" @click="addProgram($route.params.courseId)">
                PÇ Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import axios from 'axios'; // axios'ı projenize dahil edin
  
  export default {
    name: "CourseProgramOutcome",
    data() {
      return {
        programs: [],
        newProgram: {
          output: '',
          description: ''
        }
      };
    },
    created() {
      const courseId = this.$route.params.courseId;
      console.log("Course ID:", courseId);
      this.fetchProgramOutcomes(courseId);
    },
    methods: {
      goToLoginPage() {
        this.$router.push("/");
      },
      goToMatchMatrixPage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
      },
      goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
      },
      goToStudentInfoPage() {
        this.$router.push("/student-info");
      },
      goToCoursePage() {
        this.$router.push("/instructor-home");
      },
      refreshPage() {
        this.$router.push("/instructor-home");
      },
      editProgram(program) {
    program.editable = true;
    console.log("Düzenle butonuna tıklandı");
},

async updateProgram(program) {
    console.log("Güncellenen program:", program);
    try {
        const response = await axios.put(`http://localhost:8080/program-outcomes/${program.id}`, {
            description: program.description
        });
        console.log("Güncelleme isteği yanıtı:", response);
        
        if (response.status === 200) {
            program.editable = false; // Program düzenlenebilirlik durumunu güncelle
            this.fetchProgramOutcomes(this.$route.params.courseId); // Program çıktılarını yeniden yükle
            this.$toast.success("Program çıktısı başarıyla güncellendi.");
        } else {
            this.$toast.error("Program çıktısı güncellenirken bir hata oluştu.");
        }
    } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı güncellenirken bir hata oluştu.");
        console.log("Hata:", error);
    }
},



async deleteProgram(programId, item) {
    try {
        await axios.delete(`http://localhost:8080/program-outcomes/${programId}`);
        this.programs = this.programs.filter(program => program.id !== programId);
        this.fetchProgramOutcomes(this.$route.params.courseId);
        console.log("Sil butonuna tıklandı");
        this.$toast.success("Program çıktısı başarıyla silindi.");
    } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı silinirken bir hata oluştu.");
    }
},
async addProgram() {
    const courseId = this.$route.params.courseId;
    console.log("PÇ Ekle butonuna tıklandı");

    if (!this.newProgram.description.trim()) {
        this.$toast.error("Lütfen açıklama girin.");
        return;
    }

    const data = {
        description: this.newProgram.description,
        courseId: courseId
    };
    try {
        const response = await axios.post(`http://localhost:8080/program-outcomes/${courseId}`, data);
        console.log("Program çıktısı başarıyla eklendi:", response.data);
        this.programs.push({ description: this.newProgram.description }); // Açıklamayı yeni öğrenim çıktıları listesine ekle
        this.newProgram.description = ''; // Açıklama alanını temizle
        this.fetchProgramOutcomes(courseId);
        this.$toast.success("Program çıktısı başarıyla oluşturuldu.");
    } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı eklenirken bir hata oluştu.");
    }
},

      logoutUser() {
        const store = useStore();
        const router = useRouter();
        localStorage.removeItem('store');
        this.$store.dispatch('logoutUser');
        this.$router.push("/");
      },
      async fetchProgramOutcomes(courseId) {
        try {
          const response = await axios.get(`http://localhost:8080/program-outcomes/course/${courseId}`);
          console.log(response.data);
          // Her öğenin bir id alanı olduğunu varsayarak, bu id değerini kullanarak programları oluşturun
          this.programs = response.data.map(item => ({
            id: item.id, // Her öğe için bir id alanı oluştur
            description: item.description
          }));
        } catch (error) {
          console.error(error);
          this.$toast.error("Program çıktıları alınırken bir hata oluştu.");
        }
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
  .table th,
  .table td {
    border: 1px solid #dee2e6;
  }
  .table th {
    background-color: #f8f9fa;
  }
  .table td {
    background-color: #fff;
  }
  .btn-outline-primary {
    border-color: #007bff;
    color: #007bff;
  }
  .btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
  }
  .btn-outline-success {
    border-color: #28a745;
    color: #28a745;
  }
  .btn-outline-success:hover {
    background-color: #28a745;
    color: #fff;
  }
  .btn-outline-danger {
    border-color: #dc3545;
    color: #dc3545;
  }
  .card-body table {
    width: 100%;
    overflow-x: auto;
  }
  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: #fff;
  }
  input,
  select {
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  input.editable,
  select.editable {
    border-color: #007bff;
  }
  </style>
  