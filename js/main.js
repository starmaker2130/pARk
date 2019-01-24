const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('fc915374734940e71d8074f7ed6bf164dc9e2b795091e9474f84a5ecd8870d08');
const myWalletAddress = myKey.getPublic('hex');

let myCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, [], 10);

const tx2 = new Transaction(myWalletAddress, [], 35);

tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);

console.log(`starting the miner...`);
myCoin.minePendingTransactions(myWalletAddress);
                               
console.log(`\n balance of my address is ${myCoin.getBalanceOfAddress(myWalletAddress)}`);

tx2.signTransaction(myKey);
myCoin.addTransaction(tx2);

console.log(`starting the miner...`);
myCoin.minePendingTransactions(myWalletAddress);
                               
console.log(`\n balance of my address is ${myCoin.getBalanceOfAddress(myWalletAddress)}`);
