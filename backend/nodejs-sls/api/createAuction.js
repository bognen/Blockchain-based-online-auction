const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MainContract = require('./../contracts/FairAuctionMainContract.json');

const { sendResponse } = require("../utils/helper");


module.exports.handler = async (event) => {

    const body = JSON.parse(event.body);
    const node_url = `http://${process.env.node_ip}:8545`;

    // TODO: Convert it to get it from body
    const address = body.address;
    const privateKey = body.privateKey;
    const ipfsHash = body.ipfsHash;
    const promoted = body.promoted;
    const price = parseInt(body.price);
    const step = parseInt(body.step);
    const startTime = body.start;
    const endTime = body.end;

    try {
      const provider = new Provider(privateKey, node_url);
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();

      // Deploy a new contract
      const mainContract = new web3.eth.Contract(
        MainContract.abi,
        MainContract.networks[networkId].address
      );

      let newContract = await mainContract.methods.createAuction(ipfsHash, price, step, promoted, startTime, endTime).send(
        {from: address}, (error, result) => {
          if (error) {
            console.error("An error occurred >> ", error);
            return sendResponse(412, {
              message: 'Error occurred while creating new auction contract',
              errorMessage: error
            });
          }
          return result;
        });
      const newAuctionAddress = newContract.events.auctionCreated.returnValues[0];
      console.log("New contract address >> ", newAuctionAddress);

      return sendResponse(200, {
        message: 'Auction was created',
        auctionAddress: newAuctionAddress
      });

    } catch (err) {
      console.log("Something went wrong");
      console.log(err);
      const errorMessage = err.message ? err.message : 'Internal Server Error';
      return sendResponse(500, { errorMessage });
    }
}
