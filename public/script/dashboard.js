import { Current, Data, Display } from './class/dashboard.js'
import { url, cookieToJSON } from './utils.js'

const obss = document.querySelectorAll(".obs");

const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        entry.target.classList.toggle('dfly', entry.isIntersecting)
    })
})

obss.forEach(obs=>{
    observer.observe(obs)
})

localStorage.token = cookieToJSON(document.cookie).cookie
//-----------------------------------------

const TYPE_LIGHT = 1;
const TYPE_TEMP = 2;
const TYPE_HUMID = 3;

// const ctx = document.getElementById('lightChart');

// new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1,
//       borderColor: '#ffaf36'
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });

const light = new Current()
const temp = new Current()
const humid = new Current()

const lightData = new Data()
const tempData = new Data()
const humidData = new Data()

await (async () => {
  const response = await fetch(`${url}/get/device`, {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-type": "application/json"
      },
      body: JSON.stringify({ "jwt": localStorage.token })
  })
  const res = await response.json()
  res.forEach(o => {
    if (o['type'] == 1) localStorage.lightId = o['id']
    else if (o['type'] == 2) localStorage.fanId = o['id']
    else if (o['type'] == 3) localStorage.humidId = o['id']

    document.getElementById('light_id').innerText = localStorage.lightId;
    document.getElementById('fan_id').innerText = localStorage.fanId;
    document.getElementById('humid_id').innerText = localStorage.humidId;
  })
})()

const getDeviceId = async () => {
  const response = await fetch(`${url}/get/data`, {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-type": "application/json"
      },
      body: JSON.stringify({ "jwt": localStorage.token })
  })
  if(response.status == 200) {
    const res = await response.json()
    const getData = (type) => {
      const arr = res.filter(o => { return o['type'] == type }).map(o => { return {'dateCreate': o['dateCreate'], 'record': o['record']} })
      return arr.slice(arr.length - 10, arr.length)
    }
    const lightRecord = getData(1)
    const tempRecord = getData(2)
    const humidRecord = getData(3)
    light.setCurrent(lightRecord[9]['record'])
    temp.setCurrent(tempRecord[9]['record'])
    humid.setCurrent(humidRecord[9]['record'])
    lightData.setData(lightRecord)
    tempData.setData(tempRecord)
    humidData.setData(humidRecord)
  }
  else {
    console.log('err')
  }
}

await getDeviceId()

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

lightForm.addEventListener('submit', handleSubmitStateChange)
fanForm.addEventListener('submit', handleSubmitStateChange)
humidForm.addEventListener('submit', handleSubmitStateChange)




async function handleSubmitStateChange(e) {
  console.log(e);

	e.preventDefault()
	const val = e.target.querySelector("input[type='text']").value

  const time = (new Date(Date.now())).toISOString();
  const deviceId = e.target.querySelector('p').innerText
  const json = JSON.stringify({ "jwt": localStorage.token, 'deviceID': deviceId, 'record': val, 'dateCreate': time });
  console.log(json);
	await fetch('http://localhost:8080/write/setting', {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-type": "application/json"
      },
      body: json
  })
  fetch(`${url}/write/setting`, {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-type": "application/json"
      },
      body: json
  }).then(response => {
    if(response.status === 200) {
      if(deviceId === localStorage.lightId) light.setCurrentStatus(val)
      else if(deviceId === localStorage.fanId) temp.setCurrentStatus(val)
      else if(deviceId === localStorage.humidId) humid.setCurrentStatus(val)
    }
  })
  
  // console.log(12)
}

// get current status of device
setInterval(() => { 
  fetch(`${url}/get/setting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'jwt': localStorage.token })
  }).then(async response => {
    if (response.status == 200) {
      const res = await response.json();
      for (let i in res) {
        if (res[i]['type'] == TYPE_LIGHT) light.setCurrentStatus(res[i]['record'])
        else if (res[i]['type'] == TYPE_TEMP) temp.setCurrentStatus(res[i]['record'])
        else if (res[i]['type'] == TYPE_HUMID) humid.setCurrentStatus(res[i]['record'])
      }
    }
  })
}, 30000)

// send http request to database to get current stat of sensor every 30s
setInterval(() => { 
  fetch(`${url}/get/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'jwt': localStorage.token })
  }). then(async response => {
    if(response.status === 200) {
      const res = await response.json()
      const lightRecord = res.filter(o => o['type'] === TYPE_LIGHT).map(o => { return { 'dateCreate': o['dateCreate'], 'record': o['record'] } })
      const tempRecord = res.filter(o => o['type'] === TYPE_TEMP).map(o => { return { 'dateCreate': o['dateCreate'], 'record': o['record'] } })
      const humidRecord = res.filter(o => o['type'] === TYPE_HUMID).map(o => { return { 'dateCreate': o['dateCreate'], 'record': o['record'] } })
      light.setCurrent(lightRecord[lightRecord.length - 1]['record'])
      temp.setCurrent(tempRecord[tempRecord.length - 1]['record'])
      humid.setCurrent(humidRecord[humidRecord.length - 1]['record'])
      lightData.setData(lightRecord.slice(lightRecord.length - 10, lightRecord.length))
      tempData.setData(tempRecord.slice(tempRecord.length - 10, tempRecord.length))
      humidData.setData(humidRecord.slice(humidRecord.length - 10, humidRecord.length))
    }
  }) 
}, 30000)
