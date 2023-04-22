const ctx = document.getElementById('lightChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        borderColor: '#ffaf36'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

const ctx1 = document.getElementById('fanChart');

new Chart(ctx1, {
type: 'line',
data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1,
    borderColor: '#ff4943'
    }]
},
options: {
    scales: {
    y: {
        beginAtZero: true
    }
    }
}
});

const ctx2 = document.getElementById('humidityChart');

new Chart(ctx2, {
type: 'line',
data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1,
    borderColor: '#4378ff'
    }]
},
options: {
    scales: {
    y: {
        beginAtZero: true
    }
    }
}
});