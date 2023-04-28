import { httpRequest, url } from '../utils.js'

class Report {
    constructor(op, data) {
        this.op = op
        this.data = data
    }

    generate_report() {
        const body = {}
        body.data = this.data.filter(o => o['type'] == this.op)
        const arr = body.data.map(o => o['record'])
        body.mean = this.mean(arr)
        body.variance = Math.round(this.variance(arr) * 100) / 100
        body.standard_deviation = Math.round(this.standard_deviation(body.variance) * 100) / 100
        body.min = this.min(arr)
        body.max = this.max(arr)
        body.median = this.median(arr)
        return(body)
    }

    mean(arr) {
        return arr.reduce((acc, cur) => acc + cur, 0) / arr.length
    }
    
    variance(arr) {
        const avg = this.mean(arr)
        const squareDiff = arr.map(val => {
            const diff = val - avg
            return diff * diff
        })
        const variance = this.mean(squareDiff)
        return variance
    }

    standard_deviation(variance) {
        return Math.sqrt(variance)
    }

    median(arr) {
        const sorted = arr.sort()
        return sorted[Math.floor(sorted.length / 2) - 1]
    }

    max(arr) {
        return arr.reduce((prev, cur) => cur > prev ? cur : prev)
    }

    min(arr) {
        return arr.reduce((prev, cur) => cur < prev ? cur : prev)
    }
}

export { Report }