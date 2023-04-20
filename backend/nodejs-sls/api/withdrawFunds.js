const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Auction = require('./../contracts/Auction.json');
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

   const body = JSON.parse(event.body);
   const address = body.address;
   const privateKey = body.privateKey;
   const isCancelled = body.isCancelled;
   const contractAddress = event.pathParameters.contractAddress;
   const node_url = process.env.eth_node_url

   const provider = new Provider(privateKey, node_url);
   const web3 = new Web3(provider);
   const networkId = await web3.eth.net.getId();

   // A contract can be deployed from here. See my chatGpt
   const auctionContract = new web3.eth.Contract(
     Auction.abi,
     contractAddress
   );
   try{
     console.log("The funds will be withdrawn...");
     let result;
     if(isCancelled) result = await auctionContract.methods.withdrawFundsCancelledBid().send( {from: address } )
     else result = await auctionContract.methods.withdrawFunds().send( {from: address } )

     console.log(`Transaction Hash: ${result.transactionHash}`)
     return sendResponse(200, { message: 'Successfully Cancelled' });
   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}
