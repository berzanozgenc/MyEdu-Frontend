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
        datasets: [
          {
            data: [],
            label: 'Öğrenim Çıktısı Sağlanma Düzeyi (%)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Barların arka plan rengini mavi yap
            borderColor: 'red', // Barların kenar rengini mavi yap
            borderWidth: 1 // Barların kenar kalınlığını ayarlama
          },
          {
            data: [],
            label: 'Skor',
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Barların arka plan rengini farklı mavi yap
            borderColor: 'blue', // Barların kenar rengini farklı mavi yap
            borderWidth: 1 // Barların kenar kalınlığını ayarlama
          },
          {
            data: [],
            label: 'Araç',
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Barların arka plan rengini yeşil yap
            borderColor: 'green', // Barların kenar rengini yeşil yap
            borderWidth: 1 // Barların kenar kalınlığını ayarlama
          }
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false, // X ekseni etiketlerini gizle
              color: 'blue' // X ekseni etiket rengini mavi yap
            },
          },
          y: {
            max: 100,
            ticks: {
              color: 'rgba(1, 148, 233)' // Y ekseni etiket rengini mavi yap
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
      this.outcomes = response.data.filter(outcome => !isNaN(outcome.levelOfProvision) && outcome.levelOfProvision !== 0);
      this.chartData.labels = this.outcomes.map(outcome => outcome.description);
      this.chartData.datasets[0].data = this.outcomes.map(outcome => outcome.levelOfProvision);
      this.chartData.datasets[1].data = this.outcomes.map(outcome => outcome.score);
      this.chartData.datasets[2].data = this.outcomes.map(outcome => outcome.assessmentValue);
      this.loaded = true;
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  }
};
</script>
