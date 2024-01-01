<template>
    <img class="logo" src="../assets/Baskent_University_Logo.png">
    <h1 class="title">myEdu</h1>
    <div class="login">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Şifre" />
        <button type="button" class="btn btn-danger">Giriş Yap</button>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
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