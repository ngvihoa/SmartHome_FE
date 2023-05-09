// let a = Date();
// console.log(a);
import { Report } from './class/report.js'

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
    const response = await fetch(`${url}/get/record`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-type": "application/json"
        },
        body: { "jwt": localStorage.token }
    })
    if(response.status === 200) {
        const res = await response.json()

        const startDate = Date.parse(document.getElementById('start-date'))
        const endDate = Date.parse(document.getElementById('end-date'))
        data = res.filter(ele => startDate <= Date.parse(ele['dateCreate']) && Date.parse(ele['dateCreate']) <= endDate)
        
        const lightReport = new Report(1, data)
        const tempReport = new Report(2, data)
        const humidReport = new Report(3, data)
        const rep = [lightReport.generate_report(), tempReport.generate_report(), humidReport.generate_report()]
        
        if(document.getElementById('op-sum-rep').classList.includes('aim')) alert(JSON.stringify(rep))
        else if(document.getElementById('op-light-rep').classList.includes('aim')) alert(JSON.stringify(rep[0]))
        else if(document.getElementById('op-temp-rep').classList.includes('aim')) alert(JSON.stringify(rep[1]))
        else if(document.getElementById('op-humid-rep').classList.includes('aim')) alert(JSON.stringify(rep[2]))
    }
})