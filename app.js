require('dotenv').config()
const colors = require('colors')

const exchanges = new Set
const symbols = new Map

const TETHER = process.argv[2] || 'BTC'

console.log(`bitswap started, tether currency ${TETHER}`)

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

    let oldHigh = symbols.get(symbol).high
    let oldLow = symbols.get(symbol).low

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

    if (oldHigh !== null && oldLow !== null && symbols.get(symbol).high !== null && symbols.get(symbol).low !== null &&
        oldHigh !== symbols.get(symbol).high && oldLow !== symbols.get(symbol).low
    ) {
        console.log(colors.cyan(`[MARKETS SWITCHED] ${symbol}`))
    }


    // console.log(`addSymbol() ${symbol} ${exchange}`)
    // console.log(symbols.get(symbol))

}

function calcOpportunity(symbol) {

    // x ammount of BTC used to buy ether
    let x = 0.08
    // y ammount of ETH bought
    let y
    // p price in BTC at the low wxchange
    let p = symbols.get(symbol).low.getPrice(symbol)
    // q price in BTC at the high wxchange
    let q = symbols.get(symbol).high.getPrice(symbol)
    // f fee at low exchange
    let f = symbols.get(symbol).low.fee
    // g fee at high exchange
    let g = symbols.get(symbol).high.fee

    // o opportunity (amount of btc gained)
    let o = x * ((q / p) * (1 - f) * (1 - g) - 1)

    let diff = ((symbols.get(symbol).high.getPrice(symbol) / symbols.get(symbol).low.getPrice(symbol) - 1) * 100).toFixed(3)

    let output

    if (process.argv[3] && symbol === process.argv[3] || !process.argv[3]) {
        //TODO Improve logging
        if (symbol === 'BTC') {
            output = colors.yellow(`calcOpportunitty() [${symbol}] high: ${symbols.get(symbol).high.name} ${symbols.get(symbol).high.getPrice(symbol)}, ` +
                `low: ${symbols.get(symbol).low.name} ${symbols.get(symbol).low.getPrice(symbol)}, [${diff}%]`)
        } else if (symbol === 'ETH') {
            output = colors.magenta(`calcOpportunitty() [${symbol}] high: ${symbols.get(symbol).high.name} ${symbols.get(symbol).high.getPrice(symbol)}, ` +
                `low: ${symbols.get(symbol).low.name} ${symbols.get(symbol).low.getPrice(symbol)}, [${diff}%]`)
        } else {
            output = `calcOpportunitty() [${symbol}] high: ${symbols.get(symbol).high.name} ${symbols.get(symbol).high.getPrice(symbol)}, ` +
                `low: ${symbols.get(symbol).low.name} ${symbols.get(symbol).low.getPrice(symbol)}, [${diff}%]`
        }

        if (o > 0) {
            output += colors.green(` [${o}]`)
        } else {
            output += colors.red(` [${o}]`)
        }

        console.log(output)
    }



}