const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

  const type = event.pathParameters.promoted;
  const currentTime = new Date();
  const unixTime = Math.floor(currentTime.getTime() / 1000);

  let scanParams;
  if(type === 'all'){
      scanParams = {
           TableName: process.env.dynamodb_main_table,
           FilterExpression: 'endTime > :val1 and cancelled = :val2',
           ExpressionAttributeValues: {
               ':val1': unixTime.toString(),
               ':val2': false
           }
      };
  }else{
      scanParams = {
           TableName: process.env.dynamodb_main_table,
           FilterExpression: 'endTime > :val1 and promoted = :val2 and cancelled = :val3',
           ExpressionAttributeValues: {
               ':val1': unixTime.toString(),
               ':val2': true,
               ':val3': false
           },
           Limit: 10
      };
  }

  return getAuctions(scanParams)
      .then(auctions => {
          if(type === 'four' && auctions.length > 4)
            auctions = auctions.slice(0, 4);
          return sendResponse(200, { auctions });
      }).catch(err => {
           console.log(err);
           const errorMessage = err.message ? err.message : 'Internal Server Error';
           return sendResponse(500, { errorMessage });
      })
}

async function getAuctions(scanParams){
    try{
        const scanResult = await dynamoDB.scan(scanParams).promise();
        const sortedResult = scanResult.Items.sort((a,b) => Number(b.promoted) - Number(a.promoted));
        console.log("Sorted Auctions ", sortedResult);
        return sortedResult;
    } catch (e) {
        console.log("An error occurred ", e)
        throw new Error(`Could not retrieve items from database: ${e.message}`);
    }
}
