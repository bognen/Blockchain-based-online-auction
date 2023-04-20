const AWS = require('aws-sdk');
const fs = require('fs');
const Web3 = require('web3');
const { ethers } = require('ethers');
const MainContract = require('./FairAuctionMainContract.json');
const AuctionTemplate = require('./Auction.json');

const credentials = new AWS.Credentials({
  accessKeyId: 'XXXXXXXXXXXXXXXXXXXXXXX',
  secretAccessKey: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa'
});

const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:780308835025:auction-sns-topic';
const providerUrl = 'ws://127.0.0.1:8545';
const activeContractsFilePath = './home/ec2-user/node-server/active_contracts.json';

//AWS.config.update({ region: 'us-east-1' });
const sns = new AWS.SNS({
    region: 'us-east-1',
    credentials: credentials
});

// Initialize Listening to Main Contract Events
const web3 = new Web3(providerUrl);

const mainContractAddress = '0x23598C56d6A618918Fa2071161852E7879045169';
const mainContractAbi = MainContract.abi;

const mainContract = new web3.eth.Contract(mainContractAbi, mainContractAddress);

// Define the list of events to listen to
const events = [
  'bidPlaced',
  'bidCancelled',
  'auctionCancelled',
  'auctionFinished',
  'fundsWithdrawn',
];

const activeContracts = new Map();

const saveActiveContractsToFile = () => {
  const contractAddresses = Array.from(activeContracts.keys());
  fs.writeFileSync(activeContractsFilePath, JSON.stringify(contractAddresses));
};

// Function to restore active contracts from a file
const restoreActiveContractsFromFile = () => {
  if (!fs.existsSync(activeContractsFilePath)) {
    console.log('No active contracts file found.');
    return;
  }

  const contractAddresses = JSON.parse(fs.readFileSync(activeContractsFilePath));
  contractAddresses.forEach(addActiveContract);
};

const handleEvent = (contractAddress, eventName, eventData) => {
  console.log(`Event '${eventName}' emitted from contract instance: ${contractAddress}`);
  console.log('Event data:', eventData);

  // Handle the auctionCancelled and auctionFinished events to mark contracts as inactive
  if (eventName === 'auctionCancelled' || eventName === 'auctionFinished' || eventName === 'fundsWithdrawn') {
    web3.eth.getBalance(contractAddress)
    .then(balance => {
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      console.log(`Balance of ${contractAddress}: ${web3.utils.fromWei(balance, 'ether')} ether`);
      if(balanceInEther === '0'){
	removeActiveContract(contractAddress);
      }
    })
    .catch(error => {
      console.error(`Error getting balance: ${error}`);
  });


  }
  // Publish emitted event to AWS SNS
    const params = {
	Subject: eventName,
        Message: JSON.stringify(eventData),
        TopicArn: SNS_TOPIC_ARN,
     };

    sns.publish(params, (err, data) => {
      if (err) {
         console.error('Failed to send message:', err);
      } else {
          console.log('Auction created event emitted successfully');
      }
    });
};

const addActiveContract = (contractAddress) => {
  if (activeContracts.has(contractAddress)) {
    console.log(`Contract address ${contractAddress} is already active.`);
    return;
  }

  // Create a web3 contract instance
  const contractInstance = new web3.eth.Contract(AuctionTemplate.abi, contractAddress);

  // Set up listeners for each event
  events.forEach((eventName) => {
    contractInstance.events[eventName]({})
      .on('data', (event) => {
        handleEvent(contractAddress, eventName, event.returnValues);
      })
      .on('error', console.error);
  });

  // Add the contract instance to the activeContracts map
  activeContracts.set(contractAddress, contractInstance);
  saveActiveContractsToFile();
};

const removeActiveContract = (contractAddress) => {
  const contractInstance = activeContracts.get(contractAddress);

  if (!contractInstance) {
    console.log(`Contract address ${contractAddress} not found.`);
    return;
  }

  // Remove listeners for each event
  events.forEach((eventName) => {

    try{
    	contractInstance.removeAllListeners(eventName);
    }catch (e){`Following error has been caught: ${e}`}
  });

  // Remove the contract instance from the activeContracts map
  activeContracts.delete(contractAddress);
  console.log('Contract address removed from activeContracts.');
  saveActiveContractsToFile();
};

mainContract.events.auctionCreated({})
  .on('data', (event) => {
    const eventData = event.returnValues;
    console.log('Auction created:', eventData);
    console.log('Auction address:', eventData.auctionAddress);

    // Add the contract instance as active
    addActiveContract(eventData.auctionAddress);

    // Publish emitted event to AWS SNS
    const params = {
	      Subject: "auctionCreated",
        Message: JSON.stringify(event.returnValues),
        TopicArn: SNS_TOPIC_ARN,
     };

    sns.publish(params, (err, data) => {
      if (err) {
         console.error('Failed to send message:', err);
      } else {
          console.log('Auction created event emitted successfully');
      }
     });
  })
  .on('error', console.error);
  // Call restoreActiveContractsFromFile when the application starts
  restoreActiveContractsFromFile();
