import { httpRequest, url } from '../utils'

class Setting {
    constructor(el, ws) {
        this.el = el
        this.ws = ws
        httpRequest("POST", `${url}/get/setting`, { 'jwt': localStorage.token }, function() {
            if (this.status == 200) {
                const res = JSON.parse(xhr.response)
                let light = []
                let fan = []
                let humid = []
                for (let i in res) {
                    if (res[i]['type'] == 1) light = [res[i]['record'], res[i]['automod'], res[i]['onTime'], res[i]['offTime']]
                    else if (res[i]['type'] == 2) fan = [res[i]['record'], res[i]['automod'], res[i]['onTime'], res[i]['offTime']]
                    else if (res[i]['type'] == 3) humid = [res[i]['record'], res[i]['automod'], res[i]['onTime'], res[i]['offTime']]
                }
                this.initValue('light-setting', light)
                this.initValue('fan-setting', fan)
                this.initValue('humidity-setting', humid)
            }
        })
        this.el.getElementsByTagName('form').addEventListener('submit', this.handleFormSubmit)
    }

    initValue(id, initData) {
        const form = this.el.getElementById(id)
        const formElement = Array.from(form)
        for (let i = 1; i < formElement.length; i++) {
            if (i != 2) formElement[i].value = initData[i]
            else formElement[i].checked = initData[i] > 0; 
        }
    }

    handleFormSubmit(e) {
        e.preventDefault()
        const form = e.target
        const formElement = Array.from(form)
        const body = {
            'deviceId': form.id == 'light-setting' ? localStorage.lightId : form.id == 'fan-setting' ? localStorage.fanId : localStorage.humidId,
            'record': formElement[1].value,
            'automod': formElement[2].checked,
            'onTime': formElement[3].value,
            'offTime': formElement[4].value
        }
        httpRequest("POST", `${url}/write/setting`, body, function() {
            if (this.status == 200) console.log("Success")
            else console.log("Failed")
        })
        this.ws.send(JSON.stringify(body))
    }
}

export { Setting }