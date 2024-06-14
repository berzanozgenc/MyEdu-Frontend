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
        <h5>{{ course.code }} {{ course.courseName }}</h5>
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
          </ul>
        </div>
      </div>
      <div class="card" style="width: 75rem; height: 40rem; overflow-y: auto; overflow-x: hidden">
        <div class="card-body">
          <h5 class="card-title">Öğrenci Notları</h5>
          <div>
            <button v-if="!isEditMode" @click="enableEditMode" class="btn btn-primary mb-2"><i class="fas fa-pencil-alt"></i></button>
            <button v-if="isEditMode" @click="saveAllChanges" class="btn btn-success mb-2">Notları Kaydet</button>
            <button style="margin-left: 2px;" v-if="isEditMode" @click="disableEditMode" class="btn btn-danger mb-2">Vazgeç</button>
          </div>
          <div>
        <a @mouseenter="showInfoBox = true" @mouseleave="showInfoBox = false" style="cursor: pointer; color: #007bff;;">
          <i class="fas fa-info-circle"></i> Excel Formatı
        </a>
        <div v-if="showInfoBox" class="info-box">
          <p>Ders için yükleyeceğiniz Excel'in sütun bazlı formatı:
            Öğrenci Numarası, Not Girilecek Araç İsimleri (Quiz 1, Quiz 2, Quiz 3)
            şeklinde olmalıdır. İlk satır başlığa ayrılmalıdır. Verilerin önü ve arkasında BOŞLUK bulunmamalıdır.

          </p>
        </div>
      </div>
          <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
          <button class="btn btn-outline-primary" @click="uploadExcelGrades">Excelden Not Gir</button>
          <div style="overflow-x: auto;">
            <table class="table table-stretched mt-3">
            <thead>
              <tr>
                <th scope="col"></th>
                <th v-for="(assessment, index) in assessments" :key="'assessment-' + index" scope="col">
                  <div class="d-flex align-items-center">
                    <span>{{ !useCustomNames ? assessment.name : 'Soru' }} {{ index + 1}} ({{ assessment.contribution }})</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, studentIndex) in students" :key="studentIndex">
                <th scope="row">{{ student.studentNumber }} {{ student.firstName }} {{ student.lastName }} </th>
                <td :ref="`cell_${studentIndex}_${assessmentIndex}`"
                    v-for="(assessment, assessmentIndex) in assessments"
                    :key="'assessment-' + assessmentIndex"
                    :contenteditable="isEditMode"
                    @keydown="handleTab"
                    @mousedown="handleMouseDown">
                  <span style="align-items: center; justify-content: center; display: flex;">
                    <input style="text-align: center;" v-if="isEditMode" type="text" v-bind:placeholder="fillTable(studentIndex, assessmentIndex)" v-model="cellData[studentIndex][assessmentIndex]" tabindex="0"/>
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
  </div>
</template>
<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import ExcelJS from 'exceljs';

