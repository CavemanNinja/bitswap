require('dotenv').config()

const exchanges = new Set
const symbols = new Map


exchanges.add(require('./Exchanges/bitfinex').exchange)
exchanges.add(require('./Exchanges/poloniex').exchange)

for (let exchange of exchanges) {
    exchange.on('price_change', (symbol) => {
        addSymbol(symbol, exchange)
    })
}

function addSymbol(symbol, exchange) {
    //add a new symbol
    if (!symbols.has(symbol)) {
        symbols.set(symbol, {
            high: null,
            low: null
        })
    }

    if (symbols.get(symbol).high === null ||
        exchange.getPrice(symbol) > symbols.get(symbol).high.getPrice(symbol)) {
        symbols.get(symbol).high = exchange
    }

    if (symbols.get(symbol).low === null ||
        exchange.getPrice(symbol) < symbols.get(symbol).low.getPrice(symbol)) {
        symbols.get(symbol).low = exchange
    }

    if (symbols.get(symbol).high !== null &&
        symbols.get(symbol).low !== null &&
        symbols.get(symbol).high.name !== symbols.get(symbol).low.name) {
        calcOpportunity(symbol)
    }

    // console.log(`addSymbol() ${symbol} ${exchange}`)
    // console.log(symbols.get(symbol))
    // console.log(`addSymbol() [${symbol}] high: ${symbols.get(symbol).high.name} ${symbols.get(symbol).high.getPrice(symbol)}, low: ${symbols.get(symbol).low.name} ${symbols.get(symbol).low.getPrice(symbol)}`)

}

function calcOpportunity(symbol) {
    // console.log(`calcOpportunitty() [${symbol}] high: ${symbols.get(symbol).high.name} ${symbols.get(symbol).high.getPrice(symbol)}, low: ${symbols.get(symbol).low.name} ${symbols.get(symbol).low.getPrice(symbol)}`)

}