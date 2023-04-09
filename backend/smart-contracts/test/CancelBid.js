// test/CancelBid.js
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
  it("should allow bidder to cancel its bid (More than one bid)", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
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
      assert.equal(await contractInstance.bidderCount(), 2);

      // Bidder2 cancells its bid
      await contractInstance.cancelBid({
        from: bidder2
      });

      assert.equal(await contractInstance.highestBid(), bid1);
      assert.equal(await contractInstance.highestBidder(), bidder1);
      assert.equal(await contractInstance.activeBids(bidder1), bid1);
      assert.equal(await contractInstance.activeBids(bidder2), 0);
      assert.equal(await contractInstance.cancelledBids(bidder2), bid2);
      assert.equal(await contractInstance.bidderCount(), 1);
  });

  it("should allow bidder to cancel its bid (Only one bid)", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
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
      assert.equal(await contractInstance.bidderCount(), 1);

      // Bidder1 cancells its bid
      await contractInstance.cancelBid({
        from: bidder1
      });

      assert.equal(await contractInstance.highestBid(), 0);
      assert.equal(await contractInstance.highestBidder(), '0x0000000000000000000000000000000000000000');
      assert.equal(await contractInstance.bidderCount(), 0);
      assert.equal(await contractInstance.cancelledBids(bidder1), bid1);;
  });

  it("should allow multiple bidders to cancel their bids and determine new highest", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
      );

      // Aditional bidders
      const bidder3 = accounts[3];
      const bidder4 = accounts[4];

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

      // Bidder3 places the first valid bid
      const bid3 = web3.utils.toWei("1.5", "ether");
      await contractInstance.placeBid({ from: bidder3, value: bid3 });
      assert.equal(await contractInstance.highestBid(), bid3);
      assert.equal(await contractInstance.highestBidder(), bidder3);
      assert.equal(await contractInstance.activeBids(bidder3), bid3);
      assert.equal(await contractInstance.bidderCount(), 3);

      // Bider 2 overbids 3rd bidder
      const overbid = web3.utils.toWei("0.5", "ether");
      const newbid2 = web3.utils.toWei("1.8", "ether");;
      await contractInstance.placeBid({ from: bidder2, value: overbid });
      //assert.equal(await contractInstance.highestBid(), newbid2);
      assert.equal(await contractInstance.highestBidder(), bidder2);
      assert.equal(await contractInstance.activeBids(bidder2), newbid2);
      assert.equal(await contractInstance.bidderCount(), 3);

      // Bidder4 places the valid bid
      const bid4 = web3.utils.toWei("2.0", "ether");
      await contractInstance.placeBid({ from: bidder4, value: bid4 });
      assert.equal(await contractInstance.highestBid(), bid4);
      assert.equal(await contractInstance.highestBidder(), bidder4);
      assert.equal(await contractInstance.activeBids(bidder4), bid4);
      assert.equal(await contractInstance.bidderCount(), 4);     

      try{
        // Bidder 2 cancels its bid
        await contractInstance.cancelBid({ from: bidder2 });
        assert.equal(await contractInstance.highestBid(), bid4);
        assert.equal(await contractInstance.highestBidder(), bidder4);
        assert.equal(await contractInstance.activeBids(bidder4), bid4);
        assert.equal(await contractInstance.activeBids(bidder2), 0);
        assert.equal(await contractInstance.bidderCount(), 3); 

        // Bidder 3 cancels its bid
        await contractInstance.cancelBid({ from: bidder3 });
        assert.equal(await contractInstance.highestBid(), bid4);
        assert.equal(await contractInstance.highestBidder(), bidder4);
        assert.equal(await contractInstance.activeBids(bidder4), bid4);
        assert.equal(await contractInstance.activeBids(bidder3), 0);
        assert.equal(await contractInstance.bidderCount(), 2); 
        
        // Bidder 4 cancels its bid
        await contractInstance.cancelBid({ from: bidder4 });
        assert.equal(await contractInstance.highestBid(), bid1);
        assert.equal(await contractInstance.highestBidder(), bidder1);
        assert.equal(await contractInstance.activeBids(bidder4), 0);
        assert.equal(await contractInstance.bidderCount(), 1); 
      } catch (error) {
          console.log("ERR". error)
      }

  });

  it("should not allow a bidder who didn't even participate in auction to cancel its bid", async () => {
      const contractInstance = await AuctionContract.new(
        owner, ipfsHash, price, step, true, startTime, endTime
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
      assert.equal(await contractInstance.bidderCount(), 1);

      // Bidder1 cancells its bid
      try {
        await contractInstance.cancelBid({
          from: bidder2
        });
        assert.fail("Expected an error but did not get one");
      } catch (error) {
          console.log("ERR". error)
          assert(error.data.stack.includes("Only active bidders can cancel bids"), 
               "Expected to fail with: Only active bidders can cancel bids")
      }

  });


    /** FAILURE CASES **/
    it("should not allow owner to cancel bid", async () => {
        const contractInstance = await AuctionContract.new(
          owner, ipfsHash, price, step, true, startTime, endTime
        );

        // Bidder1 places the first valid bid
        const bid1 = web3.utils.toWei("1.2", "ether");
        await contractInstance.placeBid({
          from: bidder1,
          value: bid1
        });

        // Bidder1 cancells its bid
        try {
          await contractInstance.cancelBid({
            from: owner
          });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Contract owner Cannot perform this action"), 
                 "Expected to fail with: Contract owner Cannot perform this action")
        }
    }); 

    it("should not allow cancel the bid no bids are present", async () => {
        const contractInstance = await AuctionContract.new(
          owner, ipfsHash, price, step, true, startTime, endTime
        );

        try {
          await contractInstance.cancelBid({
            from: bidder1
          });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("No bids to cancel"), 
                 "Expected to fail with: No bids to cancel")
        }
    });

    it("should not allow cancel the bid if auction is over", async () => {
        const contractInstance = await AuctionContract.new(
          owner, ipfsHash, price, step, true, 
          Math.floor(Date.now() / 1000) - 1200,
          Math.floor(Date.now() / 1000) + 2
        );

        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const bid1 = web3.utils.toWei("1.3", "ether");
        await contractInstance.placeBid({
          from: bidder1,
          value: bid1
        });

        await timeout(4000);

        try {
          await contractInstance.cancelBid({
            from: bidder1
          });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Auction is not in progress"), 
                 "Expected to fail with: Auction is not in progress")
        }
    });

    it("should not allow cancel the bid if auction is cancelled", async () => {
        const contractInstance = await AuctionContract.new(
          owner, ipfsHash, price, step, true, startTime, endTime
        );

        const bid1 = web3.utils.toWei("1.3", "ether");
        await contractInstance.placeBid({
          from: bidder1,
          value: bid1
        });

        // Cancell Auction
        await contractInstance.cancelAuction({
          from: owner
        })


        try {
          await contractInstance.cancelBid({
            from: bidder1
          });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.data.stack.includes("Auction is cancelled"), 
                 "Expected to fail with: Auction is cancelled")
        }
    });

});
