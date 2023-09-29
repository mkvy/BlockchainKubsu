const bitcoin = require('bitcoinjs-lib')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc)
const TESTNET = bitcoin.networks.testnet


let WIF1 = 'L2SG35aPpU6V1QK18JfVxrKvvKisHUnABVKw5976vTnYQXUgdcnN'
let WIF2 = 'Ky3ZFV9eod971jyW7jZJ9HQbw7hWaeLnsPXSnoeo9wimU5NQqjne'

const keyPair1 = bitcoin.ECPair.fromWIF(WIF1)
const keyPair2 = bitcoin.ECPair.fromWIF(WIF2)
keyPair1.network = TESTNET
keyPair2.network = TESTNET

const p2ms = bitcoin.payments.p2ms({
    m: 2,
    pubkeys: [
        Buffer.from(keyPair1.publicKey,'hex'),
        Buffer.from(keyPair2.publicKey,'hex')
    ], TESTNET
});
p2ms.network = TESTNET

const p2wsh = bitcoin.payments.p2wsh({redeem: p2ms, network: TESTNET})
console.log('P2WSH addr: ' + p2wsh.address) //tb1qpxjxuydntpyufakajqq24pqeysfufjlqrvtfzsvkea3wrjqrlyqqd8pvpx