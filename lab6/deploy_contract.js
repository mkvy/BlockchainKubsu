const fs = require("fs")
const { Web3 } = require("web3")

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

let source = fs.readFileSync("solc-output.json");

let contracts = JSON.parse(source)["contracts"];

console.log(contracts)
let abi = contracts["Greeter.sol:Greeter"].abi;
console.log(abi)

let code = '0x' + contracts["Greeter.sol:Greeter"].bin;

var myContract = new web3.eth.Contract(abi);
