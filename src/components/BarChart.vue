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
  name: 'BarChart',
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
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'red',
            borderWidth: 1
          },
          {
            data: [],
            label: 'Skor',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'blue',
            borderWidth: 1
          },
          {
            data: [],
            label: 'Araç',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'green',
            borderWidth: 1
          }
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: 'red'
            },
          },
          y: {
            max: 100,
            ticks: {
              color:'rgba(255, 99, 132)'
            },
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14
              },
              color: '#000'
            }
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return this.outcomes[index].description;
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
      const response = await axios.get(`http://localhost:8080/learningOutcomes/course/${id}`);
      this.outcomes = response.data;
      this.outcomes.sort((a, b) => {
            return a.id - b.id;
        });

      console.log(this.outcomes)
      // ÖÇ 1, ÖÇ 2 şeklinde etiketleri oluşturma
      this.chartData.labels = this.outcomes.map((_, index) => `ÖÇ ${index + 1}`);
      console.log('Chart Labels:', this.chartData.labels);

      this.chartData.datasets[0].data = this.outcomes.map(outcome => outcome.levelOfProvision);
      this.chartData.datasets[1].data = this.outcomes.map(outcome => outcome.scoreSum);
      this.chartData.datasets[2].data = this.outcomes.map(outcome => outcome.assessmentSum);

      this.loaded = true;
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  }
};
</script>
