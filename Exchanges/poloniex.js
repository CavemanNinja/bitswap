const Exchange = require('./Exchange')
const Poloniex = require('poloniex-api-node')
const poloniex = new Poloniex(process.env.POLONIEX_API_KEY, process.env.POLONIEX_API_SECRET)

let tether = process.argv[2] || 'BTC'
const TETHER = (tether === 'USD') ? 'USDT' : tether

const poloniexExchange = new Exchange('poloniex', 0.0025)

poloniex.on('message', (channelName, data, seq) => {
    if (data.currencyPair.slice(0, TETHER.length) === TETHER) {
        let symbol = data.currencyPair.slice(TETHER.length + 1)
        poloniexExchange.setPrice(symbol, data.last)
    }
})

poloniex.on('open', () => {
    console.log('[POLONIEX] connected')
    poloniex.subscribe('ticker')
})

poloniex.on('close', (reason, details) => {
    console.log('Poloniex WebSocket connection disconnected ' + JSON.stringify(reason))
    poloniex.openWebSocket({
        version: 2
    })
})

poloniex.on('error', (error) => {
    console.log('An error has occured')
})

poloniex.openWebSocket({
    version: 2
})

exports.exchange = poloniexExchange