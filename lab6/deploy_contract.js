const fs = require("fs")
const { Web3 } = require("web3")

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));

let source = fs.readFileSync("solc-output.json");

let contracts = JSON.parse(source)["contracts"];

let abi = contracts["Greeter.sol:Greeter"].abi;

let code = '0x' + contracts["Greeter.sol:Greeter"].bin;

var myContract = new web3.eth.Contract(abi);

myContract.deploy({
    data: code,
})
    .send({
        from: '0xb502b9270044c8277945bf089b02aacd2f2440cd', // The address the transaction should be sent from.
        gas: 1500000, // (optional): The maximum gas provided for this transaction (gas limit).
        gasPrice: '30000000000000' // (optional): The gas price in wei to use for this transaction.
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
//0x67a697B3dcedFB50CF6B246AD192d0b1c5F01C1e