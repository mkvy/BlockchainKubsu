const bitcoin = require('bitcoinjs-lib')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc)
const TESTNET = bitcoin.networks.testnet
//приватные ключи, полученные ранее
let WIF1 = 'L2SG35aPpU6V1QK18JfVxrKvvKisHUnABVKw5976vTnYQXUgdcnN'
let WIF2 = 'Ky3ZFV9eod971jyW7jZJ9HQbw7hWaeLnsPXSnoeo9wimU5NQqjne'

const keyPair1 = bitcoin.ECPair.fromWIF(WIF1)
const keyPair2 = bitcoin.ECPair.fromWIF(WIF2)
keyPair1.network = TESTNET
keyPair2.network = TESTNET

//получаем p2ms адрес, ставим число подтверждений - 2
const p2ms = bitcoin.payments.p2ms({
    m: 2,
    pubkeys: [
        Buffer.from(keyPair1.publicKey,'hex'),
        Buffer.from(keyPair2.publicKey,'hex')
    ], TESTNET
});
p2ms.network = TESTNET

//генерируем p2wsh из p2ms
const p2wsh = bitcoin.payments.p2wsh({
    redeem: p2ms,
    network:TESTNET
})

//генерируем транзакцию
const psbt = new bitcoin.Psbt({network:TESTNET})
    .addInput({
        hash:'746e915d740e4cd27e4d5e4e8eec431c0e61ddb06db802944e7bb77f322f2b9e',
        index:1,
        witnessScript: p2wsh.redeem.output,
        witnessUtxo: {
            script: Buffer.from('0020'+bitcoin.crypto.sha256(p2ms.output).toString('hex'),'hex'),
            value: 8000
        }
    })
    .addOutput({
        address:'tb1q2kz4mnms56pc6d6atfxd9mdscy34yw5pvj366g',
        value: 1000
    })
// подписываем обеими ключами транзакцию
psbt.signInput(0,keyPair1)
psbt.signInput(0,keyPair2)

psbt.finalizeAllInputs()
console.log('Transaction hex:')
console.log(psbt.extractTransaction(true).toHex())