const obss = document.querySelectorAll(".obs");

const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        entry.target.classList.toggle('dfly', entry.isIntersecting)
    })
})

obss.forEach(obs=>{

    observer.observe(obs)
})

//-----------------------------------------

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

// const ctx1 = document.getElementById('fanChart');

// new Chart(ctx1, {
// type: 'line',
// data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//     label: '# of Votes',
//     data: [12, 19, 3, 5, 2, 3],
//     borderWidth: 1,
//     borderColor: '#ff4943'
//     }]
// },
// options: {
//     scales: {
//     y: {
//         beginAtZero: true
//     }
//     }
// }
// });

// const ctx2 = document.getElementById('humidityChart');

// new Chart(ctx2, {
// type: 'line',
// data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//     label: '# of Votes',
//     data: [12, 19, 3, 5, 2, 3],
//     borderWidth: 1,
//     borderColor: '#4378ff'
//     }]
// },
// options: {
//     scales: {
//     y: {
//         beginAtZero: true
//     }
//     }
// }
// });

import { Current, Data, Display } from './class/dashboard.js'
import { httpRequest, url } from './utils.js'

const webSocket = new WebSocket("")
webSocket.onopen = (e) => {
  console.log(e)
}

const light = new Current()
const temp = new Current()
const humid = new Current()

// httpRequest("POST", `${url}/get/device`, { "jwt": localStorage.token }, function() {
//   if (this.status == 200) {
//     const res = JSON.parse(xhr.response)
//     res.forEach(o => {
//       if (o['type'] == 1) localStorage.lightId = o['deviceId']
//       else if (o['type'] == 2) localStorage.fanId = o['deviceId']
//       else if (o['type'] == 3) localStorage.humidId = o['deviceId']
//     })
//   }
// })

webSocket.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  for (let i = 0; i < msg.length; i++) {
    if (msg[i]['type'] == 'light') light.setCurrentStatus(msg[i]['intensity'], msg[i]['deviceStatus'])
    else if (msg[i]['type'] == 'temperature') temp.setCurrentStatus(msg[i]['temperature'], msg[i]['deviceStatus'])
    else if (msg[i]['type'] == 'humidity') humid.setCurrentStatus(msg[i]['humidity'], msg[i]['deviceStatus'])
  }
}

const lightData = new Data()
const tempData = new Data()
const humidData = new Data()

// httpRequest("POST", `${url}/get/record`, { "jwt": localStorage.token }, function() {
//   if (this.status == 200) {
//     const res = JSON.parse(xhr.response)
//     const light = res.filter(o => { return o['intensity'] != null }).map(o =>  { o['dateCreate'], o['intensity'] })
//     const temp = res.filter(o => { return o['temperature'] != null }).map(o =>  { o['dateCreate'], o['temperature'] })
//     const humid = res.filter(o => { return o['humidity'] != null }).map(o =>  { o['dateCreate'], o['humidity'] })
//     lightData.setData(light)
//     tempData.setData(temp)
//     humidData.setData(humid)
//   }
// })

const lightDashboard = new Display(document.getElementsByClassName('light_content')[0])
light.attach(lightDashboard)
lightData.attach(lightDashboard)

const tempDashboard = new Display(document.getElementsByClassName('fan_content')[0])
temp.attach(tempDashboard)
tempData.attach(tempDashboard)

const humidDashboard = new Display(document.getElementsByClassName('humidity_content')[0])
humid.attach(humidDashboard)
humidData.attach(humidDashboard)

const lightForm = document.querySelector('.light_controller > form')
const fanForm = document.querySelector('.fan_controller > form')
const humidForm = document.querySelector('.humidity_controller > form')

lightForm.addEventListener('submit', handleSubmitStateChange(e, localStorage.lightId))
fanForm.addEventListener('submit', handleSubmitStateChange(e, localStorage.fanId))
humidForm.addEventListener('submit', handleSubmitStateChange(e, localStorage.humidId))

function handleSubmitStateChange(e, deviceId) {
	e.preventDefault()
	const val = e.target.querySelector("input[type='text']").value
	webSocket.send(JSON.stringify({ deviceId, deviceStatus: val }))
}