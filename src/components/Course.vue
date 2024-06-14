<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        <img src="../assets/Baskent_University_Logo.png" alt="Logo" style="max-height: 50px;">
      </a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">
        Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi
      </a>
      <div v-if="course" style="margin: 0 auto; margin-top: 2%;">
        <h5>{{ course.code }} {{ course.courseName }} - {{ course.semester }}</h5>
      </div>
      <div style="margin-left: auto; margin-right: 2%;" class="ml-auto d-flex align-items-center">
        <span class="d-flex align-items-center">
          <img style="margin-right: 2px;" class="iconmy" src="../assets/profile.png" />
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
            <li class="list-group-item" @click="goToLearningOutcomeResult">
              <i class="fas fa-chart-bar"></i> ÖÇ Sonuçları
            </li>
            <li class="list-group-item" @click="goToProgramOutcomeResult">
              <i class="fas fa-chart-line"></i> PÇ Sonuçları
            </li>
            <li class="list-group-item" @click="goToGuidePage">
              <i class="fas fa-users"></i> Kılavuz
            </li>
          </ul>
        </div>
      </div>
      <!-- Course Details and Assessments -->
      
      <div class="card course-details" style="width: 78%; overflow-y: auto; overflow-x: auto;">
        <br>
        <div class="buttons-container">
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToCourseProgramOutcomePage">Program Çıktıları</button>
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</button>
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToMatchMatrixPage" >ÖÇ - PÇ Eşleştirme</button>
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToStudentListPage" >Öğrenci Listesi</button>
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToLearningOutcomeResult" >ÖÇ Sonuçları</button>
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToProgramOutcomeResult" >PÇ Sonuçları</button>
        </div>
        
        <div class="card-body">
          <h5 class="card-title">Ders Araçları</h5>
          <div class="form-group">
    <label for="sortingOption">Sırala:</label>
    <select class="form-control-sm" v-model="selectedSortingOption" @change="sortAssessments">
      <option value="nameAsc">A-Z sırala</option>
      <option value="nameDesc">Z-A sırala</option>
      <option value="contributionAsc">Katkıya Göre Artan</option>
      <option value="contributionDesc">Katkıya Göre Azalan</option>
    </select>
    <br>
    <br>
  </div>
  
          <table class="table">
            <thead>
              <tr>
                <th style="width: 30%;" scope="col">Araç Türü</th>
                <th style="width: 25%;" scope="col">Katkı</th>
                <th style="width: 45%;" scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(assessment, index) in generalAssessments" :key="assessment.generalAssesmentId">
                <td v-if="assessment.editMode"> <input type="text" v-model="assessment.name">  </td>
                <td v-else>{{ assessment.name }} </td>
                <td v-if="assessment.editMode">
                  <input type="text" v-model="assessment.totalContribution"> 
                </td>
                <td v-else>
                  {{ assessment.totalContribution }}
                </td>
                <td style="width: 350px;">
                  
                  <span style="margin-left: 2px;"></span>
                  <button style="margin-left: 2px;" class="btn btn-info btn-sm text-white" @click="goToAssessmentPage(assessment.generalAssesmentId)">Araç Bilgilerini Gir</button>
                  <button style="margin-left: 2px; height: 31px;" type="button" class="btn btn-sm btn-secondary text-white" @click="goToAlocPage(assessment.generalAssesmentId)">ÖÇ - Araç Eşleştir</button>
                  <button style="margin-left: 2px; height: 31px;" type="button" class="btn btn-sm btn-primary" @click="goToStudentInfoPage(assessment.generalAssesmentId)">Not Gir</button>
                  <button style="margin-left: 2px;" :class="{'btn-warning': !assessment.editMode, 'btn-success': assessment.editMode}" class="btn btn-sm text-white" @click="assessment.editMode ? saveChanges(assessment) : editProgram(assessment)">
                  {{ assessment.editMode ? 'Kaydet' : 'Düzenle' }}
                  </button>
                  <button style="margin-left: 2px;" class="btn btn-danger btn-sm" @click="deleteProgram(assessment.generalAssesmentId, index)">Sil</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="card-body">
            <h5 class="card-title">Araç Türü Ekle</h5>
            
            <div class="form-group">
              <label for="assessmentName">Araç Türü:</label>
              <input type="text" class="form-control" id="assessmentName" v-model="assessmentName" style="width: 200px;">
            </div>
            <div class="form-group">
              <label for="assessmentContribution">Katkı:</label>
              <input type="text" class="form-control" id="assessmentContribution" v-model="assessmentContribution" style="width: 200px;">
            </div>

            <button class="btn btn-outline-primary" @click="addGeneralAssessment">Araç Türü Ekle</button>
          </div>
        </div>
      </div>
    </div>
     <!-- Confirmation Modal -->
     <div v-if="showModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Araç Türünü Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu araç türünü  silmek istediğinizden emin misiniz?</p>
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
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "jquery";
import axios from "axios";

