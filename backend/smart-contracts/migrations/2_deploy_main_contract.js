const MainContract = artifacts.require("./FairAuctionMainContract.sol");

module.exports = function(deployer, network, accounts) {
  const account = accounts[9]
  deployer.deploy(MainContract, { from: account });
};
