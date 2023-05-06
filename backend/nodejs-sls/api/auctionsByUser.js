const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require("../utils/helper");

module.exports.handler = async (event) => {

    const userEmail = event.requestContext.authorizer.claims.email;
    let ownerEthAccount;
    let ownedAuctions;
    let cancelledAuctions;
    let participatedAuctions;

    try{
        userInfo = await getOwnersAccount(userEmail);
        ownedAuctions = await getOwnedAuctions(userInfo.account);
        cancelledAuctions = await getCancelledAuctions(userInfo.account);
        participatedAuctions = await getParticipatedAuctions(userInfo.account);

        return sendResponse(200, {
            owned: ownedAuctions,
            cancelled: cancelledAuctions,
            participated: participatedAuctions
        });
    }catch(err){
        const errorMessage = err.message ? err.message : 'Internal Server Error';
        return sendResponse(500, { errorMessage });
    }
}

/** Function responsible for obtaining contract address by email */
async function getOwnersAccount(email){
    const accountParams = {
          TableName: process.env.dynamodb_email_account,
          Key: { email: email }
    };

    try{
       const userAdderess = await dynamoDB.get(accountParams).promise();
       return userAdderess.Item;
     } catch (err) {
       console.log("An error occurred ", err)
       throw new Error(`Could not retrieve owners account from database: ${err.message}`);
     }
}

/** Function responsible for obtaining contract where owner is given address */
async function getOwnedAuctions(account){
    const scanParams = {
          TableName: process.env.dynamodb_main_table,
          FilterExpression: 'auctionOwner = :auctionOwner',
          ExpressionAttributeValues: {
              ':auctionOwner': account
          }
    };
    try{
       const ownedAuctions = await dynamoDB.scan(scanParams).promise();
       return ownedAuctions.Items;
     } catch (err) {
       console.log("An error occurred ", err)
       throw new Error(`Could not retrieve owned auctions from database: ${err.message}`);
     }
}

/** The method is responsible for getting still pending cancelled auctions*/
async function getCancelledAuctions(account){
    try{
        const scanParams1 = {
              TableName: process.env.dynamodb_main_table,
              FilterExpression: 'cancelled = :val1',
              ExpressionAttributeValues: {
                  ':val1': true
              }
        };
        const scanParams2 = {
              TableName: process.env.dynamodb_cancelled_bids,
              FilterExpression: 'bidder = :val1',
              ExpressionAttributeValues: {
                  ':val1': account
              }
        };

       const cancelledAuctions = await dynamoDB.scan(scanParams1).promise();
       const cancelledAuctionsbyUser = await dynamoDB.scan(scanParams2).promise();

        const auctions = cancelledAuctions.Items.filter(auction => {
            return cancelledAuctionsbyUser.Items.some(bidder => auction.auctionAddress === bidder.auctionAddress);
        });
        return auctions;

     } catch (err) {
       console.log("An error occurred ", err)
       throw new Error(`Could not retrieve owned auctions from database: ${err.message}`);
     }
}

/** The method is responsible for getting auction where user participated */
async function getParticipatedAuctions(account){
    try{
        const scanParams = {
              TableName: process.env.dynamodb_main_table,
        };

        const queryParams = {
              TableName: process.env.dynamodb_historical_bids,
              KeyConditionExpression: '#bidder = :bidder',
              ExpressionAttributeNames: {
                 '#bidder': 'bidder',
              },
              ExpressionAttributeValues: {
                 ':bidder': account
              }
          };

       const auctions = await dynamoDB.scan(scanParams).promise();
       const auctionsbyUser = await dynamoDB.query(queryParams).promise();

       const mergedAuctions = auctions.Items.reduce((acc, auction1) => {
            const matchingAuction = auctionsbyUser.Items.find(auction2 => auction1.auctionAddress === auction2.auction );
            if (matchingAuction) {
                acc.push({
                    ...auction1,
                    ...matchingAuction
                });
            }
            console.log(acc)
            return acc;
        }, []);
       return mergedAuctions;

     } catch (err) {
       console.log("An error occurred ", err)
       throw new Error(`Could not retrieve owned auctions from database: ${err.message}`);
     }
}
