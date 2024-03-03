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
            <a href="#" class="card-link" @click="goToCoursePage">Derslerim   </a><br />
            <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />    
            <a href="#" class="card-link" >Öğrenim Çıktıları</a><br />
            <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
          </div>
        </div>
        <div class="card" style="width: 75rem;">
          <div class="card-body" style="overflow-x: auto;">
            <h5 class="card-title">Dersin Öğrenim Çıktıları</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style="width: 150px;">Öğrenim Çıktısı</th>
                  <th scope="col" style="width: 400px;">Açıklama</th>
                  <th scope="col" style="width: 150px;">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in programs" :key="index">
                  <td>Öğrenim Çıktısı {{ index + 1 }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" @click="deleteProgram(item.id,item)">Sil</button>
                    <button class="btn btn-warning btn-sm text-white" @click="editProgram(item.id)">Düzenle</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="card-body">
        <h5 class="card-title">ÖÇ Ekle</h5>
        <div class="form-group">
          <label for="description">Açıklama:</label>
          <input type="text" class="form-control" id="description" v-model="newProgram.description" style="width: 250px;">
        </div>
        <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px" type="submit" @click="addProgram">
          ÖÇ Ekle
        </button>
      </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios'; // axios'ı projenize dahil edin

  export default {
    name: "InstructorLearningOutcome",
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
    // Diğer işlemler...
    // Servisten öğrenim çıktılarını getirme isteği
    axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}`)
        .then(response => {
          // Başarılı yanıt aldığınızda yapılacaklar
          console.log(response.data); // Yanıtı konsola yazdırın veya başka bir işlem yapın
          this.programs = response.data; // Sunucudan gelen verileri programs değişkenine atayın
        })
        .catch(error => {
          // Hata durumunda yapılacaklar
          console.error(error);
          alert("Öğrenim çıktıları alınırken bir hata oluştu.");
        });
  },

    methods: {
      goToLoginPage(){
        this.$router.push("/");
      },
      goToMatchMatrixPage(){
        this.$router.push("/instructor-match-matrix");
      },
      goToStudentInfoPage(){
        this.$router.push("/student-info");
      },
      goToCoursePage(){
        this.$router.push("/instructor-home");
      },
      refreshPage() {
        this.$router.push("/instructor-home");
      },
      deleteProgram(programId,item) {
        console.log(item);
  axios.delete(`http://localhost:8080/learningOutcomes/${programId}`)
    .then(response => {
      // Silme işlemi başarılı olduğunda yapılacaklar
      console.log(response.data);
      // Silinen öğrenim çıktısını programs dizisinden kaldırın
      this.programs = this.programs.filter(program => program.id !== programId);
    })
    .catch(error => {
      // Hata durumunda yapılacaklar
      console.error(error);
      alert("Öğrenim çıktısı silinirken bir hata oluştu.");
    });
},

      addProgram() {
    // HTTP isteği göndermeden önce formun doğruluğunu kontrol edebilirsiniz
    if (!this.newProgram.description.trim()) {
      alert("Lütfen açıklamayı girin.");
      return;
    }
    
    // Öğrenim çıktısı ekleme isteği için veri hazırlayın
    const data = {
      description: this.newProgram.description,
      courseId: this.$route.params.courseId // courseId'i rotadan alın
    };
    
    // Axios ile isteği gönderin
    axios.post('http://localhost:8080/learningOutcomes/create-learningOutcome', data)
      .then(response => {
        // Başarılı yanıt aldığınızda yapılacaklar
        console.log(response.data); // Yanıtı konsola yazdırın veya başka bir işlem yapın
        
        // Öğrenim çıktısını listeye ekleyin
        this.programs.push({ description: this.newProgram.description });
        
        // Yeni öğrenim çıktısını temizleyin
        this.newProgram.description = '';
      })
      .catch(error => {
        // Hata durumunda yapılacaklar
        console.error(error);
        alert("Öğrenim çıktısı eklenirken bir hata oluştu.");
      });
  }

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
