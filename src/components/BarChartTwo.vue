<template>
    <div>
      <Bar v-if="loaded" id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import axios from 'axios';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    name: 'BarChartTwo',
    components: { Bar },
    props: ['courseId'],
    data() {
      return {
        loaded: false,
        outcomes: [],
        chartData: {
          labels: [],
          datasets: [{
            data: [],
            label: 'Program Çıktısı Sağlanma Düzeyi (%)' 
          }]
        },
        chartOptions: {
          responsive: true,
          scales: {
            y: {
              max: 100
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                // Burada legend ayarlarını yapabilirsiniz
                font: {
                  size: 14 // Yazı boyutunu ayarlama
                },
                color: '#000' // Yazı rengini ayarlama
              }
            }
          }
        }
      };
    },
    async mounted() {
      this.loaded = false;
      const id = this.courseId;
      try {
        const response = await axios.get(`http://localhost:8080/program-outcomes/course/${id}`);
        this.outcomes = response.data;
        this.chartData.labels = this.outcomes.map(outcome => outcome.description);
        this.chartData.datasets[0].data = this.outcomes.map(outcome => outcome.levelOfProvision);
        this.loaded = true;
      } catch (error) {
        console.error('Error fetching outcomes:', error);
      }
    }
  };
  </script>
  