// test/placeBid.js
const AuctionContract = artifacts.require("./Auction");

contract("AuctionContract", accounts => {
  const owner = accounts[0];
  const bidder1 = accounts[1];
  const bidder2 = accounts[2];
  const ipfsHash = "QmX6CvU6SPLszSzhrJU6YBE1VepTUNNhJhD2as9Xjza3qG";
  const price = web3.utils.toWei("1", "ether");
  const step = web3.utils.toWei("0.1", "ether");
  const startTime = Math.floor(Date.now() / 1000) - 60; // 1 minute from now
  const endTime = Math.floor(Date.now() / 1000) + 300; // 2 minutes from now

  /***** HAPPY PATH ****/
  it("should deploy the contract with the correct parameters", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      startTime,
      endTime
    );
    assert.equal(await contractInstance.owner(), owner);
    assert.equal(await contractInstance.ipfsHash(), ipfsHash);
    assert.equal(await contractInstance.startPrice(), price);
    assert.equal(await contractInstance.step(), step);
    assert.equal(await contractInstance.promoted(), true);
    assert.equal(await contractInstance.startTime(), startTime);
    assert.equal(await contractInstance.endTime(), endTime);
  });

  it("should allow bidders to place valid bids", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      startTime,
      endTime
    );

    // Bidder1 places the first valid bid
    const bid1 = web3.utils.toWei("1.2", "ether");
    await contractInstance.placeBid({
      from: bidder1,
      value: bid1
    });
    assert.equal(await contractInstance.highestBid(), bid1);
    assert.equal(await contractInstance.highestBidder(), bidder1);
    assert.equal(await contractInstance.activeBids(bidder1), bid1);
    assert.equal(await contractInstance.cancelledBids(bidder2), 0);
    assert.equal(await contractInstance.bidderCount(), 1);

    // Bidder2 places a higher valid bid
    const bid2 = web3.utils.toWei("1.4", "ether");
    await contractInstance.placeBid({
      from: bidder2,
      value: bid2
    });
    assert.equal(await contractInstance.highestBid(), bid2);
    assert.equal(await contractInstance.highestBidder(), bidder2);
    assert.equal(await contractInstance.activeBids(bidder2), bid2);
    assert.equal(await contractInstance.cancelledBids(bidder2), 0);
    assert.equal(await contractInstance.bidderCount(), 2);
  });

it("should allow bidders to enter bidding war", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
      );

      // Bidder1 places the first valid bid
      const bid1 = web3.utils.toWei("1.1", "ether");
      await contractInstance.placeBid({ from: bidder1, value: bid1 });
      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.bidderCount(), 1);

      // Bidder2 places the first valid bid
      const bid2 = web3.utils.toWei("1.3", "ether");
      await contractInstance.placeBid({ from: bidder2, value: bid2 });
      assert.equal(await contractInstance.highestBid(), bid2);
      assert.equal(await contractInstance.highestBidder(), bidder2);
      assert.equal(await contractInstance.activeBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 2);

      // Bidder1 overbids Bidder2 bidder
      const overbid1 = web3.utils.toWei("0.5", "ether");
      const newbid1 = web3.utils.toWei("1.6", "ether");;
      await contractInstance.placeBid({ from: bidder1, value: overbid1 });
      assert.equal(await contractInstance.highestBid(), newbid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), newbid1);
      assert.equal(await contractInstance.bidderCount(), 2);

      // Bidder2 overbids Bidder1 bidder
      const overbid2 = web3.utils.toWei("0.5", "ether");
      const newbid2 = web3.utils.toWei("1.8", "ether");;
      await contractInstance.placeBid({ from: bidder2, value: overbid2 });
      assert.equal(await contractInstance.highestBid(), newbid2);
      assert.equal(await contractInstance.highestBidder(), bidder2);
      assert.equal(await contractInstance.activeBids(bidder2), newbid2);
      assert.equal(await contractInstance.bidderCount(), 2);
  });

  /** FAILED CASES */
    it("should not allow place the first smaller than start price", async () => {
      const contractInstance = await AuctionContract.new(
        owner,
        ipfsHash,
        web3.utils.toWei("1.9", "ether"),
        step,
        true,
        startTime,
        endTime
      );

    // Bidder1 tries to place an invalid bid
    const bid1 = web3.utils.toWei("0.9", "ether");
    try {
      await contractInstance.placeBid({
        from: bidder1,
        value: bid1
      });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Bid amount must be greater than start price"), 
             "Expected to fail with: Bid amount must be greater than start price")
    }

  });

  it("should not allow place the subsequent bid smaller that price+step", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      web3.utils.toWei("0.4", "ether"),
      true,
      startTime,
      endTime
    );

    // Place the first legitimate bid
    const bid1 = web3.utils.toWei("1.1", "ether");
    await contractInstance.placeBid({
        from: bidder1,
        value: bid1
      });

    // Bidder2 tries to place an invalid bid
    const bid2 = web3.utils.toWei("1.3", "ether");
    try {
      await contractInstance.placeBid({
        from: bidder2,
        value: bid2
      });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Bid amount must be greater than current amount + step"), 
             "Expected to fail with: Bid amount must be greater than current amount + step");
    }
  });

  it("should not allow OWNER to place a bid", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      startTime,
      endTime
    );

    // Bidder2 tries to place Zero bid
    const bid = 0;
    try {
      await contractInstance.placeBid({
        from: owner,
        value: bid });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Contract owner Cannot perform this action"), 
             "Expected to fail with: Contract owner Cannot perform this action");
    }
  });

  it("should not allow place 0 bid", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      startTime,
      endTime
    );

    // Bidder2 tries to place Zero bid
    const invalidBid2 = 0;
    try {
      await contractInstance.placeBid({
        from: bidder2,
        value: invalidBid2 });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Cannot be an empty bid"), 
             "Expected to fail with: Cannot be an empty bid");
    }
  });

  it("should not allow to place a bid if action is over", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      Math.floor(Date.now() / 1000) - 1200,
      Math.floor(Date.now() / 1000) - 600
    );

    // Bidder2 tries to place Zero bid
    const bid = web3.utils.toWei("1.9", "ether");
    try {
      await contractInstance.placeBid({
        from: bidder2,
        value: bid });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Auction is not in progress"), 
             "Expected to fail with: Auction is not in progress");
    }
  });

  it("should not allow to place a bid if action is cancelled", async () => {
    const contractInstance = await AuctionContract.new(
      owner,
      ipfsHash,
      price,
      step,
      true,
      startTime,
      endTime
    );

    // Cancell Auction
    await contractInstance.cancelAuction({
      from: owner
    })

    // Bidder2 tries to place Zero bid
    const bid = web3.utils.toWei("1.9", "ether");
    try {
      await contractInstance.placeBid({
        from: bidder2,
        value: bid 
      });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.data.stack.includes("Auction is cancelled"), 
             "Expected to fail with: Auction is cancelled");
    }
  });

});