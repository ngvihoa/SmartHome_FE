// let a = Date();
// console.log(a);
import { Report } from './class/report.js'
import { url } from './utils.js'

let listLi = document.querySelectorAll('.report-topic > ul li');

listLi.forEach((e)=>{
    e.addEventListener("click", ()=>{
        listLi.forEach((i)=>{
            i.classList.remove('aim');
        }, 100);
        e.classList.add('aim');
    })
}, 100);

document.getElementById('gen-report-req').addEventListener("submit", async e => {
    e.preventDefault()
    const response = await fetch(`${url}/get/data`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ "jwt": localStorage.token })
    })
    if(response.status === 200) {
        const res = await response.json()

        const startDate = Date.parse(document.getElementById('start-date').value)
        const endDate = Date.parse(document.getElementById('end-date').value) + 86399 * 1000
        const data = res.filter(ele => startDate <= Date.parse(ele['dateCreate']) && Date.parse(ele['dateCreate']) <= endDate)
        
        console.log(startDate)
        console.log(endDate)
        console.log(data)
        const lightReport = new Report(1, data)
        const tempReport = new Report(2, data)
        const humidReport = new Report(3, data)
        const rep = [lightReport.generate_report(), tempReport.generate_report(), humidReport.generate_report()]
        const summary = rep.map(ele => {
            return {
                'type': ele['type'],
                'mean': ele['mean'],
                'variance': ele['variance'],
                'standard_deviation': ele['standard_deviation'],
                'min': ele['min'],
                'max': ele['max'],
                'median': ele['median']
            }
        })

        const generateCSV = (data) => {
            let res = 'dateCreate,record\n'
            for(const entry of data) {
                res += entry['dateCreate'] + ',' + entry['record'] + '\n'
            }
            return res
        }

        const mountToDOM = (op, dataUrl, sumUrl) => {
            const row = document.getElementById('download-table').querySelector('tbody')
            const now = new Date()
            const date = now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear()
            const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
            let innerHtml = `<tr>
                <td>${op === 0 ? 'Overall' : op === 1 ? 'Light' : op === 2 ? 'Temperature' : 'Humidity'} Report - ${date} ${time}</td>
            `
            if(op > 0) {
                innerHtml += `<td>
                        <a href = '${dataUrl}' target='_blank' download='${op === 1 ? 'light' : op === 2 ? 'temp' : 'humid'}data'><button>Data</button></a>
                        <a href = '${sumUrl}' target='_blank' download='${op === 1 ? 'light' : op === 2 ? 'temp' : 'humid'}summary'><button>Summary</button></a>
                    </td>
                </tr>`
            } else {
                innerHtml += `<td>
                        <a href = '${sumUrl}' target='_blank' download='ovrsummary'><button>Summary</button></a>
                    </td>
                </tr>`
            }
            row.innerHTML += innerHtml
        }
        
        if(document.getElementById('op-sum-rep').classList.contains('aim')) {
            const sumUrl = URL.createObjectURL(new Blob(summary.map(ele => JSON.stringify(ele)), {type: 'application/json'}))
            mountToDOM(0, '', sumUrl)
        }
        else if(document.getElementById('op-light-rep').classList.contains('aim')) {
            const dataUrl = URL.createObjectURL(new Blob([generateCSV(rep[0]['data'])], {type: 'text/csv'}))
            const sumUrl = URL.createObjectURL(new Blob([JSON.stringify(summary[0])], {type: 'application/json'}))
            mountToDOM(1, dataUrl, sumUrl)
        }
        else if(document.getElementById('op-temp-rep').classList.contains('aim')) {
            const dataUrl = URL.createObjectURL(new Blob([generateCSV(rep[1]['data'])], {type: 'text/csv'}))
            const sumUrl = URL.createObjectURL(new Blob([JSON.stringify(summary[1])], {type: 'application/json'}))
            mountToDOM(2, dataUrl, sumUrl)
        }
        else if(document.getElementById('op-humid-rep').classList.contains('aim')) {
            const dataUrl = URL.createObjectURL(new Blob([generateCSV(rep[2]['data'])], {type: 'text/csv'}))
            const sumUrl = URL.createObjectURL(new Blob([JSON.stringify(summary[2])], {type: 'application/json'}))
            mountToDOM(3, dataUrl, sumUrl)
        }

        alert("Report generated")
    }
})