export default {
  props: ['courseId'],
  name: "Course",
  computed: {
    ...mapGetters(["getUser"]),
    username() {
      const user = this.getUser;
      return user ? `${user.firstName} ${user.lastName}` : "";
    },
  },
  data() {
    return {
      courseId: null,
      selectedGeneralAssessmentId: null,
      showModal: false,
      generalAssessments: [],
      course: {},
      assessmentName: "",
      assessmentContribution: "",
      selectedSortingOption: ' ' // Varsayılan sıralama seçeneği
    };
  },
  created() {
    console.log(this.username);
    const courseId = this.$route.params.courseId;
    this.fetchCourse(courseId);
    this.fetchGeneralAssessments(courseId);
  },
  methods: {
    sortAssessments() {
    const option = this.selectedSortingOption;
    if (option === 'nameAsc') {
      this.generalAssessments.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'nameDesc') {
      this.generalAssessments.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === 'contributionAsc') {
      this.generalAssessments.sort((a, b) => a.totalContribution - b.totalContribution);
    } else if (option === 'contributionDesc') {
      this.generalAssessments.sort((a, b) => b.totalContribution - a.totalContribution);
    }
  },
    async fetchGeneralAssessments(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/generalAssesment/course/${courseId}/general-assessments`);
        if (!response.ok) {
          throw new Error('Failed to fetch general assessments');
        }
       
        this.generalAssessments = await response.json()
        this.generalAssessments.sort((a, b) => {
            return a.generalAssesmentId - b.generalAssesmentId;
        });
        this.sortAssessments();
      } catch (error) {
        console.error(error);
      }
    },
    fetchCourse(courseId) {
      axios.get(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          this.course = response.data;
        })
        .catch(error => {
          console.error('Error fetching course:', error);
        });
    },
    saveChanges(assessment) {
      try {
        const courseId = this.$route.params.courseId;
  
        const requestData = {
          generalAssesmentId: assessment.generalAssesmentId,
          newAssesmentContribution: assessment.totalContribution,
          newAssessmentName: assessment.name
        };
  
        console.log("newAssesmentContribution:", requestData.newAssesmentContribution);
        console.log("generalAssesmentId:", requestData.generalAssesmentId);
  
        // Değişiklikleri backend'e gönderme
        axios.put(`http://localhost:8080/generalAssesment/updateTotalContributionForCourse/${courseId}?generalAssesmentId=${assessment.generalAssesmentId}&newAssesmentContribution=${assessment.totalContribution}&newAssessmentName=${assessment.name}`)
          .then(response => {
            if (response.status === 200) {
              console.log("Değişiklikler başarıyla kaydedildi.");
              // İsteğin başarılı olduğunu kullanıcıya bildirme veya gerekirse başka bir işlem yapma
              this.fetchGeneralAssessments(courseId);
              // Değişikliklerin başarıyla kaydedildikten sonra sayfanın yenilenmesi
              
            } else {
              console.error("Değişiklikler kaydedilemedi.");
              // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
            }
          })
          .catch(error => {
            console.error("Değişiklikler kaydedilirken bir hata oluştu:", error);
            // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
          });
      } catch (error) {
        console.error("Değişiklikler kaydedilirken bir hata oluştu:", error);
        // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
      }
    },
  
    addGeneralAssessment() {
      const courseId = this.$route.params.courseId;
      const name = this.assessmentName;
      const totalContribution = this.assessmentContribution;
  
      const requestData = {
        courseId: courseId,
        name: name,
        totalContribution: totalContribution
      };
  
      axios.post('http://localhost:8080/generalAssesment/create-generalAssesment', requestData)
        .then(response => {
          console.log('GeneralAssessment başarıyla eklendi:', response.data);
          this.fetchGeneralAssessments(courseId);
          this.assessmentName = "";
          this.assessmentContribution = "";
          this.$toast.success("Araç başarıyla eklendi");
        })
        .catch(error => {
          console.error('GeneralAssessment eklenirken bir hata oluştu:', error);
          this.$toast.error("Araç Adına ve Katkı Oranına Dikkat Ediniz!");
        });
    },
    editProgram(assessment) {
      assessment.editMode = true;
    },

    deleteProgram(generalAssesmentId, index) {
      this.selectedGeneralAssessmentId = generalAssesmentId; // Silinecek öğrencinin ID'sini sakla
      this.showModal = true; // Modal'ı göster
    },
    async confirmDelete() {
      const courseId = this.$route.params.courseId;
      const generalAssesmentId = this.selectedGeneralAssessmentId;
      try {
        axios.delete(`http://localhost:8080/generalAssesment/delete-generalAssesment/${generalAssesmentId}`)
          .then(response => {
            
            console.log("Araç başarıyla silindi.");
            this.fetchGeneralAssessments(courseId)
            
          })
          .catch(error => {
            console.error("Araç silinirken bir hata oluştu:", error);
          });
      } catch (error) {
        console.error("Araç silinirken bir hata oluştu:", error);
      }
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
      goToInstructorLearningOutcomePage() {
        const courseId = this.$route.params.courseId;
        this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
    },
    goToCourseProgramOutcomePage() {
          const courseId = this.$route.params.courseId;
          this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId }});
    },
    goToLearningOutcomeResult(){
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "LearningOutcomeResult", params: { courseId: courseId }});
    },
    goToGuidePage(){
this.$router.push('/guidance');
        },
    goToProgramOutcomeResult(){
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "ProgramOutcomeResult", params: { courseId: courseId }});
    },
    goToMatchMatrixPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
    },
    goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId }});
    },
    goToStudentInfoPage(assessmentId) {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentInfo", params: { courseId: courseId ,generalAssessmentId: assessmentId }});
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    handleButton1() { 
      console.log("Button 1 clicked");
    },
    handleButton2() {
      console.log("Button 2 clicked");
    },
    goToAssessmentPage(assessmentId) {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "LearningOutcome", params: { courseId: courseId ,generalAssessmentId: assessmentId }});
},
goToAlocPage(assessmentId) {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "Aloc", params: { courseId: courseId ,generalAssessmentId: assessmentId }});
},
logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem('store'); 
            this.$store.dispatch('logoutUser');
            this.$router.push("/");
        }

  },
};
</script>

