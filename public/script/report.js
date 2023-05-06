
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
    const data = await response.json()
    const lightReport = new Report(1, data)
    const tempReport = new Report(2, data)
    const humidReport = new Report(3, data)
    const res = [lightReport.generate_report(), tempReport.generate_report(), humidReport.generate_report()]
    alert(JSON.stringify(res))
})