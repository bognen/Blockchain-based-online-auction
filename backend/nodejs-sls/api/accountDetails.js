const AWS = require('aws-sdk');
const Web3 = require('web3');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

  const userEmail = event.requestContext.authorizer.claims.email;
  const node_url = `http://${process.env.node_ip}:8545`;
  const web3 = new Web3(new Web3.providers.HttpProvider(node_url));

  const params = {
        TableName: process.env.dynamodb_email_account,
        Key: {
          email: userEmail
        },
  };

  try{
      const data = await dynamoDB.get(params).promise();
      console.log("Data", data)
      let account = "";
      let balance = 0;

      if (Object.keys(data).length !== 0) {
          account = data.Item.account;
          const balanceWei = await web3.eth.getBalance(data.Item.account);
          balance = web3.utils.fromWei(balanceWei, 'ether');
      }

      return sendResponse(200, {
        account: account,
        balance: balance
      });
   } catch (err) {
       console.log(err);
       const errorMessage = err.message ? err.message : 'Internal Server Error';
       return sendResponse(500, { errorMessage });
   }
}
