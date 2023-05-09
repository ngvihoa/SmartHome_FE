import { Setting } from './class/setting.js'

const user_email = document.getElementById('user_email');

user_email.innerText = sessionStorage.getItem('user_name');

const settingPage = new Setting(document.getElementById('main-content'))

const automodbutton = document.querySelectorAll('input[type="checkbox"]')

automodbutton.forEach(e=>{
    e.addEventListener('click',a=>{
        let tmp = a.srcElement.checked;
        let intp = a.srcElement.parentNode.querySelectorAll('input[type="time"]');
        if(tmp){
            intp.forEach(s=>{
                s.disabled = false;
            })
        }
        else{
            intp.forEach(s=>{
                s.disabled = true;
            })
        }

    })
})