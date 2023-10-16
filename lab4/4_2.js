require('dotenv').config()
const bitcoin = require('bitcoinjs-lib')
const BIP32Factory = require('bip32').default
const Client = require('bitcoin-core');
const client = new Client({
    network: 'testnet',
    username: 'bitcoinuser',
    password: 'bitcoinsomepass123',
    port: 8332
});

async function sendRawTransaction(txHex) {
    try {
        client.command("sendrawtransaction",txHex).then((res) => console.log(res));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const TESTNET = bitcoin.networks.testnet
const keyPair = bitcoin.ECPair.makeRandom(TESTNET)
const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET })
console.log(address)

import('tiny-secp256k1').then(ecc => BIP32Factory(ecc)).then(bip32 => {
    //приватный extended key
    let t = bip32.fromBase58(process.env.COPAY_EXTENDED_PRIVATE_KEY)

    const derivedIndex = "m/44'/1'/4'/0/3"; // 5й кошелек
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
            hash: '3ea7331f0bdb3ea1c0b366f21d2b2b64dcc0d5498202543939231d231a0fdfc6', // TX_ID
            index: 1, // output транзакции, где находятся непотраченные монеты (tb1qqaxz8vxzrh97d44d9zdhkmh5gq4g7rfeec0hjt)
            witnessUtxo: {
                script: Buffer.from('0014' + pubKeyHash, 'hex'),
                value: 8000
            },
        })
        .addOutput({
            address: address,
            value: 1000, // 1000 сатоши на mfqDqsqiybDUeqrLESrC8d5e7vr9zy2BjN
        })
    psbt.signInput(0, keyPair2)
    psbt.validateSignaturesOfInput(0)
    psbt.finalizeAllInputs()
    let txHex = psbt.extractTransaction(true).toHex()
    console.log('Transaction hexadecimal:')
    console.log(txHex) // Put true here to ignore fee warning

//02000000000101c6df0f1a231d23393954028249d5c0dc642b2b1df266b3c0a13edb0b1f33a73e0100000000ffffffff01e8030000000000001976a9140374777958202408579116f18038b17dad4d2df088ac0247304402206681edb27b970c4ee4f1c2c4918f0cf6e3f5a522b79ab8568c34687aa085a42302207ccd570227c5cf8de83bf019961fc69fb0cd7592fabcfd06628603c9c5d6d37b01210398be9ae49f3f46f3d6530e3f5b2179c99e32b72c985e381bd204a4980bfcf8c900000000
    console.log("Sending transaction ----")
    sendRawTransaction(txHex)
})
