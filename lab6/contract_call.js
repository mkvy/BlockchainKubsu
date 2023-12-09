const fs = require("fs");
const { Web3 } = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

let source = fs.readFileSync("solc-output.json");
let contracts = JSON.parse(source)["contracts"];

let abi = contracts["Greeter.sol:Greeter"].abi;


var myContract = new web3.eth.Contract(abi, '0x67a697B3dcedFB50CF6B246AD192d0b1c5F01C1e');
// Will call a “constant” method and execute its smart contract method in the EVM without sending any transaction.
// Note calling can not alter the smart contract state.
// Will output empty string.
myContract.methods.greet().call()
    .then(console.log);