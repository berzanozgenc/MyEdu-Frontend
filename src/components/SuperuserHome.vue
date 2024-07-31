<template>

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
        <div class="card menu" style="width: 12%; margin-left: 10px;">
            <div class="card-body">
                <h5 class="card-title">Menü</h5>
                <ul class="list-group">
                    <li class="list-group-item">
                        <i class="fas fa-users"></i> Departmanlar
                    </li>
                    <li class="list-group-item" @click="goToAddUser">
                        <i class="fas fa-info-circle"></i> Birim Kullanıcıları
                    </li>
                </ul>
            </div>
        </div>
        <div class="card" style="width: 80%;">
            <div class="card-body" style="overflow-x: auto;">
                <h5 style="color: #dc3545;" class="card-title">Departmanlar</h5>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 150px;">Departman</th>
                            <th scope="col" style="width: 150px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in departments" :key="index">
                            <td>
                                <input v-if="item.editable" type="text" class="form-control editable"
                                    v-model="item.name" style="width: 250px;">
                                <div class="loDescription" v-else>{{ item.name }}</div>
                            </td>
                            <td>
                                <button style="margin-left: 2px;" v-if="item.editable"
                                    class="btn btn-success btn-sm text-white"
                                    @click="updateDepartment(item)">Kaydet</button>
                                <button style="margin-left: 2px;" v-else class="btn btn-warning btn-sm text-white"
                                    @click="editDepartment(item)">Düzenle</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="card-body">
                    <h5 class="card-title">Departman Ekle</h5>
                    <div class="form-group">
                        <label for="name">Departman Adı:</label>
                        <textarea class="form-control" id="name" v-model="newDepartment.name"
                            style="width: 250px; height: 100px;"></textarea>
                    </div>
                    <br>
                    <button class="btn btn-outline-primary my-2 my-sm-0"
                        style="width: 150px; height: 35px; margin-top: 2px" type="submit" @click="addDepartment">
                        Ekle
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name: "SuperuserHome",
    computed: {
        ...mapGetters(["getUser"]),
        username() {
            const user = this.getUser;
            return user ? `${user.firstName} ${user.lastName}` : "";
        },
    },
    created() {
        this.fetchDepartments();
    },
    data() {
    return {
      departments: [],
      newDepartment: {
        name: '',
      }
    };
  },
    methods: {
        async logoutUser() {
            const store = useStore();
            const router = useRouter();
            localStorage.removeItem('store');
            this.$store.dispatch('logoutUser');
            this.$router.push("/");
        },
        async fetchDepartments(courseId) {
      try {
        const response = await axios.get(`http://localhost:8080/departments`);
        this.departments = response.data;
      } catch (error) {
        console.error(error);
        this.$toast.error("Departmanlar alınırken bir hata oluştu.");
      }
    },
    async addDepartment() {
      if (!this.newDepartment.name.trim()) {1
        this.$toast.error("Lütfen Departman Adını Girin!");
        return;
      }
      const data = {
        name: this.newDepartment.name,
      };
      try {
        console.log(data);
        const response = await axios.post('http://localhost:8080/departments', data);
        console.log(response.data);
        this.newDepartment.name = '';
        this.fetchDepartments();
        this.$toast.success("Departman başarıyla oluşturuldu.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Departman eklenirken bir hata oluştu.");
      }
    },
    editDepartment(department) {
      department.editable = true;
    },
    async updateDepartment(department){
        try {
        await axios.put(`http://localhost:8080/departments/${department.id}`, {
          name: department.name,
        });
        department.editable = false;
        this.fetchDepartments();
        this.$toast.success("Departman başarıyla güncellendi.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Departman güncellenirken bir hata oluştu.");
      }
    },
    goToAddUser(){
        this.$router.push('/superuser-addUser');
    }
  },
    }



</script>