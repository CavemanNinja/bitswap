const EventEmitter = require('events').EventEmitter

module.exports = class Exchange extends EventEmitter {

    constructor(name, fee) {
        super()
        this._name = name
        this._fee = fee
        this.prices = new Map()
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }
    get fee() {
        return this._fee
    }

    set fee(value) {
        this._fee = value
    }

    getPrice(symbol) {
        return this.prices.get(symbol)
    }

    setPrice(symbol, price) {
        //TODO set timestamp
        this.prices.set(symbol, price)
        // this.sayPrice(symbol)
        this.emit('price_change', symbol)
    }

    sayPrice(symbol) {
        console.log(`[${this.name.toUpperCase()}] [${symbol}] ${this.prices.get(symbol)}`)
    }
}