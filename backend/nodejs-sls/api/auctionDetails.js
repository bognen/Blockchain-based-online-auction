const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

  const contractAddress = event.pathParameters.contractAddress;

  const auctionParams = {
        TableName: process.env.dynamodb_main_table,
        Key: { auctionAddress: contractAddress }
  };

  try{
      const auctioData = await dynamoDB.get(auctionParams).promise();

      return sendResponse(200, {
        auction: auctioData.Item,
      });
   } catch (err) {
       console.log(err);
       const errorMessage = err.message ? err.message : 'Internal Server Error';
       return sendResponse(500, { errorMessage });
   }
}
