const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

  const contractAddress = event.pathParameters.contractAddress;
  const params = {
        TableName: process.env.dynamodb_main_table,
        Key: {
          auctionAddress: contractAddress
        },
  };

  try{
      const data = await dynamoDB.get(params).promise();
      return sendResponse(200, { auction: data.Item });
   } catch (err) {
       console.log(err);
       const errorMessage = err.message ? err.message : 'Internal Server Error';
       return sendResponse(500, { errorMessage });
   }
}
