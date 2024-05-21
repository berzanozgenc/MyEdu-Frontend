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
          label: 'Öğrenim Çıktısı Sağlanma Düzeyi (%)',
          backgroundColor: 'rgba(1, 148, 233, 0.2)', // Barların arka plan rengini kırmızı yap
          borderColor: 'blue', // Barların kenar rengini kırmızı yap
          borderWidth: 1 // Barların kenar kalınlığını ayarlama
        }]
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false, // X ekseni etiketlerini gizle
              color: 'blue' // X ekseni etiket rengini kırmızı yap
            },
          
          },
          y: {
            max: 100,
            ticks: {
              color:'rgba(1, 148, 233)' // Y ekseni etiket rengini kırmızı yap
            },
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14 // Yazı boyutunu ayarlama
              },
              color: '#000' // Yazı rengini ayarlama
            }
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return this.outcomes[index].description; // Tooltip başlığı olarak outcome description göster
              }
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
  