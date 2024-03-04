<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">myEdu</a>
      <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve <br /> Değerlendirme Sistemi</a>

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
      <!-- Side Menu -->
      <div class="card menu" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim</a><br />
          <a href="#" class="card-link" @click="goToStudentInfoPage">Not Girişi</a><br />    
          <a href="#" class="card-link" @click="goToInstructorLearningOutcome">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
        </div>
      </div>

      <!-- Course Details and Assessments -->
      
      <div class="card course-details" style="width: calc(100% - 14rem); height: 40rem; overflow-y: auto; overflow-x: hidden; margin-left: 60px;">
        <div style="display: flex; margin-left: 14px;">
          <img class="icon" src="../assets/Books_Icon.png" />
          <h2 style="margin-top: 12px; margin-left: 6px;">{{ course.code }} - {{ course.courseName }} - {{ course.semester }}</h2>
        </div>
        <div class="buttons-container">
          <button style="margin-left: 16px;" class="btn btn-outline-primary" @click="goToInstructorLearningOutcome">Öğrenim Çıktıları</button>
          <button class="btn btn-outline-success" @click="goToStudentInfoPage">Not Girişi</button>
        </div>
        
        <div class="card-body">
          <h5 class="card-title">Ders Araçları</h5>
          <div class="form-group">
    <label for="sortingOption">Sırala:</label>
    <select class="form-control-sm" v-model="selectedSortingOption" @change="sortAssessments">
      <option value="nameAsc">İsme Göre Artan</option>
      <option value="nameDesc">İsme Göre Azalan</option>
      <option value="contributionAsc">Katkıya Göre Artan</option>
      <option value="contributionDesc">Katkıya Göre Azalan</option>
    </select>
  </div>
  
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Araç Türü</th>
                <th scope="col">Katkı</th>
                <th scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(assessment, index) in generalAssessments" :key="assessment.generalAssesmentId">
                <td>{{ assessment.name }}</td>
                <td v-if="assessment.editMode">
                  <input type="text" v-model="assessment.totalContribution"> 
                </td>
                <td v-else>
                  {{ assessment.totalContribution }}
                </td>
                <td style="width: 200px;">
                  <button class="btn btn-danger btn-sm" @click="deleteProgram(assessment.generalAssesmentId, index)">Sil</button>
                  <span style="margin-left: 2px;"></span>
                  <button :class="{'btn-warning': !assessment.editMode, 'btn-success': assessment.editMode}" class="btn btn-sm text-white" @click="assessment.editMode ? saveChanges(assessment) : editProgram(assessment)">
                  {{ assessment.editMode ? 'Kaydet' : 'Düzenle' }}
                  </button>
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
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "jquery";
import axios from "axios";

export default {
  props: ['courseId'],
  name: "Course",
  data() {
    return {
      courseId: null,
      generalAssessments: [],
      course: {},
      assessmentName: "",
      assessmentContribution: "",
      selectedSortingOption: ' ' // Varsayılan sıralama seçeneği
    };
  },
  created() {
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
        this.generalAssessments = await response.json();
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
          newAssesmentContribution: assessment.totalContribution
        };
  
        console.log("newAssesmentContribution:", requestData.newAssesmentContribution);
        console.log("generalAssesmentId:", requestData.generalAssesmentId);
  
        // Değişiklikleri backend'e gönderme
        axios.put(`http://localhost:8080/generalAssesment/updateTotalContributionForCourse/${courseId}?generalAssesmentId=${assessment.generalAssesmentId}&newAssesmentContribution=${assessment.totalContribution}`)
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
          this.$toast.error("Araç eklenemedi!");
        });
    },
    editProgram(assessment) {
      assessment.editMode = true;
    },
    deleteProgram(generalAssesmentId, index) {
      try {
        axios.delete(`http://localhost:8080/generalAssesment/delete-generalAssesment/${generalAssesmentId}`)
          .then(response => {
            
            console.log("Araç başarıyla silindi.");
            // Silme işlemi başarılı olduğunda sayfanın yenilenmesi
            this.generalAssessments.splice(index, 1);
            
          })
          .catch(error => {
            console.error("Araç silinirken bir hata oluştu:", error);
          });
      } catch (error) {
        console.error("Araç silinirken bir hata oluştu:", error);
      }
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    goToInstructorLearningOutcome() {
  const courseId = this.$route.params.courseId;
  console.log(courseId);
  this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
},
    goToMatchMatrixPage() {
      this.$router.push("/instructor-match-matrix");
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
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

.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-group-item input {
  margin-left: 10px;
}

.course-details {
  width: calc(100% - 14rem); /* menü genişliği çıkarıldı */
}
</style>
