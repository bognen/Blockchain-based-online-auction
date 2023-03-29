const MainContract = artifacts.require("./FairAuctionMainContract.sol");

module.exports = function(deployer) {
  deployer.deploy(MainContract);
};