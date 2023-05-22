const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

  const contractAddress = event.pathParameters.contractAddress;

  const auctionParams = {
        TableName: process.env.dynamodb_main_table,
        Key: { auctionAddress: contractAddress }
  };
  const scanParams = {
        TableName: process.env.dynamodb_historical_bids,
        FilterExpression: 'auction = :auction',
        ExpressionAttributeValues: {
            ':auction': contractAddress
        }
  };

  try{
      const bids = await dynamoDB.scan(scanParams).promise();
      let highestBidder;

      if(bids.Items.length > 0){
        highestBidder = bids.Items.reduce((max, object) => {
          return object.bid > max.bid ? object : max;
        }, bids.Items[0])
      }else{
        highestBidder = {bidder: "", auction: "", bid: 0}
      }
      const auctioData = await dynamoDB.get(auctionParams).promise();
      const response = {
        ...auctioData.Item,
        ...highestBidder
      }
      return sendResponse(200, {
        auction: response,
      });
   } catch (err) {
       console.log(err);
       const errorMessage = err.message ? err.message : 'Internal Server Error';
       return sendResponse(500, { errorMessage });
   }
}
