const Web3 = require('web3');
const MainContract = require('./../smart-contracts/build/contracts/FairAuctionMainContract.json');

const web3 = new Web3('ws://127.0.0.1:7545'); // replace with your WebSocket endpoint
const contractAbi = MainContract.abi;
//const contractAddress = MainContract.networks[5777].address; // replace with the address of the FairAuctionMainContract on the Ethereum network
const contractAddress = '0x87923E5bA88849E5Ca59d6054919fB25FD456066';
const fairAuctionMainContract = new web3.eth.Contract(contractAbi, contractAddress);

const init = async () => {
    fairAuctionMainContract.events.auctionCreated({
        fromBlock: 0 // replace with the block number from which you want to start listening to events
    }, function(error, event) {
        if (!error) {
            console.log(event.returnValues);
        }
    });
}

init();
