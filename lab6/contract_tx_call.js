const fs = require("fs");
const { Web3 } = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

let source = fs.readFileSync("solc-output.json");
let contracts = JSON.parse(source)["contracts"];

let abi = contracts["Greeter.sol:Greeter"].abi;

var myContract = new web3.eth.Contract(abi, '0x67a697B3dcedFB50CF6B246AD192d0b1c5F01C1e');

myContract.methods.setGreet("Testing lab 6!").send({
    from: '0xb502b9270044c8277945bf089b02aacd2f2440cd',
    gas: 1500000, // (optional): The maximum gas provided for this transaction (gas limit).
    gasPrice: '30000000000000' // (optional): The gas price in wei to use for this transaction.
})
    .on('transactionHash', function(hash){
        console.log("hash");
        //0x51cd2451811edf8ded02f600ffbd99a0f496b394da6c1551d9e1482d36fc5481
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log("receipt");
        console.log(receipt);
    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log("confirmation");
        console.log(receipt);
    })
    .on('error', console.error);