module.exports = class Exchange {

    constructor(name) {
        this._name = name
        this.prices = new Map()
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    getPrice(symbol) {
        return this.prices.get(symbol)
    }

    setPrice(symbol, price) {
        //TODO set freshness
        this.prices.set(symbol, price)
        this.sayPrice(symbol)
    }

    sayPrice(symbol) {
        console.log(`[${this.name.toUpperCase()}] [${symbol}] $${this.prices.get(symbol)}`)
    }
}