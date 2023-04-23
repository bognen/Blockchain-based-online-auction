const AWS = require('aws-sdk');
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

   const node_url = `http://${process.env.node_ip}:8545`;
   //const userEmail = event.requestContext.authorizer.claims.email;  TODO: remove when security is back
   const userEmail = "test@test.ca"
   const web3 = new Web3(new Web3.providers.HttpProvider(node_url));

   try{
       console.log("Creating new account...")
       const account = web3.eth.accounts.create();
       console.log("Inserting new entry into database")
       let params = {
            TableName: process.env.dynamodb_email_account,
            Item: {
              email:userEmail,
              account: account.address
            }
         };
       await dynamoDB.put(params).promise();
       console.log(`Successfully added item to EmailAccount table: ${JSON.stringify(params.Item)}`);
       return sendResponse(200, {
          address: account.address,
          privateKey: account.privateKey
        });
   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}
