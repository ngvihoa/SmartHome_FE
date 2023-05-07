import { Setting } from './class/setting.js'

const user_email = document.getElementById('user_email');

user_email.innerText = sessionStorage.getItem('user_name');

const settingPage = new Setting(document.getElementById('main-content'))