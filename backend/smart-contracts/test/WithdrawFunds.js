// test/WitdrawFunds.js
const AuctionContract = artifacts.require("./Auction");

contract("AuctionContract", accounts => {
  const owner = accounts[0];
  const bidder1 = accounts[1];
  const bidder2 = accounts[2];
  const bidder3 = accounts[3];
  const ipfsHash = "QmX6CvU6SPLszSzhrJU6YBE1VepTUNNhJhD2as9Xjza3qG";
  const price = web3.utils.toWei("1", "ether");
  const step = web3.utils.toWei("0.1", "ether");
  const startTime = Math.floor(Date.now() / 1000) - 60; // 1 minute from now
  const endTime = Math.floor(Date.now() / 1000) + 300; // 2 minutes from now


  /***** HAPPY PATH ****/
  it("should allow 3 bidders to place bids, and witdraw funds of cancelled", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime,
      );

      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.2", "ether");
      await contractInstance.placeBid({ from: bidder1, value: bid1 });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);

      // Bidder2 places a higher valid bid
      const bid2 = web3.utils.toWei("1.4", "ether");
      await contractInstance.placeBid({ from: bidder2, value: bid2 });
      assert.equal(await contractInstance.highestBid(), bid2);
      assert.equal(await contractInstance.highestBidder(), bidder2);
      assert.equal(await contractInstance.activeBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 2);

      const bid3 = web3.utils.toWei("1.8", "ether");
      await contractInstance.placeBid({ from: bidder3, value: bid3 });
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.bidderCount(), 3);

      await contractInstance.cancelAuction({
        from: owner
      })

      // Auction cancelled but owner tries to withdraw the funds
      try {
          await contractInstance.withdrawFunds({ from: owner });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Only active bidders can withdraw funds"), 
                 "Expected to fail with: Only active bidders can withdraw funds")
        }
      const bidder1BalanceBefore = await web3.eth.getBalance(bidder1);
      await contractInstance.withdrawFunds({ from: bidder1 });
      const bidder1BalanceAfter = await web3.eth.getBalance(bidder1);
      assert.ok(bidder1BalanceAfter > bidder1BalanceBefore);

      const bidder2BalanceBefore = await web3.eth.getBalance(bidder2);
      await contractInstance.withdrawFunds({ from: bidder2 });
      const bidder2BalanceAfter = await web3.eth.getBalance(bidder2);
      assert.ok(bidder2BalanceAfter > bidder2BalanceBefore);

      const bidder3BalanceBefore = await web3.eth.getBalance(bidder3);
      await contractInstance.withdrawFunds({ from: bidder3 });
      const bidder3BalanceAfter = await web3.eth.getBalance(bidder3);
      assert.ok(bidder3BalanceAfter > bidder3BalanceBefore);

  });

/* ATTENTION: AFTER RUNNING THIS TEST RESTART GANACHE!!!
  it("should allow 3 bidders to place bids, and witdraw funds", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, 
        Math.floor(Date.now() / 1000) - 1200,
        Math.floor(Date.now() / 1000) + 60,
      );

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.2", "ether");
      await contractInstance.placeBid({ from: bidder1, value: bid1 });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);

      // Bidder2 places a higher valid bid
      const bid2 = web3.utils.toWei("1.4", "ether");
      await contractInstance.placeBid({ from: bidder2, value: bid2 });
      assert.equal(await contractInstance.highestBid(), bid2);
      assert.equal(await contractInstance.highestBidder(), bidder2);
      assert.equal(await contractInstance.activeBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 2);

      // Bidder3 places a higher valid bid
      const bid3 = web3.utils.toWei("1.8", "ether");
      await contractInstance.placeBid({ from: bidder3, value: bid3 });
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.bidderCount(), 3);

      await web3.currentProvider.send(
          { jsonrpc: "2.0", method: "evm_increaseTime", params: [1200], id: 0 },
          (err, result) => {
            if (err) {
              console.log("Error increasing EVM time:", err);
              return;
            }

            console.log("EVM time increased successfully:", result);

            web3.currentProvider.send(
              { jsonrpc: "2.0", method: "evm_mine", params: [], id: 0 },
              async (err, result) => {
                if (err) {
                  console.log("Error mining block:", err);
                  return;
                }

                console.log("Block mined successfully:", result);
                console.log("Proceeding to execute withdraws");                
              }
            );
          }
        );
      // Auction is over but highest bidder tried to withdraw
      try {
          await contractInstance.withdrawFunds({ from: bidder3 });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("The winner cannot withdraw funds"), 
                 "Expected to fail with: The winner cannot withdraw funds")
        }
      const bidder1BalanceBefore = await web3.eth.getBalance(bidder1);
      await contractInstance.withdrawFunds({ from: bidder1 });
      const bidder1BalanceAfter = await web3.eth.getBalance(bidder1);
      assert.ok(bidder1BalanceAfter > bidder1BalanceBefore);

      const bidder2BalanceBefore = await web3.eth.getBalance(bidder2);
      await contractInstance.withdrawFunds({ from: bidder2 });
      const bidder2BalanceAfter = await web3.eth.getBalance(bidder2);
      assert.ok(bidder2BalanceAfter > bidder2BalanceBefore);

      const ownerBalanceBefore = await web3.eth.getBalance(owner);
      await contractInstance.withdrawFunds({ from: owner });
      const ownerBalanceAfter = await web3.eth.getBalance(owner);
      assert.ok(ownerBalanceAfter > ownerBalanceBefore);

  });
*/
});