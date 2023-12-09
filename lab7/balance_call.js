const fs = require("fs");
const {Web3} = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));


let source = fs.readFileSync("solc-outputtoken.json");
let contracts = JSON.parse(source)["contracts"];
// ABI description as JSON structure
let abi = contracts["nrcToken.sol:NRCToken"].abi;
var myContract = new web3.eth.Contract(abi, '0x4C99AF63401d91F9641216101A09e56912B5FB04');
// Pass address of the contract owner.
myContract.methods.balanceOf("0xb502b9270044c8277945bf089b02aacd2f2440cd").call()
    .then((balance) => {
        console.log("Owner balance " + balance)
});
myContract.methods.balanceOf("0x759bb7948a6a39a9a5c5fc8ad2f3c953ec91597a").call()
    .then((balance) => {
        console.log("Transfer to balance " + balance)
    });