const Web3 = require("web3");

module.exports = async function (callback) {
  try {
    const web3 = new Web3("http://3.84.24.119:8545"); // Replace with the URL of your test network if different
    const accounts = await web3.eth.getAccounts();

    console.log("Accounts:");
    for (const account of accounts) {
      const balance = await web3.eth.getBalance(account);
      const etherBalance = web3.utils.fromWei(balance, "ether");
      console.log(`  - ${account}: ${etherBalance} ETH`);
    }

    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
