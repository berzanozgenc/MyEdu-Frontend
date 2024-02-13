<template>
    <img class="logo" src="../assets/Baskent_University_Logo.png">
    <h1 class="title">myEdu</h1>
    <div class="login">
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Şifre" v-model="password" />
        <button @click="loginUser" type="button" class="btn btn-danger">Giriş Yap</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Login",
    data() {
        return {
            email: "",
            password: "",
            error: null
        }
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:8080/auth/authentication', {
                    email: this.email,
                    password: this.password
                });
                
                // İstek başarılı olduğunda yapılacak işlemler
                console.log(response.data); // Örnek: response.data.token gibi bir dönüş olabilir
                
                // Bu kısmı düzenleyin
                this.goToInstructorHomePage();
            } catch (error) {
                // İstek başarısız olduğunda yapılacak işlemler
                console.error('Hata:', error);
                this.$toast.error("Hatalı giriş. Lütfen tekrar deneyin.");
            }
        },
        goToInstructorHomePage() {
            this.$router.push("/instructor-home");
        }
    },
};
</script>




<style>
.logo {
    width: 200px;
    display: block;
    margin-top: 100px;
    margin-bottom: 30px;
    margin-right: auto;
    margin-left: auto;
}

.login input {
    width: 300px;
    height: 40px;
    padding-left: 20px;
    display: block;
    margin-bottom: 30px;
    margin-right: auto;
    margin-left: auto;
    border: 1px solid red;
    border-radius: 10px;
}

.login button {
    display: block;
    border-radius: 25px;
    margin-left: auto;
    margin-right: auto;
    width: 180px;
    height: 40px;
}

.title {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 120px;
    font-family: Arial;
}
</style>