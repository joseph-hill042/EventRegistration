import './general';
import apiCall from "./services/api/apiCall";
import Chart from 'chart.js';

class Status {
  constructor() {
    this.$experienceTab = document.querySelector('#experienceTab');
    this.$professionTab = document.querySelector('#professionTab');
    this.$ageTab = document.querySelector('#ageTab');

    this.$ageCanvas = document.querySelector('#ageChart');
    this.$professionCanvas = document.querySelector('#professionChart');
    this.$experienceCanvas = document.querySelector('#experienceChart');

    this.$loadingIndicator = document.querySelector('#loadingIndicator');
    this.$tabArea = document.querySelector('#tabArea');
    this.$chartArea = document.querySelector('#chartArea');

    this.$errorMessage = document.querySelector('#loadingError');

    this.statisticData = []; // variable to store data from the server

    this.loadData();
  }

  loadData() {
    apiCall('registration')
      .then(res => {
        this.statisticData = this.processData(res);
        this.$loadingIndicator.classList.add('hidden');
        this.$tabArea.classList.remove('hidden');
        this.$chartArea.classList.remove('hidden');
        this.loadExperience();
      })
      .catch(() => {
        this.$loadingIndicator.classList.add('hidden');
        this.$errorMessage.classList.remove('hidden');
      });
  }

  processData(data) {
    let filteredData = [];
    for (let entry in data) if(data.hasOwnProperty(entry)) filteredData.push(data[entry]);
    console.log(filteredData);
    return filteredData;
  }

  loadExperience() {
    const data = {
      datasets: [{
        data: this.statisticData.map((entry) => {
          console.log(entry);
          return entry.experience;
        }),
        backgroundColor:[
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'white',
          'white',
          'white',
        ]
      }],
      labels: [
        'Beginner',
        'Intermediate',
        'Advanced'
      ]
    };
    new Chart(this.$experienceCanvas,{
      type: 'pie',
      data,
    });

    console.log(data.datasets);
  }
}

window.addEventListener('load', () => {
  new Status();
});
