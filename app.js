require('dotenv').config()
const colors = require('colors')

const exchanges = new Set
const pairs = new Map

const FILTER = process.argv[2]

console.log(`bitswap started, filter currency ${FILTER}`)

//TODO need to upgrade to keep track of pairs instad of pair...

exchanges.add(require('./Exchanges/bitfinex').exchange)
exchanges.add(require('./Exchanges/poloniex').exchange)

for (let exchange of exchanges) {
    exchange.on('price_change', (pair) => {
        addpair(pair, exchange)
    })
}

function addpair(pair, exchange) {
    //add a new pair
    if (!pairs.has(pair)) {
        pairs.set(pair, {
            high: null,
            low: null
        })
    }

    let oldHigh = pairs.get(pair).high
    let oldLow = pairs.get(pair).low

    if (pairs.get(pair).high === null ||
        exchange.getPrice(pair) > pairs.get(pair).high.getPrice(pair)) {
        pairs.get(pair).high = exchange
    }

    if (pairs.get(pair).low === null ||
        exchange.getPrice(pair) < pairs.get(pair).low.getPrice(pair)) {
        pairs.get(pair).low = exchange
    }

    if (pairs.get(pair).high !== null &&
        pairs.get(pair).low !== null &&
        pairs.get(pair).high.name !== pairs.get(pair).low.name) {
        calcOpportunity(pair)
    }

    if (oldHigh !== null && oldLow !== null && pairs.get(pair).high !== null && pairs.get(pair).low !== null &&
        oldHigh !== pairs.get(pair).high && oldLow !== pairs.get(pair).low
    ) {
        console.log(colors.cyan(`[MARKETS SWITCHED] ${pair}`))
    }


    // console.log(`addpair() ${pair} ${exchange}`)
    // console.log(pairs.get(pair))

}

function calcOpportunity(pair) {

    // x ammount of BTC used to buy ether
    let x = 0.08
    // y ammount of ETH bought
    let y
    // p price in BTC at the low wxchange
    let p = pairs.get(pair).low.getPrice(pair)
    // q price in BTC at the high wxchange
    let q = pairs.get(pair).high.getPrice(pair)
    // f fee at low exchange
    let f = pairs.get(pair).low.fee
    // g fee at high exchange
    let g = pairs.get(pair).high.fee

    // o opportunity (amount of btc gained)
    let o = x * ((q / p) * (1 - f) * (1 - g) - 1)

    let diff = ((pairs.get(pair).high.getPrice(pair) / pairs.get(pair).low.getPrice(pair) - 1) * 100).toFixed(3)

    let output

    if (FILTER && pair === FILTER || !FILTER) {
        //TODO Improve logging
        if (pair === 'BTC') {
            output = colors.yellow(`calcOpportunitty() [${pair}] high: ${pairs.get(pair).high.name} ${pairs.get(pair).high.getPrice(pair)}, ` +
                `low: ${pairs.get(pair).low.name} ${pairs.get(pair).low.getPrice(pair)}, [${diff}%]`)
        } else if (pair === 'ETH') {
            output = colors.magenta(`calcOpportunitty() [${pair}] high: ${pairs.get(pair).high.name} ${pairs.get(pair).high.getPrice(pair)}, ` +
                `low: ${pairs.get(pair).low.name} ${pairs.get(pair).low.getPrice(pair)}, [${diff}%]`)
        } else {
            output = `calcOpportunitty() [${pair}] high: ${pairs.get(pair).high.name} ${pairs.get(pair).high.getPrice(pair)}, ` +
                `low: ${pairs.get(pair).low.name} ${pairs.get(pair).low.getPrice(pair)}, [${diff}%]`
        }

        if (o > 0) {
            output += colors.green(` [${o}]`)
        } else {
            output += colors.red(` [${o}]`)
        }

        console.log(output)
    }



}