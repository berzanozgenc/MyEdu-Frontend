<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <div v-if="course" style="margin: 0 auto; margin-top: 2%;">
        <h5>{{ course.code }} {{ course.courseName }} | {{ course.period }} {{ course.semester }}</h5>
      </div>
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
            <li class="list-group-item" @click="goToCoursePage">
              <i class="fas fa-book"></i> Derslerim
            </li>
            <li class="list-group-item" @click="goToInstructorLearningOutcomePage">
              <i class="fas fa-graduation-cap"></i> Öğrenim Çıktıları
            </li>
            <li class="list-group-item" @click="goToCourseProgramOutcomePage">
              <i class="fas fa-chalkboard-teacher"></i> Program Çıktıları
            </li>
            <li class="list-group-item" @click="goToMatchMatrixPage">
              <i class="fas fa-exchange-alt"></i> ÖÇ ve PÇ Eşleştirme
            </li>
            <li class="list-group-item" @click="goToStudentListPage">
              <i class="fas fa-users"></i> Öğrenci Listesi
            </li>
            <li class="list-group-item" @click="goToGuidePage">
              <i class="fas fa-users"></i> Kılavuz
            </li>
            <li class="list-group-item" @click="goToAboutUs">
              <i class="fas fa-info-circle"></i> Hakkımızda
            </li>
          </ul>
        </div>
      </div>
      <div class="card" style="width: 80%;">
        <div class="card-body" style="overflow-x: auto;">
          <h5 style="color: #dc3545;" class="card-title">Dersin Öğrenim Çıktıları</h5>
          <div v-if="targetTotal !== 100" class="alert alert-danger" role="alert">
            Hedef sütun toplamları 100 olmalıdır!
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" style="width: 150px;">Öğrenim Çıktısı</th>
                <th scope="col" style="width: 400px;">Tanım</th>
                <th scope="col" style="width: 150px;">Hedef</th>
                <th v-if="courseEditable" scope="col" style="width: 150px;">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in programs" :key="index">
                <td>Öğrenim Çıktısı {{ index + 1 }}</td>
                <td>
                  <input v-if="item.editable" type="text" class="form-control editable" v-model="item.description" style="width: 250px;">
                  <div class="loDescription" v-else>{{ item.description }}</div>
                </td>
                <td>
                  <div v-if="item.editable" class="form-group">
                    <input type="text" class="form-control editable" v-model="item.target" style="width: 150px;">
                  </div>
                  <div v-else>{{ item.target }}</div>
                </td>
                <td v-if="courseEditable">
                  <button class="btn btn-danger btn-sm" @click="deleteProgram(item.id, item)">Sil</button>
                  <button style="margin-left: 2px;" v-if="item.editable" class="btn btn-success btn-sm text-white" @click="updateProgram(item)">Kaydet</button>
                  <button style="margin-left: 2px;" v-else class="btn btn-warning btn-sm text-white" @click="editProgram(item)">Düzenle</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="courseEditable" class="card-body">
            <h5 class="card-title">ÖÇ Ekle</h5>
            <div class="form-group">
              <label for="description">Tanım:</label>
              <textarea class="form-control" id="description" v-model="newProgram.description" style="width: 250px; height: 100px;"></textarea>
            </div>
            <div class="form-group">
              <label for="target">Hedef:</label>
              <input type="text" class="form-control" id="target" v-model="newProgram.target" style="width: 150px;">
            </div>
            <br>
            <button class="btn btn-outline-primary my-2 my-sm-0" style="width: 150px; height: 35px; margin-top: 2px" type="submit" @click="addProgram">
              ÖÇ Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Öğrenim Çıktısını Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu öğrenim çıktısını silmek istediğinizden emin misiniz?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">İptal</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Sil</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Confirmation Modal -->
  </div>
</template>


<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from "vuex";
import axios from 'axios';

