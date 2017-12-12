const Exchange = require('./Exchange')
const ws = require('ws')
const request = require('request')
const Bitfinex = require('bitfinex-api-node')

const TETHER = process.argv[2] || 'BTC'

const bitfinex_socket = new Bitfinex(process.env.BITFINEX_API_KEY, process.env.BITFINEX_API_SECRET, {
    version: 2,
    transform: true
}).ws

const bitfinexExchange = new Exchange('bitfinex', 0.002)

bitfinex_socket.on('open', () => {
    // authenticate
    bitfinex_socket.auth()

    //subscribe to tickers
    request.get('https://api.bitfinex.com/v1/symbols', {
        json: true
    }, (error, response, body) => {
        for (let pair of body) {
            // if (pair.endsWith('usd')) {
            if (pair.endsWith(TETHER.toLowerCase())) {
                bitfinex_socket.subscribeTicker(pair)
            }
        }
    })
})

bitfinex_socket.on('auth', () => {
    console.log('[BITFINEX] authenticated')
})

bitfinex_socket.on('ticker', (pair, ticker) => {
    let groups = pair.match(new RegExp(`t(\\w{3,})(?:${TETHER})`))
    if (groups && groups.length > 1) {
        let symbol = groups[1]
        bitfinexExchange.setPrice(symbol, ticker.LAST_PRICE)
    }
})

exports.exchange = bitfinexExchange