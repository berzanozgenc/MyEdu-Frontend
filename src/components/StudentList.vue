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
      <div class="card" style="width: 80%;margin-left: 10px;"> <!-- Kartın sol kenara yakın olmasını sağlayacak olan stil değişikliği -->
        <div class="card-body" style="overflow-x: auto;">
          <div class="card-body">
            <h5 class="card-title">Öğrenci Ekle</h5>
            <form @submit.prevent="addStudent($route.params.courseId)">
              <div class="form-group">
              <label for="studentDropdown">Öğrenci Seç:</label>
              <select class="form-control" id="studentDropdown" v-model="selectedStudent">
                <option v-for="student in allStudents" :key="student.id" :value="student.id">{{ student.name }}</option>
              </select>
            </div>
              <button class="btn btn-outline-primary" type="submit">Öğrenci Ekle</button>
            </form>
            <div>
        <h5 class="card-title">Excelden Öğrenci Ekle</h5>
        <div>
        <a @mouseenter="showInfoBox = true" @mouseleave="showInfoBox = false" style="cursor: pointer; color: #007bff;;">
          <i class="fas fa-info-circle"></i> Excel Formatı
        </a>
        <div v-if="showInfoBox" class="info-box">
          <p>Ders için yükleyeceğiniz Excel'in sütun bazlı formatı:
            Numara, Ad Soyad
            şeklinde olmalıdır. İlk satır başlığa ayrılmalıdır. Verilerin önü ve arkasında BOŞLUK bulunmamalıdır.

          </p>
        </div>
      </div>
        <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
        <button class="btn btn-outline-primary" @click="uploadExcelStudents">Excelden Öğrenci Ekle</button>
      </div>
          </div>
          <h5 class="card-title">Dersin Öğrencileri</h5>
          <table class="table">
            <thead>
              <tr>
                <th scope="col" style="width: 10px;"></th>
                <th scope="col" style="width: 150px;">Öğrenci Numarası</th>
                <th scope="col" style="width: 150px;">Öğrenci Adı-Soyadı</th>
                <th scope="col" style="width: 150px;">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in students" :key="index">
                <td>Öğrenci {{ index + 1 }}</td>
                <td>{{ item.studentNumber }}</td>
                <td>{{ item.firstName }} {{ item.lastName }}</td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="goToInstructorStudent(item.userId)">Bilgileri Görüntüle</button>
                  <button style="margin-left: 2px;" class="btn btn-danger btn-sm" @click="deleteStudent(item.userId)" >Sil</button>
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
            <h5 class="modal-title">Öğrenciyi Dersten Sil</h5>
          </div>
          <div class="modal-body">
            <p>Bu öğrenciyi dersten silmek istediğinizden emin misiniz?</p>
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
import ExcelJS from 'exceljs';

