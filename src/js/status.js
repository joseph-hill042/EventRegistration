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
        this.loadProfession();
        this.loadAge();
      })
      .catch(() => {
        this.$loadingIndicator.classList.add('hidden');
        this.$errorMessage.classList.remove('hidden');
      });
  }

  processData(data) {
    let filteredData = [];
    for (let entry in data) if(data.hasOwnProperty(entry)) filteredData.push(data[entry]);
    return filteredData;
  }

  filterByExp(data) {
    let beginner = 0, intermediate = 0, advanced = 0;
    data.forEach((entry) => {
      switch (entry.experience) {
        case 1:
          beginner += 1;
          break;
        case 2:
          intermediate += 1;
          break;
        case 3:
          advanced += 1;
          break;
        default:
      }
    });
    return [beginner, intermediate, advanced];
  }

  loadExperience() {
    const data = {
      datasets: [{
        data: this.filterByExp(this.statisticData),
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

  filterbyProf(data) {
    let schoolStudent = 0, collegeStudent = 0, trainee = 0, employee = 0;
    data.forEach((entry) => {
      switch (entry.profession) {
        case 'school':
          schoolStudent += 1;
          break;
        case 'college':
          collegeStudent += 1;
          break;
        case 'trainee':
          trainee += 1;
          break;
        case 'employee':
          employee += 1;
          break;
        default:
      }
    });
    return [schoolStudent, collegeStudent, trainee, employee];
  }

  loadProfession() {
    const data = {
      datasets: [{
        data: this.filterbyProf(this.statisticData),
        backgroundColor:[
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'white',
          'white',
          'white',
          'white',
        ]
      }],
      labels: [
        'School Students',
        'College Students',
        'Trainees',
        'Employees'
      ]
    };
    new Chart(this.$professionCanvas,{
      type: 'pie',
      data,
    });
  }

  filterByAge(data) {
    let tenToFifteen = 0, fifteenToTwenty = 0, twentyToTwentyFive = 0;
    data.forEach((entry) => {
      switch (true) {
        case (entry.age > 9 && entry.age < 16):
          tenToFifteen += 1;
          break;
        case (entry.age > 14 && entry.age < 21):
          fifteenToTwenty += 1;
          break;
        case (entry.age >= 21):
          twentyToTwentyFive += 1;
          break;
        default:
      }
    });
    return [tenToFifteen, fifteenToTwenty, twentyToTwentyFive];
  }

  loadAge() {
    const data = {
      datasets: [{
        data: this.filterByAge(this.statisticData),
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
        '10-15 years',
        '15-20 years',
        '20-25 years'
      ]
    };
    new Chart(this.$ageCanvas,{
      type: 'pie',
      data,
    });
  }
}

window.addEventListener('load', () => {
  new Status();
});
