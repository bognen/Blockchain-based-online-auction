const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

    const contractAddress = event.pathParameters.contractAddress;
    const userEmail = event.requestContext.authorizer.claims.email;
    const accountParams = {
          TableName: process.env.dynamodb_email_account,
          Key: { email: userEmail }
    };

    let accountData;
    try{
      accountData = await dynamoDB.get(accountParams).promise();
    }catch(e){ console.log(`Error occurred while getting account`)}

    if (accountData && accountData.Item) {
      const actBidParams = {
            TableName: process.env.dynamodb_active_bids,
            Key: {
              auctionAddress: contractAddress ,
              bidder: accountData.Item.account
            }
      };

      const cancelBidParams = {
            TableName: process.env.dynamodb_cancelled_bids,
            Key: {
              auctionAddress: contractAddress ,
              bidder: accountData.Item.account
            }
      };

      const historicalBidParams = {
            TableName: process.env.dynamodb_historical_bids,
            KeyConditionExpression: '#bidder = :bidder',
            FilterExpression: '#auction = :auction',
            ExpressionAttributeNames: {
               '#bidder': 'bidder',
               '#auction': 'auction',
            },
            ExpressionAttributeValues: {
               ':bidder': accountData.Item.account,
               ':auction': contractAddress,
            }
      };

      try{
          const activeBids = await dynamoDB.get(actBidParams).promise();
          const cancelBid = await dynamoDB.get(cancelBidParams).promise();
          const historicalBids = await dynamoDB.query(historicalBidParams).promise();

          return sendResponse(200, {
            active: activeBids.Item,
            cancelled: cancelBid.Item,
            historical: historicalBids.Items[0]
          });
       } catch (err) {
           console.log(err);
           const errorMessage = err.message ? err.message : 'Internal Server Error';
           return sendResponse(500, { errorMessage });
       }

    }else{
        return sendResponse(200, {
            message: "No Account Found",
        });
    }

}
