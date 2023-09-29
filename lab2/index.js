require('dotenv').config()

const bitcoin = require('bitcoinjs-lib')
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc)

const TESTNET = bitcoin.networks.testnet

const node = bip32.fromBase58(process.env.COPAY_EXTENDED_PRIVATE_KEY)

node.network = TESTNET

const derivedIndex = "m/44'/1'/3'/0/0" //second wallet, no segwit
const wifKey = node.derivePath(derivedIndex).toWIF()

const keyPair = bitcoin.ECPair.fromWIF(wifKey,TESTNET)

var tx = new bitcoin.TransactionBuilder(TESTNET);

var txId = '223d83ea779bbdb5f87d0c2d1f5050ca4e04fe771cfdd3a1216536715643d89d'

tx.addInput(txId,1);

tx.addOutput("mw3CyHr2KVxjxZAon6sqBBEUxkDZofTurP",1000);

tx.sign(0,keyPair)
console.log(tx.build().toHex())