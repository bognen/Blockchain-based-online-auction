const AWS = require('aws-sdk');
const Web3 = require('web3');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {
console.log(event)
   const node_url = `http://${process.env.node_ip}:8545`;
   const userEmail = event.requestContext.authorizer.claims.email;
   const body = JSON.parse(event.body)
   const address = body.account;
   const web3 = new Web3(new Web3.providers.HttpProvider(node_url));

   try{
       console.log("Inserting new entry into database")
       let params = {
            TableName: process.env.dynamodb_email_account,
            Item: {
              email:userEmail,
              account: address
            }
         };
       await dynamoDB.put(params).promise();
       console.log(`Successfully added item to EmailAccount table: ${JSON.stringify(params.Item)}`);
       return sendResponse(200, {
          email: userEmail,
          address: address
        });
   } catch (err) {
     console.log(err);
     const errorMessage = err.message ? err.message : 'Internal Server Error';
     return sendResponse(500, { errorMessage });
   }
}
