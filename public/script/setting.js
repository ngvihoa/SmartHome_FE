import { Setting } from './class/setting.js'

const webSocket = new WebSocket("")
webSocket.onopen = (e) => {
  console.log(e)
}

const settingPage = new Setting(document.getElementById('main-content'), webSocket)