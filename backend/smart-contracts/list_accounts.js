const Web3 = require("web3");

module.exports = async function (callback) {
  try {
    const web3 = new Web3("http://3.91.178.242:8545");
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
  // const web3 = new Web3("http://18.206.205.253:8545");
  // web3.eth.getBlock('latest', (error, block) => {
  // if (error) {
  //   console.error(error);
  // } else {
  //   console.log(`Timestamp of the latest block: ${block.timestamp}`);
  // }
//});
};
