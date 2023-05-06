import { Subject, Observer } from './class.js'

class Current extends Subject {
    constructor(id, type) {
        super()
        this.current = 0
        this.deviceStatus = 0
    }
    
    setCurrentStatus(current, deviceStatus) {
        this.current = current
        this.deviceStatus = deviceStatus
        this.notify()
    }
}

class Data extends Subject {
    constructor() {
        super()
        this.data = []
    }

    setData(data) {
        this.data = data
        this.notify()
    }
}

class Display extends Observer {
    constructor(el) {
        this.el = el
    }
    
    update(subject) {
        if (subject instanceof Current) {
            this.el.querySelector('div > div > div > span.num').innerText = subject.current.toString()
            const stateDisplay = this.el.querySelector('div.stat')
            if (subject.deviceStatus > 0) {
                stateDisplay.classList.replace('stat_off', 'stat_on')
                stateDisplay.querySelector('i').classList.replace('bxs-minus-circle', 'bxs-check-circle')
                stateDisplay.querySelector('span').innerText = 'ON'
            }
            else {
                stateDisplay.classList.replace('stat_on', 'stat_off')
                stateDisplay.querySelector('i').classList.replace('bxs-check-circle', 'bxs-minus-circle')
                stateDisplay.querySelector('span').innerText = 'OFF'
            }
        }
        // else if (subject instanceof Data)
        //     this.el.querySelector('div > canvas') = 
    }
}

export { Current, Data, Display }