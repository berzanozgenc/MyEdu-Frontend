<template>
    <div>
      <Bar :data="chartDataWithColors" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    name: 'BarChartThree',
    components: {
        Bar
    },
    props: {
      chartData: {
        type: Object,
        required: true,
      },
    },
    computed: {
      chartOptions() {
        return {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItem) => this.chartData.datasets[tooltipItem[0].datasetIndex].label,
                label: (tooltipItem) => {
                  const dataset = this.chartData.datasets[tooltipItem.datasetIndex];
                  const dataPoint = dataset.data[tooltipItem.dataIndex];
                  return `${dataset.label}: %${dataPoint}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        };
      },
      chartDataWithColors() {
        // Her dataset için rastgele renkler oluştur
        const datasetsWithColors = this.chartData.datasets.map((dataset) => {
          const color = this.getRandomColor();
          return {
            ...dataset,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
          };
        });
  
        return {
          ...this.chartData,
          datasets: datasetsWithColors,
        };
      },
    },
    methods: {
      getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },
    },
  };
  </script>
  