const AWS = require('aws-sdk');

module.exports.handler = async (event) => {

     console.log('Lambda triggered by SNS:', JSON.stringify(event, null, 2));
     const dynamoDB = new AWS.DynamoDB.DocumentClient();

     const subject = event.Records[0].Sns.Subject;
     const message = JSON.parse(event.Records[0].Sns.Message);

     try{
       // If Event is Auction Created insert into DB
       if(subject==='auctionCreated'){
         let params = {
           TableName: process.env.dynamodb_main_table,
              Item: {
                auctionAddress: message.auctionAddress,
                owner: message.owner,
                hash: message.hash,
                price: message.price,
                step: message.step,
                promoted: message.promoted,
                start: message.start,
                end: message.end
              },
         };
         await dynamoDB.put(params).promise();
         console.log(`Successfully wrote ${subject} item to DynamoDB: ${JSON.stringify(params.Item)}`);
       }
    } catch (err) {
        throw new Error(`Error writing item to DynamoDB: ${err}`);
    }

}
