const fs = require("fs");
const {Web3} = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:3334"));


let source = fs.readFileSync("solc-outputtoken.json");
let contracts = JSON.parse(source)["contracts"];
// ABI description as JSON structure
let abi = contracts["nrcToken.sol:NRCToken"].abi;
var myContract = new web3.eth.Contract(abi, '0x4C99AF63401d91F9641216101A09e56912B5FB04');


// Send transaction to transfer 1000 Tokens to address.
var amount = 1000;
var tokens = Web3.utils.toWei(amount.toString(), 'ether');
// Send transaction to transfer 1000 * 10 ^ 18 Tokens to address.
myContract.methods.transfer("0xa5fe3A18909062f135b5A2FAE851eCC84f8cd39F", tokens).send({
    from: '0xb502b9270044c8277945bf089b02aacd2f2440cd', // The address the transaction should be sent from.
    gas: 1500000, // (optional): The maximum gas provided for this transaction (gas limit).
    gasPrice: '30000000000000' // (optional): The gas price in wei to use for this transaction.
})
    .on('transactionHash', function(hash){
        console.log("hash");
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log("receipt");
        console.log(receipt);
    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log("confirmation");
        console.log(receipt);
        // Check the result.
        myContract.methods.balanceOf("0xb502b9270044c8277945bf089b02aacd2f2440cd").call()
            .then((balance) => {
                console.log("Owner balance " + balance)
            });
        myContract.methods.balanceOf("0xa5fe3A18909062f135b5A2FAE851eCC84f8cd39F").call()
            .then((balance) => {
                console.log("Transfer to balance " + balance)
            });
    })
    .on('error', console.error);


//0xb3911eea83d13379cb2c45c9e9aad5261c414182b2f8307ce5dd60ae5f880538