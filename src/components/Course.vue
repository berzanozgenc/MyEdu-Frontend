<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">

    <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">myEdu</a>
    <a @click="refreshPage" style="margin-left: 10px" class="navbar-brand" href="#">Kişiselleştirilmiş Akademik Gelişim ve
      <br />
      Değerlendirme Sistemi</a>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <!-- li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li !-->
      </ul>
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
    <a href="#" class="card-link" @click="goToInstructorLearningOutcome">Öğrenim Çıktıları</a><br />
    <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a>
  </div>
</div>
  <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
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
  <ul style="max-width: 73rem" class="list-group">
    <li class="list-group-item" v-for="assessment in generalAssessments" :key="assessment.generalAssesmentId">
      <a href="#">{{ assessment.name }}</a>
      <input type="text" v-model="assessment.totalContribution" :placeholder="'%' + assessment.name" />
    </li>
    <li>
      <button style="margin-left: 2px; margin-top: 5px;" class="btn btn-outline-success" @click="saveChanges">Değişiklikleri Kaydet</button>
    </li>
  </ul>
</div>

    <ul style="max-width: 73rem" class="list-group list-group-flush"></ul>
    <div class="card-body">
    <div>
      <input v-model="assessmentName" type="text" placeholder="Araç türünü yazınız..">
      <input v-model="assessmentContribution" style="margin-left: 4px;" type="text" placeholder="%Araç katkısını yazınız..">
    </div>
    <h1></h1>
    <button @click="addGeneralAssessment" class="btn btn-outline-primary my-2 my-sm-0" style="width: auto; height: auto; margin-bottom: 20px;"
      type="submit">
      Araç Türü Ekle
    </button>
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
      odevInput: "",
      labInput: "",
      katilimInput: "",
      araSınavInput: "",
      finalInput: "",
      selectedItem: null,
    };
  },
  created() {
    // Parametreler arasında courseId bekleniyor varsayalım
    const courseId = this.$route.params.courseId;
    this.fetchCourse(courseId); // Dersin detaylarını backend'den almak için metod çağrılıyor
    this.fetchGeneralAssessments(courseId); // Dersin genel değerlendirmelerini getir
  },
  methods: {
    async fetchGeneralAssessments(courseId) {
      try {
        const response = await fetch(`http://localhost:8080/generalAssesment/course/${courseId}/general-assessments`);
        if (!response.ok) {
          throw new Error('Failed to fetch general assessments');
        }
        this.generalAssessments = await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    fetchCourse(courseId) {
      axios.get(`http://localhost:8080/course/${courseId}`)
        .then(response => {
          this.course = response.data; // Backend'den gelen dersin detayları course değişkenine atanıyor
        })
        .catch(error => {
          console.error('Error fetching course:', error);
        });
    },
    saveChanges() {
  try {
    const courseId = this.$route.params.courseId;

    this.generalAssessments.forEach(assessment => {
      const requestData = {
        generalAssesmentId: assessment.generalAssesmentId,
        newAssesmentContribution: assessment.totalContribution
      };

      console.log("newAssesmentContribution:", requestData.newAssesmentContribution);
      console.log("generalAssesmentId:", requestData.generalAssesmentId);

      // Değişiklikleri backend'e gönderme
      axios.put(`http://localhost:8080/updateTotalContributionForCourse/${courseId}`, requestData)
        .then(response => {
          if (response.status === 200) {
            console.log("Değişiklikler başarıyla kaydedildi.");
            // İsteğin başarılı olduğunu kullanıcıya bildirme veya gerekirse başka bir işlem yapma
          } else {
            console.error("Değişiklikler kaydedilemedi.");
            // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
          }
        })
        .catch(error => {
          console.error("Değişiklikler kaydedilirken bir hata oluştu:", error);
          // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
        });
    });
  } catch (error) {
    console.error("Değişiklikler kaydedilirken bir hata oluştu:", error);
    // Hata durumunda kullanıcıya bildirme veya gerekirse başka bir işlem yapma
  }
},

    addGeneralAssessment() {
    const courseId = this.$route.params.courseId;
    const name = this.assessmentName; // Formdaki "Araç türü" girdisi
    const totalContribution = this.assessmentContribution; // Formdaki "%Araç katkısı" girdisi

    const requestData = {
      courseId: courseId,
      name: name,
      totalContribution: totalContribution
    };

    axios.post('http://localhost:8080/generalAssesment/create-generalAssesment', requestData)
      .then(response => {
        console.log('GeneralAssessment başarıyla eklendi:', response.data);
        // Ekleme başarılıysa gerekli işlemleri yapabilirsiniz
        // Örneğin, eklenen GeneralAssessment'i listede göstermek gibi
      })
      .catch(error => {
        console.error('GeneralAssessment eklenirken bir hata oluştu:', error);
        // Hata durumunda gerekli işlemleri yapabilirsiniz
      });
  },
    goToLoginPage(){
      this.$router.push("/");
    },
    goToCoursePage(){
      this.$router.push("/instructor-home");
    },
    goToLearningOutcomePage(){
      this.$router.push("/learning-outcome");
    },
    goToMatchMatrixPage(){
      this.$router.push("/instructor-match-matrix");
    },
    goToStudentInfoPage(){
      this.$router.push("/student-info");
    },
    goToInstructorLearningOutcome(){
      this.$router.push("/instructor-learning-outcome");
    },
    refreshPage() {
      //window.location.reload();
      this.$router.push("/instructor-home");
    },
    handleButton1() {
      console.log("Button 1 clicked");
    },
    handleButton2() {
      // Logic for button 2
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
  margin-right: 25px;

}
.container {
  display: flex;
  align-items: center;
  
}


.list-group-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-group-item input {
  margin-left: 10px;
}
.menu{
  width: 13rem;
  margin-left: 10px;

}
</style>
  