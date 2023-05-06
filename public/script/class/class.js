class Subject  {
    constructor() {
        this.observers = []
    }
    attach(observer) {
        const isExist = this.observers.includes(observer)
        if (!isExist) {
            this.observers.push(observer)
            observer.update(this)
        }
    }

    detach(observer) {
        const observerIdx = this.observers.indexOf(observer);
        if (observerIdx !== -1) this.observers.splice(observerIdx, 1);
    }

    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

class Observer {
    update(subject) {}
}

export { Subject, Observer }