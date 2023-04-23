const AWS = require('aws-sdk');
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Auction = require('./../contracts/Auction.json');
const { sendResponse, deployDataToIPFS } = require("../utils/helper");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
   const dynamoDB = new AWS.DynamoDB.DocumentClient();
   const address = body.address;
   const privateKey = body.privateKey;
   const contractAddress = event.pathParameters.contractAddress;
   const node_url = `http://${process.env.node_ip}:8545`;

   const provider = new Provider(privateKey, node_url);
   const web3 = new Web3(provider);
   const networkId = await web3.eth.net.getId();

   // A contract can be deployed from here. See my chatGpt
   const auctionContract = new web3.eth.Contract(
     Auction.abi,
     contractAddress
   );
   try{
     console.log("Cancelling created auction...")
     let result = await auctionContract.methods.cancelAuction().send( {from: address } )
     console.log(`Transaction Hash: ${result.transactionHash}`)

     return sendResponse(200, { message: 'Auction Successfully Cancelled' });
   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}
