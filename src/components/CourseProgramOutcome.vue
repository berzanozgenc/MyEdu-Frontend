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
        <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0"
          type="submit">Çıkış Yap</button>
      </div>
    </nav>
    <div class="flex-container">
      <!-- Side Menu -->
      <div class="card menu" style="width: 12%;">
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
      <div class="card" style="width: 80%; height: 100%">
        <div class="card-body" style="overflow-x: auto;">
          <h5 style="color: #dc3545;" class="card-title">Program Çıktıları</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" style="width: 15%;">Program Çıktısı No.</th>
                <th scope="col" style="width: 70%;">Tanım</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in programs" :key="index">
                <td>
                  <input v-if="item.editable" type="number" class="form-control editable" v-model="item.number"
                    style="width: 100%;">
                  <div v-else>{{ item.number }}</div>
                </td>

                <td>
                  <input v-if="item.editable" type="text" class="form-control editable" v-model="item.description"
                    style="width: auto;">
                  <div class="descriptionField" v-else>{{ item.description }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Program Çıktısını Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu program çıktısını silmek istediğinizden emin misiniz?</p>
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
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: "CourseProgramOutcome",
  data() {
    return {
      programs: [],
      showModal: false,
      course: null,
      selectedProgramOutcomeId: null,
      newProgram: {
        output: '',
        description: '',
        number: ''
      }
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
  },
  created() {
    const courseId = this.$route.params.courseId;
    console.log("Course ID:", courseId);
    this.fetchProgramOutcomes(courseId);
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
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId } });
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToGuidePage(){
this.$router.push('/guidance');
        },
    goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId } });
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
          description: program.description,
          number: program.number
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
      this.selectedProgramOutcomeId = programId; // Silinecek öğrencinin ID'sini sakla
      this.showModal = true; // Modal'ı göster
    },
    async confirmDelete() {
      try {
        const programId = this.selectedProgramOutcomeId;
        await axios.delete(`http://localhost:8080/program-outcomes/${programId}`);
        this.programs = this.programs.filter(program => program.id !== programId);
        this.fetchProgramOutcomes(this.$route.params.courseId);
        console.log("Sil butonuna tıklandı");
        this.$toast.success("Program çıktısı başarıyla silindi.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Program çıktısı silinirken bir hata oluştu.");
      }
      this.showModal = false;
    },

    closeModal() {
      this.showModal = false;
    },
    async addProgram() {
      const courseId = this.$route.params.courseId;
      console.log("PÇ Ekle butonuna tıklandı");

      if (!this.newProgram.description.trim()) {
        this.$toast.error("Lütfen tüm boşlukları uygun olarak doldurun!");
        return;
      }

      const data = {
        description: this.newProgram.description,
        number: this.newProgram.number,
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
        const responseDepartment = await axios.get(`http://localhost:8080/course/get-department/course/${courseId}`);
        const departmentId = responseDepartment.data.id;
        const response = await axios.get(`http://localhost:8080/program-outcomes/department/${departmentId}`);
        console.log(response.data);
        // Her öğenin bir id alanı olduğunu varsayarak, bu id değerini kullanarak programları oluşturun
        this.programs = response.data.sort((a, b) => a.number - b.number);
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
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

.descriptionField {
  max-width: 98%;
  /* Adjust the width as needed */
  word-wrap: break-word;
}

.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>