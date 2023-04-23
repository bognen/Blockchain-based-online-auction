const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const Auction = require('./../contracts/Auction.json');
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

   try{

   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}
