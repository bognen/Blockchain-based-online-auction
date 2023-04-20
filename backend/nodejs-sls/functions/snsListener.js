const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {

     const subject = event.Records[0].Sns.Subject;
     const message = JSON.parse(event.Records[0].Sns.Message);
     let insertItem = {}

     // If Event is Auction Created insert into DB
     switch(subject) {
        case 'auctionCreated':
          console.log("New Auction Will be created");
          insertItem = {
              auctionAddress: message.auctionAddress,
              owner: message.owner,
              hash: message.hash,
              price: message.price,
              step: message.step,
              promoted: message.promoted,
              start: message.start,
              end: message.end,
              highestBid: 0,
              bidCount: 0
          }
          await dynamoDbInsert(process.env.dynamodb_main_table, insertItem)
            .then(r => console.log("Inserted into Main DynamoDB table"))
            .catch(e => console.log(`Error occurred while inserting into Main DynamoDB: ${e}`));
          break;

        case 'bidPlaced':
          console.log("New bid was placed. The auction will be updated");
          await dynamoDbUpdate(process.env.dynamodb_main_table, message)
            .then(resp => console.log(`Auction Updated: ${resp}`))
            .catch(err => console.error(err));
          await insertBidder(process.env.dynamodb_active_bids, message)
            .then(resp => console.log("New Entry was inserted into active bidders table"))
            .catch(err => console.log(`An error occurred while inserting into active bidder table`))

           insertItem = {
                bidder: message._bidder,
                auction: message._auction,
                bid: message._highestBid
            }
          await dynamoDbInsert(process.env.dynamodb_historical_bids, insertItem)
            .then(r => console.log("Inserted into Historical DynamoDB table"))
            .catch(e => console.log(`Error occurred while inserting into Historical DynamoDB: ${e}`));
          break;

        case 'bidCancelled':
          console.log("The bid was cancelled. The auction will be updated");
          await dynamoDbUpdate(process.env.dynamodb_main_table, message)
            .then(resp => console.log(`Auction Updated: ${resp}`))
            .catch(err => console.error(err));
          await removeBidder(process.env.dynamodb_active_bids, message)
            .then(resp => console.log(`The bidder was removed`))
            .catch(err => console.error(err));
          await insertBidder(process.env.dynamodb_cancelled_bids, message)
            .then(resp => console.log("New Entry was inserted into cancelled bidders table"))
            .catch(err => console.log(`An error occurred while inserting into cancelled bidder table`))
          break;

        case 'auctionCancelled':
        case 'auctionExpired':
        case 'fundsWithdrawn':
          console.log(`The balance is ${message._auctionBalance}`);
          // Try to remove from Active Bids
          await removeBidder(process.env.dynamodb_active_bids, message)
            .then(resp => console.log(`The bidder was from active bids ${process.env.dynamodb_active_bids} table`))
            .catch(err => console.error(err));

          // Try to remove from Cancelled Bids
          await removeBidder(process.env.dynamodb_cancelled_bids, message)
            .then(resp => console.log(`The bidder was from active bids ${process.env.dynamodb_cancelled_bids} table`))
            .catch(err => console.error(err));

          console.log(`Auction balance is ${message._auctionBalance}`);
          console.log(`Auction balance type ${typeof message._auctionBalance}`)
          if (message._auctionBalance === '0') {
            console.log("The auction will be deleted");

            // Remove all leftover items from bidders Table
            await deleteItemsByAuctionAddress(process.env.dynamodb_active_bids, message._auction)
              .then(resp => console.log(`Active Bids Removed: ${resp}`))
              .catch(err => console.error(`The following error occurred while deleting from active bidder table: ${err}`));

            await deleteItemsByAuctionAddress(process.env.dynamodb_cancelled_bids, message._auction)
              .then(resp => console.log(`Auction Removed: ${resp}`))
              .catch(err => console.error(err));

          }
          break;
        default:
          console.log(`Undefined subject: ${subject}`);
          break;
      }
}

