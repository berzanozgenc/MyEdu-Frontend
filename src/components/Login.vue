<template>
    <img class="logo" src="../assets/Baskent_University_Logo.png">
    <h1 class="title">myEdu</h1>
    <div class="login">
        <input type="email" placeholder="Email" v-model="email" @keyup.enter="loginUser" />
        <div class="password-container">
            <div class="password-input-wrapper">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Şifre" v-model="password" @keyup.enter="loginUser" />
                <label class="show-password-label">
                    <i class="fa" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility"></i>
                </label>
            </div>
        </div>

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
            error: null,
            token: "",
            showPassword: false
        }
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:8080/auth/authentication', {
                    email: this.email,
                    password: this.password
                    
                });
                console.log(this.password);
                this.$store.dispatch('loginUser', { user: response.data.user, token: response.data.token });
                
                console.log(response.data); // Yanıtın içeriğini konsola yazdır
                
                // Bu kısmı düzenleyin
                this.$router.push("/guidance");
            } catch (error) {
                // İstek başarısız olduğunda yapılacak işlemler
                console.error('Hata:', error);
                this.$toast.error("Hatalı giriş. Lütfen tekrar deneyin.");
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword; // Değişkeni tersine çevirerek şifrenin görünürlüğünü değiştirin
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

.password-container {
    position: relative;
    width: 300px; /* veya istediğiniz bir genişlik */
    margin: 0 auto; /* Ortalamak için */
}

.password-input-wrapper {
    position: relative;
}



.show-password-label {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}
</style>
