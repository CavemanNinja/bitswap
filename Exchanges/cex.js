// wss://ws.cex.io/ws/
require('dotenv').config()
const crypto = require('crypto')
const WebSocket = require('ws')

function createSignature(timestamp, apiKey, apiSecret) {
    var hmac = crypto.createHmac('sha256', apiSecret)
    hmac.update(timestamp + apiKey)
    return hmac.digest('hex')
}

function createAuthRequest(apiKey, apiSecret) {
    var timestamp = Math.floor(Date.now() / 1000) // Note: java and javascript timestamp presented in miliseconds
    var args = {
        e: 'auth',
        auth: {
            key: apiKey,
            signature: createSignature(timestamp, apiKey, apiSecret),
            timestamp: timestamp
        }
    }
    var authMessage = JSON.stringify(args)
    console.log(`authMessage: ${authMessage}`)
    return authMessage
}

const cex_socket = new WebSocket('wss://ws.cex.io/ws/')
// const ws = new WebSocket('wss://ws.cex.io/ws/', createAuthRequest(process.env.CEX_API_KEY, process.env.CEX_API_SECRET))

cex_socket.on('open', () => {
    console.log('[CEX] open')
    cex_socket.send(createAuthRequest(process.env.CEX_API_KEY, process.env.CEX_API_SECRET))
    cex_socket.send(JSON.stringify({
        e: 'ticker',
        data: [
            'BTC', 'USD'
        ],
        oid: '1435927928274_1_ticker'
    }))
})

cex_socket.on('connection', () => console.log('[CEX] connected'))

cex_socket.on('message', (msg) => console.log(`[CEX] message: ${msg}`))