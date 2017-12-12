const Exchange = require('./Exchange.js')
const Poloniex = require('poloniex-api-node')
const poloniex = new Poloniex(process.env.POLONIEX_API_KEY, process.env.POLONIEX_API_SECRET)

const poloniexExchange = new Exchange('poloniex')

poloniex.on('message', (channelName, data, seq) => {
    if (data.currencyPair.slice(0, 4) === 'USDT') {
        let symbol = data.currencyPair.slice(5)
        poloniexExchange.setPrice(symbol, data.last)
    }
})

poloniex.on('open', () => {
    console.log('Poloniex WebSocket connection open')
    poloniex.subscribe('ticker')
})

poloniex.on('close', (reason, details) => {
    console.log('Poloniex WebSocket connection disconnected ' + reason)
})

poloniex.on('error', (error) => {
    console.log('An error has occured')
})

poloniex.openWebSocket({
    version: 2
})

exports.exchange = poloniexExchange