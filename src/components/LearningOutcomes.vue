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
      <!-- Both tables in the same card -->
      <div class="card mt-3" style="width: 80%">
        <div class="card-body">
          <h5 class="card-title">Araç Puanlarını Belirleme</h5>
          <div style="max-width: 100%; overflow-x: auto">
            <div style="max-height: 300px; overflow-y: auto">
              <table class="table table-stretched">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th v-for="(assessment, index) in assessments" :key="assessment.id" scope="col">
                      <div class="d-flex align-items-center justify-content-between">
                        <span>{{ !useCustomNames ? assessment.name : 'Soru' }} {{ index + 1 }}</span>
                        <button v-if="courseEditable" @click="deleteAssessment(assessment.assessmentId)" class="btn btn-sm btn-danger ml-2">
                          <i class="fa fa-trash" style="font-size: 12px;"></i> <!-- Silme ikonu -->
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Puan</th>
                    <td v-for="(assessment, index) in assessments" :key="assessment.id">
                      <input type="number" v-model="assessment.contribution" style="width: 60px;" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button v-if="courseEditable" type="button" class="btn btn-outline-primary" @click="saveContributions">
                Puan Değişikliklerini Kaydet
              </button>
              <br>
              <br>

              <div v-if="courseEditable" style="margin-bottom: 10px;">
                <label for="contributionInput" style="margin-right: 10px;">Eklenecek Aracın Puanı:</label>
                <input type="number" id="contributionInput" v-model="contributionValue" style="width: 100px;" />
              </div>

              <div v-if="courseEditable">
                <button v-if="courseEditable" type="button" class="btn btn-success mb-2" @click="addNewAssessment">
                Yeni Araç Ekle
              </button>
              <input v-if="courseEditable" style="margin-left: 4px;" type="checkbox" v-model="useCustomNames"
                @change="toggleQuestionBased">Soru Bazlı Değerlendirme
              <br />
              </div>
             
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Aracı Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu aracı silmek istediğinizden emin misiniz?</p>
            <br>
            Aracı silerseniz bu araca dair bütün notlar ve ÖÇ eşleştirmeleri kaybolacaktır!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">İptal</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Sil</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from "axios";
import { mapGetters } from 'vuex';

export default {
  name: "LearningOutcome",
  props: ["generalAssessmentId", "courseId"],
  data() {
    return {
      assessments: [],
      courseEditable: null,
      selectedAssessmentId: null,
      showModal: false,
      course: null,
      contributions: [],
      contributionValue: 0.0, // Kullanıcı tarafından girilen katkı değeri
      useCustomNames: null,
      isEditMode: false,
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
    console.log("Course ID:", this.$route.params.courseId);
    console.log(
      "General Assessment ID:",
      this.$route.params.generalAssessmentId
    );
    this.fetchCourse()
    // Burada parametreleri kullanarak gerekli işlemleri gerçekleştirebilirsiniz.
  },
  mounted() {
    this.fetchLearningOutcomes();
    this.fetchAssessments();
    this.fetchUseCustomNames();
  },
  methods: {
    goToAboutUs(){
      this.$router.push('/about-us');
    },
    async saveAndDisableEditMode() {
      await this.saveLearningOutcomeContributions();
      this.disableEditMode(); // Düzenleme modunu kapat
    },
    async toggleQuestionBased() {
      console.log("deneme");
      try {
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        await axios.put(`http://localhost:8080/generalAssesment/${generalAssessmentId}/toggleQuestionBased`);
        console.log("Question based toggled successfully.");
      } catch (error) {
        console.error("Error toggling question based:", error);
      }
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
    enableEditMode() {
      this.isEditMode = true;
    },
    disableEditMode() {
      this.isEditMode = false;
    },
    closeModal() {
      this.showModal = false;
    },
    async fetchUseCustomNames() {
      try {
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        const response = await axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`);
        this.useCustomNames = response.data; // Backend'den gelen veriyi useCustomNames değişkenine atar
      } catch (error) {
        console.error("Error fetching useCustomNames:", error);
      }
    },
    async fetchLearningOutcomes() {
      try {
        const courseId = this.$route.params.courseId;
        const response = await axios.get(
          `http://localhost:8080/learningOutcomes/course/${courseId}`
        );
        this.outcomes = response.data;
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
      }
    },
    async fetchAssessments() {
      try {
        const courseId = this.$route.params.courseId;
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        console.log(generalAssessmentId);
        const response = await axios.get(
          `http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`
        );
        // Assessmentları id'ye göre sırala
        this.assessments = response.data.sort((a, b) => a.assessmentId - b.assessmentId);
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
},

    async saveContributions() {
      this.assessments.forEach(assessment => {
      console.log(`assessment Id: ${assessment.assessmentId} - cellValue: ${assessment.contribution}`);
      console.log( "Kaydet butonu:",assessment.contribution);
    });
      try {
        for (const assessment of this.assessments) {
          const newContribution = parseFloat(assessment.contribution);
          await axios.put(`http://localhost:8080/assessments/update-assessment-contribution/${assessment.assessmentId}?newContribution=${newContribution}`);
          console.log(`Assessment contribution updated for assessmentId ${assessment.assessmentId} to ${newContribution}`);
        }

        this.fetchAssessments();
        this.$toast.success("Katkı değeri başarıyla kaydedildi!");
      } catch (error) {
        console.error("Error updating assessment contributions:", error);
        this.$toast.error("Katkı değeri kaydedilirken hata oluştu!");
      }
    },
    async addNewAssessment() {
      const generalAssessmentId = this.$route.params.generalAssessmentId;
      try {
        const response = await axios.post(
          "http://localhost:8080/assessments/create-assessment",
          {
            contribution: this.contributionValue,
            generalAssessmentId: generalAssessmentId,
          }
        );

        console.log("Yeni araç başarıyla oluşturuldu:", response.data);
        this.fetchAssessments();
        this.$toast.success("Yeni araç başarıyla oluşturuldu!");
      } catch (error) {
        console.error("Yeni araç oluşturulurken hata oluştu:", error);
        this.$toast.error("Yeni araç oluşturulurken hata oluştu!");
      }
    },
    async deleteAssessment(assessmentId) {
      this.selectedAssessmentId = assessmentId;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async confirmDelete() {
      try {
        const assessmentId = this.selectedAssessmentId;
        await axios.delete(`http://localhost:8080/assessments/delete-assessment/${assessmentId}`);
        console.log("Assessment silindi:", assessmentId);
        this.fetchAssessments();
        this.showModal = false;
      } catch (error) {
        console.error("Assessment silinemedi:", error);
      }
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    goToLearningOutcomePage() {
      this.$router.push("/learning-outcome");
    },
    goToGuidePage(){
this.$router.push('/guidance');
        },
    goToMatchMatrixPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId } });
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToStudentListPage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "StudentList", params: { courseId: courseId }});
        },
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    refreshPage() {
      this.$router.push("/instructor-home");
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
.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