export default {
  name: "StudentInfo",
  data() {
    return {
      showInfoBox: false,
      course: null,
      assessments: [],
      cellData: [],
      students: [],
      grades: [],
      isEditMode: false,
      useCustomNames: false,
      excelStudents: []
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
    this.fetchTable();

    // Fetch students
    axios.get(`http://localhost:8080/student-course/${courseId}/students`)
      .then(response => {
        this.students = response.data;
        console.log("Fetched Students:", this.students);  // Konsol log eklendi
        if (this.assessments.length > 0) {
          this.initializeCellData();
        }
      })
      .catch(error => {
        console.error('Error fetching student list:', error);
      });

    // Fetch assessments
    axios.get(`http://localhost:8080/assessments/generalAssessment/${generalAssessmentId}`)
      .then(response => {
        this.assessments = response.data.sort((a, b) => a.assessmentId - b.assessmentId);
        console.log("Fetched Assessments:", this.assessments);  // Konsol log eklendi
        if (this.students.length > 0) {
          this.initializeCellData();
        }
      })
      .catch(error => {
        console.error('Error fetching assessments:', error);
      });

    // Fetch question-based status
    axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`)
      .then(response => {
        this.isQuestionBased = response.data;
      })
      .catch(error => {
        console.error('Error fetching question based status:', error);
      });
  },
  methods: {
    async fetchUseCustomNames() {
      try {
        const courseId = this.$route.params.courseId;
        const generalAssessmentId = this.$route.params.generalAssessmentId;
        const response = await axios.get(`http://localhost:8080/generalAssesment/${generalAssessmentId}/isQuestionBased`);
        this.useCustomNames = response.data;
        const responseCourse = await axios.get(`http://localhost:8080/course/${courseId}`);
        this.course = responseCourse.data;
      } catch (error) {
        console.error("Error fetching useCustomNames:", error);
      }
    },
    initializeCellData() {
      // Initialize cellData array based on the number of students and assessments
      this.cellData = new Array(this.students.length).fill().map(() => new Array(this.assessments.length).fill(''));
      this.fetchTable();
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
        const contributionValue = this.assessments[assessmentIndex].contribution;

        // Eğer cellValue contributionValue'dan büyükse, hata mesajı göster ve işlemi durdur
        if (cellValue > contributionValue) {
          this.$toast.error(`Öğrenci ${this.students[studentIndex].studentNumber} için girilen not ${contributionValue} değerinden büyük olamaz!`);
          return; // Hata durumunda fonksiyondan çık
        }

        // Diğer doğrulamalar
        if (cellValue < 0 || isNaN(cellValue)) {
          this.$toast.error("Lütfen geçerli bir sayı giriniz!");
          return; // Hata durumunda fonksiyondan çık
        }

        if (cellValue == undefined || cellValue == "" || isNaN(cellValue) || cellValue < 0) {
          continue; // Hatalı değerleri atla
        }

        let obj = {
          "assessmentId": assessmentId,
          "user_id": studentId,
          "grade": parseFloat(cellValue)
        };

        stAsArr.push(obj);
      }
    }

    const response = await axios.post('http://localhost:8080/student-assessment/create', {
      "stAsList": stAsArr
    });

    if (response.status == 200) {
      this.$toast.success('Başarıyla Kaydedildi!');
      this.disableEditMode();
      this.fetchUseCustomNames();
      this.fetchTable();
    } else {
      this.$toast.error('Kaydedilirken Bir Hata Oluştu!');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    this.$toast.error('Kaydedilirken Bir Hata Oluştu!');
  }
},
    enableEditMode() {
      this.isEditMode = true;
    },
    disableEditMode() {
      this.isEditMode = false;
    },
    fillTable(studentIndex, assessmentIndex) {
  const student = this.students[studentIndex];
  const assessment = this.assessments[assessmentIndex];
  const grade = this.grades.find(g => g.assessmentId === assessment.assessmentId && g.studentId === student.userId);

  if (grade) {
    return grade.grade;
  } else {
    // Değer yoksa boş bir hücre döndür
    return null;
  }
},
    handleTab(event) {
      const target = event.target;
      if (event.key === 'Tab') {
        event.preventDefault();
        const cell = target.parentElement.parentElement;
        const cells = cell.parentElement.children;
        const index = Array.prototype.indexOf.call(cells, cell);

        const nextIndex = event.shiftKey ? index - 1 : index + 1;
        const nextCell = cells[nextIndex];

        if (nextCell) {
          nextCell.querySelector('input').focus();
        }
      }
    },
    handleMouseDown(event) {
      const target = event.target;
      if (target.contentEditable === 'true') {
        document.execCommand('selectAll', false, null);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.readExcelFile(file);
      }
    },
    readExcelFile(file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];

        const excelStudents = [];
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) {
    // İlk satırı atla, sadece öğrenci verilerini al
    return;
  }
  const studentNumber = row.getCell(1).value;
  const grades = row.values.slice(2); // Öğrenci notlarını al, isim ve soyisim bilgilerini atlamak için 2. sıradan başla

  const student = {
    studentNumber: studentNumber,
    grades: grades
  };
  excelStudents.push(student);
});


        this.excelStudents = excelStudents;
        this.populateGradesFromExcel();
      };
      reader.readAsArrayBuffer(file);
    },
    populateGradesFromExcel() {
      const studentMap = new Map(
        this.students.map((student) => [student.studentNumber, student])
      );

      this.excelStudents.forEach((excelStudent) => {
        const student = studentMap.get(excelStudent.studentNumber);
        if (student) {
          const studentIndex = this.students.indexOf(student);
          excelStudent.grades.forEach((grade, assessmentIndex) => {
            if (assessmentIndex < this.assessments.length) {
              this.cellData[studentIndex][assessmentIndex] = grade;
            }
          });
        }
      });
    },
    async uploadExcelGrades() {
  try {
    const studentIds = this.students.map(student => student.userId);
    const assessmentIds = this.assessments.map(assessment => assessment.assessmentId);

    let stAsArr = [];
    for (let studentIndex = 0; studentIndex < studentIds.length; studentIndex++) {
      const studentId = studentIds[studentIndex];
      for (let assessmentIndex = 0; assessmentIndex < assessmentIds.length; assessmentIndex++) {
        const assessmentId = assessmentIds[assessmentIndex];
        const cellValue = this.cellData[studentIndex][assessmentIndex];

        if (cellValue < 0 || isNaN(cellValue)) {
          this.$toast.error("Lütfen geçerli bir sayı giriniz!");
          return; // Hata durumunda fonksiyondan çık
        }

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
    });

    if (response.status == 200) {
      this.$toast.success('Başarıyla Kaydedildi!');
      this.disableEditMode();
      this.fetchTable();
    } else {
      this.$toast.error('Kaydedilirken bir hata oluştu!');
      this.fetchTable();
    }
  } catch (error) {
    console.error('Değişiklikler kaydedilirken bir hata oluştu:', error);
    this.$toast.error('Kaydedilirken bir hata oluştu!');
    
  }
},
    refreshPage() {
      window.location.reload();
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
    });
    console.log("responsedata",response.data)
    if (response.status == 200) {
      // Önceki not verilerini temizle
      this.grades = [];

      // Her bir öğrenci not verisini grades array'ine ekleyin
      response.data.grades.forEach(gradeData => {
        const grade = {
          grade: gradeData.grade,
          studentId: gradeData.student.userId,
          assessmentId: gradeData.assessment.assessmentId
        };
        this.grades.push(grade);
      });

      console.log(this.grades);
    }
  } catch (error) {
    console.error("Error filling table:", error);
  }
},
   goToLoginPage() {
      this.$router.push("/"); // Login page
    },
    goToCoursePage() {
      this.$router.push("/instructor-home");
    },
    goToStudentInfoPage() {
      this.$router.push("/student-info");
    },
    goToMatchMatrixPage() {
      this.$router.push("/instructor-match-matrix");
    },
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
    },
    goToLearningOutcomePage() {
      this.$router.push("/learning-outcome");
    },
    goToInstructorLearningOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId } });
    },
    goToGuidePage() {
      this.$router.push('/guidance');
    },
    goToStudentListPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "StudentList", params: { courseId: courseId } });
    },
    refreshPage() {
      this.$router.push("/instructor-home");
    },
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
  .flex-container {
    display: flex;
    flex-direction: row;
  }

  .menu {
    margin-right: 20px;
  }
</style>
