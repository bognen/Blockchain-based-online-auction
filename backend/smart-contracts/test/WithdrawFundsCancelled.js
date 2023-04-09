// test/WitdrawFundsCancelled.js
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
  it("should allow 3 bidders to place bids, 2nd bidder cancellsand withdraws funds", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime,
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

      const bid3 = web3.utils.toWei("1.8", "ether");
      await contractInstance.placeBid({ from: bidder3, value: bid3 });
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.bidderCount(), 3);

      // Second bidder cancels bid
      await contractInstance.cancelBid({ from: bidder2 })
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.cancelledBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 2);

      // Second bidder withdraws funds
      const bidder2BalanceBefore = await web3.eth.getBalance(bidder2);
      await contractInstance.withdrawFundsCancelledBid({ from: bidder2 });
      const bidder2BalanceAfter = await web3.eth.getBalance(bidder2);
      // Final assertation
      assert.ok(bidder2BalanceAfter > bidder2BalanceBefore);
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.cancelledBids(bidder2), 0);
      assert.equal(await contractInstance.bidderCount(), 2);

  });

   it("should not allow withdraw funds, when 2nd bidder cancels bid but 1st tries to withdraw", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime,
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

      const bid3 = web3.utils.toWei("1.8", "ether");
      await contractInstance.placeBid({ from: bidder3, value: bid3 });
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.bidderCount(), 3);

      // Second bidder cancels bid
      await contractInstance.cancelBid({ from: bidder2 })
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.cancelledBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 2);

      try {
        await contractInstance.withdrawFundsCancelledBid({ from: bidder1 });
        assert.fail("Expected an error but did not get one");
      } catch (error) {
        assert(error.data.stack.includes("Amount must be non-zero value"), 
               "Expected to fail with: Amount must be non-zero value");
      }
  });
});