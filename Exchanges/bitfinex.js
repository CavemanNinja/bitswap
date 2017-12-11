const ws = require('ws')
const Bitfinex = require('bitfinex-api-node')

const bitfinex_socket = new Bitfinex(process.env.BITFINEX_API_KEY, process.env.BITFINEX_API_SECRET, {
    version: 2,
    transform: true
}).ws

const prices = new Map()

bitfinex_socket.on('open', () => {
    // authenticate
    bitfinex_socket.auth()

    //subscribe to tickers
    bitfinex_socket.subscribeTicker('BTCUSD')
    bitfinex_socket.subscribeTicker('ETHUSD')
})

bitfinex_socket.on('auth', () => {
    console.log('[BITFINEX] authenticated')
})

bitfinex_socket.on('ticker', (pair, ticker) => {
    let symbol = pair.slice(1, 4)
    prices.set(symbol, ticker.LAST_PRICE)
    console.log(`[BITFINEX] [${symbol}] $${prices.get(symbol)}`)
})

exports.getPrice = (symbol) => {
    return prices.get(symbol)
}