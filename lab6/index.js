const { Web3 } = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

web3.eth.personal.getAccounts().then(console.log)

const keyStore = '{"address":"b502b9270044c8277945bf089b02aacd2f2440cd","crypto":{"cipher":"aes-128-ctr","ciphertext":"86930c5b591fab6ac06318c1532826c30ef466ab0c1ee8f4b15892bd5697f99e","cipherparams":{"iv":"46725ea58b6c5973067c56db8aaec976"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":6,"r":8,"salt":"685295e177c85f43599030062954297b3900eb154ca7de15b477a0c4c28f03ca"},"mac":"eeb4bd0a9431421656db0544c5b97d91511980ee852616a500138f4421b30298"},"id":"1be1ad3b-1cac-4163-ab25-82680ca637bd","version":3}'

const rawTransaction = {
    from: "0xb502b9270044c8277945bf089b02aacd2f2440cd", // Keystore account id
    to: "0x759bb7948a6a39a9a5c5fc8ad2f3c953ec91597a", // Account you want to transfer to
    value: web3.utils.toHex(web3.utils.toWei("0.2", "ether")),
    gas: 21000,
    gasPrice: 875000001n,
    chainId: 1337 // Geth --dev network id
};

web3.eth.accounts.decrypt(keyStore,'').then(decryptedAccount =>
decryptedAccount.signTransaction(rawTransaction))
    .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
    .then(receipt => console.log("Transaction receipt: ", receipt))
    .catch(err => console.error(err));