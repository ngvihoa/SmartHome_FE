import { url } from '../utils.js'

class Setting {
    constructor(el) {
        this.el = el
        fetch(`${url}/get/setting`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ 
                'jwt': localStorage.token, 
            })
        }).then(async response => {
            if (response.status == 200) {
                const res = await response.json();
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
        });
        const forms = this.el.getElementsByTagName('form');
        for (const form of forms)
            form.addEventListener('submit', this.handleFormSubmit);
        //this.el.getElementsByTagName('form').forEach((form) => form.addEventListener('submit', this.handleFormSubmit));
    }

    initValue(id, initData) {
        const form = document.getElementById(id)
        const formElement = Array.from(form)
        for (let i = 1; i < formElement.length; i++) {
            if (i != 2) formElement[i].value = initData[i-1]
            else formElement[i].checked = false; 
        }
    }

    handleFormSubmit(e) {
        
        e.preventDefault()
        const form = e.target
        const formElement = Array.from(form)
        const body = {
            'dateCreate': (new Date(Date.now())).toISOString(),
            'deviceID': form.id == 'light-setting' ? localStorage.lightId : form.id == 'fan-setting' ? localStorage.fanId : localStorage.humidId,
            'record': formElement[1].value,
            'automod': formElement[2].checked,
            'onTime': formElement[3].value,
            'offTime': formElement[4].value
        }
        fetch(`${url}/write/setting`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ 
                'jwt': localStorage.token, 
                ...body
            })
        }).then(response => {
            if(response.status === 200) alert("Setting successfully")
        })
        //this.ws.send(JSON.stringify(body))
    }
}

export { Setting }