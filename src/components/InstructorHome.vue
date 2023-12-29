<template>

<div class="col-xl-6 col-sm-8">
    
    <img class="icon" src="../assets/Profile_Icon.png">
    <h2>Mustafa Sert</h2>
    <br>
    <div>
        <select v-model="selectedItem">
        <option> Ders 1</option>
        <option> Ders 2</option>
        <option> Ders 3</option>
  </select>

    </div>
  

</div>




</template>
    
<script>
export default {
    name: 'InstructorHome'
}
</script>

<style>

row {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    flex-direction: row;
}


.icon{
  width: 60px;
}

</style>