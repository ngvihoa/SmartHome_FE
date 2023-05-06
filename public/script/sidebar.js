import { cookieToJSON } from "./utils.js";

let btn = document.querySelector('#menu-btn');
let sidebar = document.querySelector('.sidebar');

btn.onclick = ()=>{
    sidebar.classList.toggle('active');
}

if (sessionStorage.username === undefined)
    sessionStorage.username = JSON.parse(atob(cookieToJSON(document.cookie).cookie.split('.')[1])).userEmail.split('@')[0]

document.getElementById('user_email').innerText = sessionStorage.username