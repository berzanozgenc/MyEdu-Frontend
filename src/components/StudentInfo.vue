<template>
  <div>
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
        <button style="margin-left: 8px;" @click="logoutUser" class="btn btn-outline-danger my-2 my-sm-0" type="submit">Çıkış Yap</button>
      </div>
    </nav>


    <div class="flex-container">
      <div class="card" style="width: 13rem; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">Menü</h5>
          <a href="#" class="card-link" @click="goToCoursePage">Derslerim</a><br />
          <a href="#" class="card-link" @click="goToInstructorLearningOutcomePage">Öğrenim Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToCourseProgramOutcomePage">Program Çıktıları</a><br />
          <a href="#" class="card-link" @click="goToMatchMatrixPage">ÖÇ ve PÇ Eşleştirme</a><br />
          <a href="#" class="card-link" @click="goToStudentListPage">Öğrenci Listesi</a><br />
        </div>
      </div>

      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Öğrenci Notları</h5>
          <div>
            <button v-if="!isEditMode" @click="enableEditMode" class="btn btn-primary mb-2"><i
                class="fas fa-pencil-alt"></i> </button>
            <button v-if="isEditMode" @click="saveAllChanges" class="btn btn-success mb-2">Notları Kaydet</button>
            <button style="margin-left: 2px;" v-if="isEditMode" @click="disableEditMode"
              class="btn btn-danger mb-2">Vazgeç</button>

          </div>
          <table class="table table-stretched mt-3">
            <thead>
              <tr>
                <th scope="col"></th>
                <th v-for="(assessment, index) in assessments" :key="'assessment-' + index" scope="col">
                  <div class="d-flex align-items-center">
                    <span>{{ !useCustomNames ? assessment.name : 'Soru' }} {{ index + 1}}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, studentIndex) in students" :key="studentIndex">
                <th scope="row">{{ student.studentNumber }}{{ student.firstName }} {{ student.lastName }} </th>
                <td :ref="`cell_${studentIndex}_${assessmentIndex}`"
  v-for="(assessment, assessmentIndex) in assessments" :key="'assessment-' + assessmentIndex"
  :contenteditable="isEditMode"
  @keydown="handleTab"
  @mousedown="handleMouseDown">
  <span style="align-items: center; justify-content: center; display: flex;">
    <input style="text-align: center;" v-if="isEditMode" type="text" v-bind:placeholder="fillTable(studentIndex, assessmentIndex)" v-model="cellData[studentIndex][assessmentIndex]" tabindex="0"/> <span v-else></span>
    <span v-else>{{ fillTable(studentIndex, assessmentIndex) }}</span>
  </span>
</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';

