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
            label: 'Program Çıktısı Sağlanma Düzeyi (%)',
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
              color: 'blue'
            },
          },
          y: {
            max: 100,
            ticks: {
              color: 'rgba(1, 148, 233)'
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
                return this.outcomes[index].programOutcome.description;
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
      const response = await axios.get(`http://localhost:8080/courseProgramOutcomeResults/${id}`);
      this.outcomes = response.data;

      // Labels ve filter logic
      this.chartData.labels = this.outcomes.map(outcome => "PÇ " + outcome.programOutcome.number);
      console.log('Chart Labels:', this.chartData.labels);

      this.outcomes = this.outcomes.filter(outcome => !isNaN(outcome.levelOfProvision) && outcome.levelOfProvision !== 0);

      this.chartData.datasets[0].data = this.outcomes.map(outcome => outcome.levelOfProvision);
      this.chartData.datasets[1].data = this.outcomes.map(outcome => outcome.score);
      this.chartData.datasets[2].data = this.outcomes.map(outcome => outcome.assessmentValue);

      console.log('Dataset 0:', this.chartData.datasets[0].data);
      console.log('Dataset 1:', this.chartData.datasets[1].data);
      console.log('Dataset 2:', this.chartData.datasets[2].data);

      this.loaded = true;
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  }
};
</script>
