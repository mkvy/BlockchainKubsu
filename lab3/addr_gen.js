const bitcoin = require('bitcoinjs-lib')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc)
const TESTNET = bitcoin.networks.testnet


const keyPair1 = bitcoin.ECPair.makeRandom(TESTNET)
const keyPair2 = bitcoin.ECPair.makeRandom(TESTNET)

const WIF1 = keyPair1.toWIF()
const WIF2 = keyPair2.toWIF()

console.log(WIF1) //L2SG35aPpU6V1QK18JfVxrKvvKisHUnABVKw5976vTnYQXUgdcnN
console.log(WIF2) //Ky3ZFV9eod971jyW7jZJ9HQbw7hWaeLnsPXSnoeo9wimU5NQqjne
