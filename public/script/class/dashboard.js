import { Subject, Observer } from './class.js'

class Current extends Subject {
    constructor() {
        super()
        this.current = 0
        this.deviceStatus = 0
    }
    
    setCurrentStatus(deviceStatus) {
        this.deviceStatus = deviceStatus
        this.notify()
    }

    setCurrent(current) {
        this.current = current
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
        // console.log(this.data)
        this.notify()
    }
}

class Display extends Observer {
    constructor(el) {
        super();
        this.el = el
    }
    
    update(subject) {
        if (subject instanceof Current) {
            this.el.querySelector('div > div > div > span.num').innerText = subject.current.toString()
            const stateDisplay = this.el.querySelector('div.stat')
            if (subject.deviceStatus > 0) {
                stateDisplay.classList.replace('stat_off', 'stat_on')
                stateDisplay.querySelector('i').classList.replace('bxs-minus-circle', 'bxs-check-circle')
                stateDisplay.querySelector('span').innerText = subject.deviceStatus.toString() + '%'
            }
            else {
                stateDisplay.classList.replace('stat_on', 'stat_off')
                stateDisplay.querySelector('i').classList.replace('bxs-check-circle', 'bxs-minus-circle')
                stateDisplay.querySelector('span').innerText = '0%'
            }
        }
        else if (subject instanceof Data) {
            const canva = this.el.querySelector('div > canvas')
            new Chart(canva, {
                type: 'line',
                data: {
                  labels: subject.data.map(ele => ele['dateCreate'].split('T')[1].split('Z')[0]),
                  datasets: [{
                    label: 'Statistics',
                    data: subject.data.map(ele => ele['record']),
                    borderWidth: 1,
                    borderColor: '#ffaf36'
                  }]
                }
            });
        }
    }
}

export { Current, Data, Display }