/** The function incerts data into main auction table */
async function dynamoDbInsert(table, insertItem){
    try{
      let params = {
         TableName: table,
         Item: insertItem
         // Item: {
         //   auctionAddress: message.auctionAddress,
         //   owner: message.owner,
         //   hash: message.hash,
         //   price: message.price,
         //   step: message.step,
         //   promoted: message.promoted,
         //   start: message.start,
         //   end: message.end,
         //   highestBid: 0,
         //   bidCount: 0
         // },
      };
      const resp = await dynamoDB.put(params).promise();
      console.log(`Successfully wrote item to DynamoDB: ${JSON.stringify(params.Item)}`);
      return resp;
    } catch (e) {
        console.log("An error occurred ", e)
        throw new Error(`Could not write to DynamoDB: ${e.message}`);
    }
}

/** The function updates entry from the main auction table */
async function dynamoDbUpdate(table, message){
    try{
      const params = {
         TableName: table,
         Key: {
           'auctionAddress': message._auction
         },
         UpdateExpression: 'set highestBid = :top, bidCount = :count',
         ExpressionAttributeValues: {
            ':top': message._highestBid,
            ':count': message._bidderCount,
         },
         ReturnValues: 'UPDATED_NEW',
       };
      const resp = await dynamoDB.update(params).promise();
      console.log(`Successfully updated Auction in DynamoDB with params: ${JSON.stringify(params)}`);
      return resp;
    } catch (e) {
        throw new Error(`Could update DynamoDB: ${e.message}`);
    }
}

/** The function removes entry from the main auction table */
async function dynamoDbRemove(table, message){
    try{
      const params = {
         TableName: table,
         Key: {
           'auctionAddress': message._auction
         }
       };
      const resp = await dynamoDB.delete(params).promise();
      console.log(`Successfully delete Auction from DynamoDB: ${JSON.stringify(message._address)}`);
      return resp;
    } catch (e) {
        throw new Error(`Could not delete from DynamoDB: ${e.message}`);
    }
}

/** The function adds entry to bids table */
async function insertBidder(table, message){
    try{
      let params = {
         TableName: table,
         Item: {
           auctionAddress: message._auction,
           bidder: message._bidder,
         },
      };
      const resp = await dynamoDB.put(params).promise();
      console.log(`Successfully insrted item ${JSON.stringify(params.Item)} into DynameDB table ${table}`);
      return resp;
    } catch (e) {
        console.log("An error occurred ", e)
        throw new Error(`Could not insert to DynamoDB: ${e.message}`);
    }
}

/** The function tries to delete entry from both active and cancelled bidder */
async function removeBidder(table, message){
  const params = {
    TableName: table,
    Key: {
      'auctionAddress': message._auction,
      'bidder': message._bidder
    }
  };

  try {
    const resp = await dynamoDB.delete(params).promise();
    console.log(`Successfully deleted item from table ${table}`);
    return resp;
  } catch (e) {
    if (e.code === "ConditionalCheckFailedException") {
      console.log(`Delete condition not met for table ${table}`);
    } else {
      throw new Error(`Could not delete from DynamoDB table ${table}: ${e.message}`);
    }
  }
}

/** The function deletes items from a table based on given auctionAddress */
async function deleteItemsByAuctionAddress(tableName, auctionAddress) {
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: 'auctionAddress = :auctionAddress',
    ExpressionAttributeValues: {
      ':auctionAddress': auctionAddress
    }
  };

  const queryResult = await dynamoDB.query(queryParams).promise();
  const items = queryResult.Items;

  // Loop through items and delete them
  for (const item of items) {
    const deleteParams = {
      TableName: tableName,
      Key: {
        'auctionAddress': auctionAddress,
        'bidder': item.bidder
      }
    };

    await dynamoDB.delete(deleteParams).promise();
    console.log(`Deleted item: auctionAddress: ${item.auctionAddress}, bidder: ${item.bidder}`);
  }
}
