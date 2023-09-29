require('dotenv').config()
const bitcoin = require('bitcoinjs-lib')
const BIP32Factory = require('bip32').default

const TESTNET = bitcoin.networks.testnet
const keyPair = bitcoin.ECPair.makeRandom(TESTNET)
//генерируем пару ключей на которую будем отправлять монеты
const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET })
console.log(address)

import('tiny-secp256k1').then(ecc => BIP32Factory(ecc)).then(bip32 => {
    //приватный extended key
let t = bip32.fromBase58(process.env.COPAY_EXTENDED_PRIVATE_KEY)

const derivedIndex = "m/44'/1'/4'/0/0"; // 5й кошелек, второй индекс
    // Override network to be test network
t.network = TESTNET
    //получаем WIF
const wifKey = t.derivePath(derivedIndex).toWIF();
const keyPair2 = bitcoin.ECPair.fromWIF(wifKey, TESTNET); // подписываем транзакцию этим ключом
console.log('WIF_In=',keyPair2.toWIF())
    //генерируем segwit адрес
const p2wpkh = bitcoin.payments.p2wpkh({pubkey: keyPair2.publicKey, network: TESTNET})
console.log('Previous output script:')
console.log(p2wpkh.output.toString('hex'))
console.log('addressFrom:')
console.log(p2wpkh.address)

    //хешируем полученный адрес
let pubKeyHash = bitcoin.crypto.hash160(Buffer.from(keyPair2.publicKey), 'hex').toString('hex');
console.log('PubKey Hash: ' + pubKeyHash);
const psbt = new bitcoin.Psbt({network: TESTNET})
    .addInput({
        //хеш предыдущей транзакции
        hash: '24801de065f229a6a35a200a63ae85955734dd5d1a7bb84f618f9a75f1c7c2fb', // TX_ID
        index: 0, // output транзакции, где находятся непотраченные монеты (tb1qy0qxq74u829xmy9qzaea0xz2jsnnvucs6vekkx)
        witnessUtxo: {
            script: Buffer.from('0014' + pubKeyHash, 'hex'),
            value: 8000
        },
    })
    .addOutput({
        address: address,
        value: 1000, // 1000 сатоши на mn2tgxoZyp1mpQHYnxiJjVqwWRsukn3hdP
    })

psbt.signInput(0, keyPair2)
psbt.validateSignaturesOfInput(0)
psbt.finalizeAllInputs()
console.log('Transaction hexadecimal:')
console.log(psbt.extractTransaction(true).toHex()) // Put true here to ignore fee warning
//020000000001017bd2f73a43cb179e65d8b208a82abb19d09c8d24dfb0aec3eb1995cac364f7370100000000ffffffff01e8030000000000001976a914477a3967adea4e5de3f371b7e382680ec90bd6cd88ac02483045022100a1c0d6f3876296c715d279b9120a2a4e1519bdc37a966978c13b897ebde819a3022060aaa3e7f9104a7024f88fb39571505c0c7a6283aae15701b8a7d537ea3fd514012102a136f4a7cfc45e0c16f16ea6f8428acbe4b8c817608e96c9e6596b7b6599726100000000
})