export default {
  name: "InstructorLearningOutcome",
  data() {
    return {
      programs: [],
      showModal: false,
      courseEditable: null,
      selectedLearningOutcomeId: null,
      course: null,
      newProgram: {
        output: '',
        description: '',
        target:''
      }
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
    targetTotal() {
      return this.programs.reduce((total, program) => total + parseInt(program.target), 0);
    }
  },
  created() {
    const courseId = this.$route.params.courseId;
    console.log("Course ID:", courseId);
    this.fetchLearningOutcomes(courseId);
    this.fetchCourse();
  },
  methods: {
    goToAboutUs(){
      this.$router.push('/about-us');
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToMatchMatrixPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    goToGuidePage(){
this.$router.push('/guidance');
        },
    goToCourseProgramOutcomePage(){
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId }});
    },
    goToStudentListPage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "StudentList", params: { courseId: courseId }});
        },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    editProgram(program) {
      program.editable = true;
    },
    fetchCourse() {
      const courseId = this.$route.params.courseId;
      axios.get(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          this.course = response.data;
          this.courseEditable = this.course.editable
        })
        .catch(error => {
          console.error('Error fetching course:', error);
        });
    },
    async updateProgram(program) {
      try {
        await axios.put(`http://localhost:8080/learningOutcomes/${program.id}`, {
          description: program.description,
          desiredTarget: program.target // Hedef değerini de gönder
        });

        // Hedef değerini tamsayıya dönüştür
        const newTarget = parseInt(program.target);

        // Toplam hedefleri hesapla (güncellenmiş hedefi dahil etmek için mevcut programın eski hedefini çıkart)
        const totalTargets = this.programs.reduce((total, p) => {
          if (p.id !== program.id) {
            return total + parseInt(p.target);
          } else {
            return total;
          }
        }, 0);

        // Toplam hedeflerin 100'ü geçip geçmediğini kontrol et
        if (totalTargets + newTarget > 100) {
          this.$toast.error("Hedeflerin Toplamı 100'ü Geçemez.");
          return;
        }

        program.editable = false;
        this.fetchLearningOutcomes(this.$route.params.courseId);
        this.$toast.success("Öğrenim çıktısı başarıyla güncellendi.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenim çıktısı güncellenirken bir hata oluştu.");
      }
    },
    async deleteProgram(programId, item) {
      this.selectedProgramOutcomeId = programId;
      this.showModal = true; // Modal'ı göster
    },
    async confirmDelete() {
      const programId = this.selectedProgramOutcomeId;
      try {
        await axios.delete(`http://localhost:8080/learningOutcomes/${programId}`);
        this.programs = this.programs.filter(program => program.id !== programId);
        this.fetchLearningOutcomes(this.$route.params.courseId);
        this.$toast.success("Öğrenim çıktısı başarıyla silindi.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenim çıktısı silinirken bir hata oluştu.");
      }
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    async addProgram() {
      if (!this.newProgram.description.trim() || !this.newProgram.target.trim()) {
        this.$toast.error("Lütfen açıklama ve hedefi girin.");
        return;
      }

      // Yeni öğrenim çıktısının hedefini tamsayıya dönüştür
      const newTarget = parseInt(this.newProgram.target);

      // Toplam hedefleri hesapla
      const totalTargets = this.programs.reduce((total, program) => total + parseInt(program.target), 0);

      // Toplam hedeflerin 100 olup olmadığını kontrol et
      if (totalTargets + newTarget > 100) {
        this.$toast.error("Hedeflerin Toplamı 100'ü Geçemez.");
        return;
      }
      const data = {
        description: this.newProgram.description,
        desiredTarget: newTarget, // Yeni hedefi kullan
        courseId: this.$route.params.courseId
      };
      try {
        const response = await axios.post('http://localhost:8080/learningOutcomes/create-learningOutcome', data);
        console.log(response.data);
        this.programs.push({ description: this.newProgram.description, target: this.newProgram.target }); // Hedefi de yeni öğrenim çıktıları listesine ekle
        this.newProgram.description = '';
        this.newProgram.target = ''; // Açıklama ve hedef alanlarını temizle
        this.fetchLearningOutcomes(this.$route.params.courseId);
        this.$toast.success("Öğrenim çıktısı başarıyla oluşturuldu.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenim çıktısı eklenirken bir hata oluştu.");
      }
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    },
    async fetchLearningOutcomes(courseId) {
      try {
        const response = await axios.get(`http://localhost:8080/learningOutcomes/course/${courseId}`);
        this.programs = response.data.sort((a, b) => a.id - b.id);
        // Her öğenin bir id alanı olduğunu varsayarak, bu id değerini kullanarak programları oluşturun
        this.programs = response.data.map(item => ({
          id: item.id, // Her öğe için bir id alanı oluştur
          description: item.description,
          target: item.desiredTarget
        }));
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
      } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenim çıktıları alınırken bir hata oluştu.");
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
.loDescription
{
  max-width: 800px; /* Adjust the width as needed */
  word-wrap: break-word;
}

.icon {
  max-width: 24px;
  max-height: 24px;
}

</style>