export default {
  name: "StudentList",
  data() {
    return {
      students: [],
      showInfoBox: false,
      excelStudents: [],
      allStudents: [],
      selectedStudentId: null,
      showModal: false,
      newStudent: {
        output: '',
        description: '',
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
  async created() {
    const courseId = this.$route.params.courseId;
    console.log("Course ID:", courseId);
    this.fetchAllStudents();
    this.fetchStudents(courseId);
},
  methods: {
    goToLoginPage() {
      this.$router.push("/");
    }, 
    goToInstructorStudent(studentId) {
      const courseId = this.$route.params.courseId;
      console.log(studentId)
      this.$router.push({
        name: 'InstructorStudent',
        params: {
          courseId: courseId,
          studentId: studentId
        }
      });
  },
  goToGuidePage(){
this.$router.push('/guidance');
        },
    goToMatchMatrixPage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "MatchMatrix", params: { courseId: courseId }});
    },
    goToInstructorLearningOutcomePage() {
    const courseId = this.$route.params.courseId;
    this.$router.push({ name: "InstructorLearningOutcome", params: { courseId: courseId }});
    },
    goToCourseProgramOutcomePage() {
      const courseId = this.$route.params.courseId;
      this.$router.push({ name: "CourseProgramOutcome", params: { courseId: courseId } });
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
    editStudent(student) {
      student.editable = true;
      console.log("Düzenle butonuna tıklandı");
    },

    deleteStudent(studentId) {
      this.selectedStudentId = studentId; // Silinecek öğrencinin ID'sini sakla
      this.showModal = true; // Modal'ı göster
    },

    async confirmDelete() {
      try {
    const courseId = this.$route.params.courseId
    const studentId = this.selectedStudentId
   
    await axios.delete(`http://localhost:8080/student-course/student/${studentId}/course/${courseId}`);
    this.$toast.success("Öğrenci başarıyla silindi.");
    this.fetchStudents(this.$route.params.courseId);
  } catch (error) {
    this.$toast.error("Öğrenci silinirken bir hata oluştu.");
  }
      this.showModal = false;
    },

    closeModal() {
      this.showModal = false;
    },
    async handleFileUpload(event) {
  console.log("Excel dosyası yükleniyor...");
  const file = event.target.files[0];
  const data = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook(); // ExcelJS ile Workbook oluştur
  await workbook.xlsx.load(data); // Verileri yükle
  const firstSheet = workbook.worksheets[0]; // İlk çalışma sayfasını al

  // Sütun başlıklarını al
  const columnHeaders = firstSheet.getRow(1).values;

  // "Öğrenci Numarası" ve "Öğrenci Adı-Soyadı" sütunlarının indekslerini bul
  const studentNumberIndex = columnHeaders.indexOf("Öğrenci Numarası");
  const studentNameIndex = columnHeaders.indexOf("Öğrenci Adı-Soyadı");

  // Verileri saklamak için boş bir dizi oluştur
  const studentsData = [];

  // Her satırı döngüye alarak sütun verilerini al
  firstSheet.eachRow((row, rowIndex) => {
    // İlk satırı atla (sütun başlıkları)
    if (rowIndex === 1) return;

    // Öğrenci numarasını ve adı-soyadını al
    const studentNumber = row.getCell(studentNumberIndex).value;
    const studentName = row.getCell(studentNameIndex).value;

    // Verileri nesne olarak oluşturup diziye ekle
    studentsData.push({
      studentNumber,
      studentName
    });
  });

  // Excel dosyasından okunan öğrenci verilerini göster
  console.log("Excel dosyasından okunan öğrenci verileri:", studentsData);

  // Okunan verileri bir değişkende sakla
  this.excelStudents = studentsData;

  console.log("Excel dosyası başarıyla yüklendi.");
},

async uploadExcelStudents() {
  console.log("Excelden öğrenciler yükleniyor...");
  const courseId = this.$route.params.courseId;
  const studentsData = this.excelStudents; // handleFileUpload tarafından ayarlanan verileri kullan
  console.log("Excelden öğrenciler:", studentsData);

  // Öğrencileri dersle ilişkilendirme
  for (let student of studentsData) {
    const studentNumber = student.studentNumber;
    const studentName = student.studentName;
    
    let studentId = null;
    try {
      // Öğrenci kimliğini bul
      console.log(studentNumber);
      const response = await axios.get(`http://localhost:8080/students/getStudentIdByNumber/${studentNumber}`);
      console.log(response);
      studentId = response.data;
      console.log(studentId);

      // Eğer öğrenci ID'si bulunduysa
      if (studentId) {
        // Öğrenciyi derse ekle
        await this.addStudentToCourse(courseId, studentId);
        console.log(`Öğrenci ${studentName} başarıyla ${courseId} numaralı derse eklendi.`);
      } else {
        console.warn(`Öğrenci ${studentName} bulunurken bir hata oluştu, öğrenci sistemde mevcut olmayabilir.`);
      }
    } catch (error) {
      console.warn(`Öğrenci ${studentName} bulunurken bir hata oluştu, öğrenci sistemde mevcut olmayabilir. Hata:`, error.message);
    }
  }
  console.log("Excelden öğrenciler başarıyla yüklendi.");
  this.fetchStudents(courseId);
},


async addStudentToCourse(courseId, studentId) {
  try {
    const data = {
      studentId: studentId,
      courseId: courseId
    };
    console.log(studentId, courseId);
    const response = await axios.post(`http://localhost:8080/student-course/create`, data);
    console.log("Öğrenci derse başarıyla eklendi:", response.data);
    this.fetchStudents(courseId);
  } catch (error) {
    console.error("Öğrenci derse eklenirken bir hata oluştu:", error);
  }
},
async addStudent(courseId) {
  console.log("Öğrenci Ekle butonuna tıklandı");
  const studentId = this.selectedStudent;
  const data = {
    studentId: studentId,
    courseId: courseId
  };
  try {
    console.log(studentId, courseId);
    // Öğrenci-ders ilişkisini oluşturmak için POST isteği gönder
    const response = await axios.post(`http://localhost:8080/student-course/create`, data);
    console.log("Öğrenci başarıyla eklendi:", response.data);
    // Başarılı yanıt alındığında öğrenciyi ekleme işlemi tamamlanmıştır.
    // Gerekirse burada başka bir işlem yapabilirsiniz.
    this.$toast.success("Öğrenci başarıyla eklendi.");
    // Eklenen öğrencinin bilgilerini güncellemek için öğrenci listesini yeniden al
    this.fetchStudents(courseId);
  } catch (error) {
    // Hata durumunda hata mesajını göster
    console.error(error);
    this.$toast.error("Öğrenci eklenirken bir hata oluştu.");
  }
},
    logoutUser() {
      const store = useStore();
      const router = useRouter();
      localStorage.removeItem('store');
      this.$store.dispatch('logoutUser');
      this.$router.push("/");
    },

    async fetchStudents(courseId) {
    try {
        const response = await axios.get(`http://localhost:8080/student-course/${courseId}/students`);
        this.students = response.data;
    } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenciler alınırken bir hata oluştu.");
    }
},
async fetchAllStudents() {
    try {
        const response = await axios.get(`http://localhost:8080/students`);
        console.log(response.data);
        this.allStudents = response.data.map(student => ({
            id: student.userId,
            name: `${student.studentNumber} - ${student.firstName} ${student.lastName}`
        }));
    } catch (error) {
        console.error(error);
        this.$toast.error("Öğrenciler alınırken bir hata oluştu.");
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
.icon {
  max-width: 24px;
  max-height: 24px;
}
</style>