export default {
  name: "StudentInfo",
  data() {
    return {
      assessments: [],
      cellData: [],
      students: [], // Öğrenci listesini tutmak için yeni bir veri alanı
      grades: [],
      isEditMode: false,
      useCustomNames: false
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
    const generalAssessmentId = this.$route.params.generalAssessmentId;

    this.fetchUseCustomNames();

    // Dersi alan öğrencileri getir
    axios.get(`http://localhost:8080/student-course/${courseId}/students`)
      .then(response => {
        this.students = response.data; // Öğrenci listesini al
        if (this.assessments && this.students) {
          this.cellData = new Array(this.students.length).fill().map(() => new Array(this.assessments.length).fill(''));
          this.fetchTable();
        }
      })
      .catch(error => {
        console.error('Error fetching student list:', error);
      });

    // Genel değerlendirmeye ait soruları veya değerlendirmeleri getir
    axios.get(`http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`)
      .then(response => {
        this.assessments = response.data.sort((a, b) => a.assessmentId - b.assessmentId);
        if (this.assessments && this.students) {
          this.cellData = new Array(this.students.length).fill().map(() => new Array(this.assessments.length).fill(''));
          this.fetchTable();
        }
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });

    // Genel değerlendirmenin soru tabanlı olup olmadığını kontrol et
    axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`)
      .then(response => {
        this.isQuestionBased = response.data; // Aldığımız veriyi kullanarak isQuestionBased değişkenini güncelle
      })
      .catch(error => {
        console.error('Error fetching question based status:', error);
      });
  },
  methods: {
    async fetchUseCustomNames() {
            try {
                const generalAssessmentId = this.$route.params.generalAssessmentId;
                const response = await axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`);
                this.useCustomNames = response.data; // Backend'den gelen veriyi useCustomNames değişkenine atar
            } catch (error) {
                console.error("Error fetching useCustomNames:", error);
            }
        },
    async saveAllChanges() {
      try {
        const studentIds = this.students.map(student => student.userId);
        const assessmentIds = this.assessments.map(assessment => assessment.assessmentId);

        let stAsArr = [];
        for (let studentIndex = 0; studentIndex < studentIds.length; studentIndex++) {
          const studentId = studentIds[studentIndex];
          for (let assessmentIndex = 0; assessmentIndex < assessmentIds.length; assessmentIndex++) {
            const assessmentId = assessmentIds[assessmentIndex];
            const cellValue = this.cellData[studentIndex][assessmentIndex];

            if (cellValue < 0 || cellValue == NaN)
              this.$toast.error("Lütfen Geçerli Sayı Giriniz!");

            if (isNaN(cellValue)) {
              this.$toast.error("Lütfen Geçerli Değer Giriniz!");
            }

            // dolu boş kontrolü
            if (cellValue == undefined || cellValue == "" || cellValue == NaN || cellValue < 0)
              continue;

            let obj = {
              "assessmentId": assessmentId,
              "user_id": studentId,
              "grade": parseFloat(cellValue)
            }

            stAsArr.push(obj);

          }
        }

        const response = await axios.post('http://localhost:8080/student-assessment/create', {
          "stAsList": stAsArr
        })

        if (response.status == 200) {
          this.$toast.success("Tüm değişiklikler başarıyla kaydedildi!");
          await this.fetchTable();
        }

      } catch (error) {
        console.error("Error saving changes:", error);
      }
      this.isEditMode = false
    },

    fillTable(studentIndex, assessmentIndex) {
            var studentId = this.students[studentIndex].userId
            var assessmentId = this.assessments[assessmentIndex].assessmentId
            var grade = 0;
            var emptySt = "";


            for (var i = 0; i < this.grades.length; i++) {
                let grad = this.grades[i]
                if (grad.assessmentId == assessmentId && grad.studentId == studentId) {
                    grade = grad.grade;
                    return grade;
                }

            }
            return emptySt
        },

    async fetchTable() {
      try {
        const studentIds = this.students.map(student => student.userId);
        const assessmentIds = this.assessments.map(assessment => assessment.assessmentId);

        let stAsArr = [];
        for (let studentIndex = 0; studentIndex < studentIds.length; studentIndex++) {
          const studentId = studentIds[studentIndex];
          for (let assessmentIndex = 0; assessmentIndex < assessmentIds.length; assessmentIndex++) {
            const assessmentId = assessmentIds[assessmentIndex];
            let obj = {
              "assessmentId": assessmentId,
              "user_id": studentId,
            }
            stAsArr.push(obj);
          }
        }

        const response = await axios.post('http://localhost:8080/student-assessment/grade', {
          "studentGradeDTOList": stAsArr
        },
        );
        if (response.status == 200) {

          var tempList = [];
          for (var i = 0; i < response.data.grades.length; i++) {
            var obj = {
              grade: response.data.grades[i].grade,
              studentId: response.data.grades[i].student.userId,
              assessmentId: response.data.grades[i].assessment.assessmentId
            }
            tempList.push(obj)
          }
          this.grades = tempList;
          console.log(this.grades);
        }

      } catch (error) {
        console.error("Error filling table:", error);
      }

    },
    handleTab(event) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      const focusable = this.$el.querySelectorAll('input[tabindex]');
      const index = Array.prototype.indexOf.call(focusable, event.target);
      const nextElement = focusable[index + 1] || focusable[0];
      nextElement.focus();
    }
  },
    enableEditMode() {
      this.isEditMode = true;
    },
    disableEditMode() {
      this.isEditMode = false;
    },
    goToLoginPage() {
      this.$router.push("/");
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
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
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    handleMouseDown(event) {
    // Tıklanan element input alanı değilse, olayın işlenmesini engelle
    if (!event.target.tagName.toLowerCase().includes('input')) {
      event.preventDefault();
    }
  },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
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

select {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input.editable,
select.editable {
  border-color: #007bff;
}
.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