<style>
.container {
  display: flex;
  margin-left: 20px;
}
.flex-container {
  display: flex;
}

.logout {
  margin-left: auto;
  margin-right: 20px;
}

.card {
  margin-left: 20px;
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

.buttons-container {
  display: flex;
  align-items: center;
  margin-right: 25px;
}

.buttons-container button {
  margin-right: 10px; /* düzeltilmiş */
} 
.list-group-item:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
  .list-group-item {
  display: flex;
  align-items: center; /* Dikey hizalama */
  justify-content: flex-start; /* Yatay hizalama */
}
.list-group-item .fas {
  margin-right: 10px;
}.list-group-item span {
  text-align: left;
}
.list-group-item:nth-child(1) {
  padding-left: 20px; /* Sol iç boşluğu artırın */
}
.list-group-item:nth-child(4) {
  padding-left: 20px; /* Sol iç boşluğu artırın */
}
.list-group-item input {
  margin-left: 10px;
}

.course-details {
  width: calc(100% - 14rem); /* menü genişliği çıkarıldı */
}

.iconmy {
  max-width: 24px;
  max-height: 24px;
}

.card.menu {
    width: 16%; /* Sabit genişlik */
    min-width: 250px; /* Opsiyonel: minimum genişlik belirleyebilirsiniz */
    overflow-x: auto; /* Yatay kaydırma ekler */
    white-space: nowrap; /* Satırları kırpmaz, yatayda devam eder */
}

.card.course-details{
  overflow-x: auto; /* Yatay kaydırma ekler */
  white-space: nowrap; /* Satırları kırpmaz, yatayda devam eder */
}

</style>
