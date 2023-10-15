const Client = require('bitcoin-core');
const client = new Client({
    network: 'testnet',
    username: 'bitcoinuser',
    password: 'bitcoinsomepass123',
    port: 8332
});
//client.getBlockchainInfo().then((help) => console.log(help));
async function f() {
    try {
        const res = await client.command("listunspent");
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function getUnspentByAddress(address) {
    unspentAll = await f();
    let sum = 0
    unspentAll.forEach((tx) => {
        if (tx.address === address) {
            sum += tx.amount
        }
    })
    console.log("Sum of unspent output of address:", sum)
    return unspentAll
}

async function getUnspent() {
    unspentAll = await f();
    let sum = 0
    unspentAll.forEach((tx) => {
            sum += tx.amount
    })
    console.log("Sum of unspent output for wallet:", sum)
    return unspentAll
}

getUnspentByAddress("tb1qw03ew4vdc76udg2mmwq26pm4fwtl244xwx3meu")
getUnspent()