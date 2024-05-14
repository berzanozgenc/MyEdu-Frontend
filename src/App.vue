<template>
  <router-view/>
</template>

<script>
import Login from './components/Login.vue';
import { ChartPlugin } from '@syncfusion/ej2-vue-charts';

export default {
  name: 'App',
  components: {
    Login
  }
}

</script>



