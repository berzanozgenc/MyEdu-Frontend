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
                    <li class="list-group-item" @click="goToHome">
                        <i class="fas fa-users"></i> Departmanlar
                    </li>
                    <li class="list-group-item">
                        <i class="fas fa-info-circle"></i> Birim Kullanıcıları
                    </li>
                </ul>
            </div>
        </div>
        <div class="card" style="width: 80%;">
            <div class="card-body" style="overflow-x: auto;">
                <h5 style="color: #dc3545;" class="card-title">Birim Kullanıcıları</h5>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 150px;">Email</th>
                            <th scope="col" style="width: 150px;">Ad</th>
                            <th scope="col" style="width: 150px;">Soyad</th>
                            <th scope="col" style="width: 150px;">Departman</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in users" :key="index">
                            <td>
                                <input v-if="item.editable" type="text" class="form-control editable"
                                    v-model="item.email" style="width: 250px;">
                                <div class="loDescription" v-else>{{ item.email }}</div>
                            </td>
                            <td>
                                <input v-if="item.editable" type="text" class="form-control editable"
                                    v-model="item.firstName" style="width: 250px;">
                                <div class="loDescription" v-else>{{ item.firstName }}</div>
                            </td>
                            <td>
                                <input v-if="item.editable" type="text" class="form-control editable"
                                    v-model="item.lastName" style="width: 250px;">
                                <div class="loDescription" v-else>{{ item.lastName }}</div>
                            </td>
                            <td>
                                <input v-if="item.editable" type="text" class="form-control editable"
                                    v-model="item.department.name" style="width: 250px;">
                                <div class="loDescription" v-else>{{ item.department.name }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="card-body">
                    <h5 class="card-title">Birim Kullanıcı Ekle</h5>
                    <div class="form-group">
                        <label for="name">Kullanıcı Mail:</label>
                        <textarea class="form-control" id="name" v-model="newUser.email"
                            style="width: 250px; height: 50px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="name">Kullanıcı Adı:</label>
                        <textarea class="form-control" id="name" v-model="newUser.firstName"
                            style="width: 250px; height: 50px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="name">Kullanıcı Soyadı:</label>
                        <textarea class="form-control" id="name" v-model="newUser.lastName"
                            style="width: 250px; height: 50px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="name">Kullanıcı Şifresi:</label>
                        <textarea class="form-control" id="name" v-model="newUser.password"
                            style="width: 250px; height: 50px;"></textarea>
                    </div>
                    <div class="form-group">
    <label for="department">Kullanıcı Departmanı:</label>
    <select class="form-control" id="department" v-model="newUser.department" style="width: 250px;">
        <option v-for="department in departments" :key="department" :value="department">{{ department.name }}</option>
    </select>
</div>
                    <br> 
                    <button class="btn btn-outline-primary my-2 my-sm-0"
                        style="width: 150px; height: 35px; margin-top: 2px" type="submit" @click="addUser">
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
    name: "SuperuserAddUser",
    computed: {
        ...mapGetters(["getUser"]),
        username() {
            const user = this.getUser;
            return user ? `${user.firstName} ${user.lastName}` : "";
        },
    },
    created() {
        this.fetchUsers();
        this.fetchDepartments();
    },
    data() {
    return {
      users: [],
      departments: [],
      newUser: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        department: null,
        statusCode: 3,
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
        async fetchUsers() {
      try {
        const response = await axios.get(`http://localhost:8080/admins`);
        this.users = response.data;
      } catch (error) {
        console.error(error);
        this.$toast.error("Kullanıcılar alınırken bir hata oluştu.");
      }
    },
   async fetchDepartments(){
    try {
        const response = await axios.get(`http://localhost:8080/departments`);
        this.departments = response.data;
      } catch (error) {
        console.error(error);
        this.$toast.error("Departmanlar alınırken bir hata oluştu.");
      }
   },
    async addUser() {
      if (!this.newUser.firstName.trim() || !this.newUser.lastName.trim() || !this.newUser.password.trim() || !this.newUser.department.name.trim() || !this.newUser.email.trim()) {1
        this.$toast.error("Lütfen Bilgileri Eksiksiz Girin!");
        return;
      }
      const data = {
        email: this.newUser.email,
        firstName: this.newUser.firstName,
        lastName: this.newUser.lastName,
        password: this.newUser.password,
        department: this.newUser.department,
        statusCode: this.newUser.statusCode
      };
      try {
        console.log(data);
        const response = await axios.post('http://localhost:8080/admins', data);
        console.log(response.data);
        this.newUser.email = '';
        this.newUser.firstName = '';
        this.newUser.lastName = '';
        this.newUser.password = '';
        this.newUser.department = null;
        this.fetchUsers();
        this.$toast.success("Birim Kullanıcı başarıyla oluşturuldu.");
      } catch (error) {
        console.error(error);
        this.$toast.error("Birim Kullanıcı eklenirken bir hata oluştu.");
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
    goToHome(){
        this.$router.push('/superuser-home');
    }
  },
    }



</script>