const fs = require("fs");
const { Web3 } = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

let source = fs.readFileSync("solc-outputtoken.json");
let contracts = JSON.parse(source)["contracts"];
let abi = contracts["nrcToken.sol:NRCToken"].abi;
// Smart contract EVM bytecode as hex
let code = '0x' + contracts["nrcToken.sol:NRCToken"].bin;
var myContract = new web3.eth.Contract(abi);
myContract.deploy({
    data: code,
    arguments: [1000000] // Token initialSupply
})
    .send({
        from: '0xb502b9270044c8277945bf089b02aacd2f2440cd',
        gas: 1500000,
        gasPrice: '30000000000000'
    }, function(error, transactionHash){ })
    .on('error', function(error){ })
    .on('transactionHash', function(transactionHash){ })
    .on('receipt', function(receipt){
        console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){ })
    .then(function(newContractInstance){
        console.log(newContractInstance.options.address) // instance with the new contract address
    });

//0x4C99AF63401d91F9641216101A09e56912B5FB04