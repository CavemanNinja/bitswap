const ws = require('ws')
const Bitfinex = require('bitfinex-api-node')

const bitfinex_socket = new Bitfinex(process.env.BITFINEX_API_KEY, process.env.BITFINEX_API_SECRET, {
    version: 2,
    transform: true
}).ws

let bitfinex_BTC, bitfinex_ETH

bitfinex_socket.on('auth', () => {
    // emitted after .auth()
    // needed for private api endpoints

    console.log('authenticated')
    // bws.submitOrder ...
})

bitfinex_socket.on('open', () => {
    bitfinex_socket.subscribeTicker('BTCUSD')
    bitfinex_socket.subscribeTicker('ETHUSD')

    // authenticate
    // bws.auth()
})

bitfinex_socket.on('ticker', (pair, ticker) => {
    switch (pair) {
        case 'tBTCUSD':
            bitfinex_BTC = ticker.LAST_PRICE
            console.log(`[BITFINEX] [BTC] $${bitfinex_BTC}`)
            break
        case 'tETHUSD':
            bitfinex_ETH = ticker.LAST_PRICE
            console.log(`[BITFINEX] [ETH] $${bitfinex_ETH}`)
            break
    }
})