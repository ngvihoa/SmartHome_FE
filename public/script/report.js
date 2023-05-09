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
        const endDate = Date.parse(document.getElementById('end-date').value)
        const data = res.filter(ele => startDate <= Date.parse(ele['dateCreate']) && Date.parse(ele['dateCreate']) <= endDate)
        
        console.log(startDate)
        console.log(endDate)
        console.log(data)
        const lightReport = new Report(1, data)
        const tempReport = new Report(2, data)
        const humidReport = new Report(3, data)
        const rep = [lightReport.generate_report(), tempReport.generate_report(), humidReport.generate_report()]
        const displayRep = rep.map(ele => {
            return {
                'mean': ele['mean'],
                'variance': ele['variance'],
                'standard_deviation': ele['standard_deviation'],
                'min': ele['min'],
                'max': ele['max'],
                'median': ele['median']
            }
        })
        
        if(document.getElementById('op-sum-rep').classList.contains('aim')) alert(JSON.stringify(rep))
        else if(document.getElementById('op-light-rep').classList.contains('aim')) alert(JSON.stringify(rep[0]))
        else if(document.getElementById('op-temp-rep').classList.contains('aim')) alert(JSON.stringify(rep[1]))
        else if(document.getElementById('op-humid-rep').classList.contains('aim')) alert(JSON.stringify(rep[2]))
    }
})