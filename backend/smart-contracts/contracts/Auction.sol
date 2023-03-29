// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Auction {

    // Contract consctructor variables
    // ** option to cancel the auction
    // ** option for BuyNow
    // ** option to withdraw the bid
    // ** option to use auction commision

	address public owner;
	uint public startPrice;
	uint public step;
	uint public startTime; 		// all dates must come in UTC
	uint public endTime;		// all dates must come in UTC

	// Contract state variables
	//bool public started;
	// bool public cancelled;

	address highestBidder;
	uint highestBid = 0;
 
	mapping(address=>uint) activeBids;  // <=== Need to figure why I need this

	// Events
	event bidPlaced(address auction, address bidder, uint bid);
	event bidCancelled(address auction, address bidder, uint bid);
	event auctionCancelled(address auction);
	event auctionFinished(address auction);
	event fundsWithdrawn();

	constructor(address _owner, uint _price, uint _step, uint _startTime, uint _endTime){

		//!! add check for dates
		owner = _owner;
		startPrice = _price;
		step = _step;

		startTime = _startTime;		// block.timestamp;
		endTime = _endTime;			// block.timestamp+50000;
	}

	function placeBid() public notOwner payable { // <<=== return auctionInProgress modifier
	
		// Check current bid
		require(msg.value != 0, "Cannot be an empty bid");
		require(msg.sender != address(0), "Must be a legitimate user");	

		// If highestBid is still 0, its the first bid
		if(highestBid == 0){
			highestBid = msg.value;		
			highestBidder = msg.sender;
			activeBids[msg.sender] = msg.value;
		}else{
			// Calculate amount new bid amount
			uint bid = activeBids[msg.sender] + msg.value;
			require(bid >= (highestBid + step), "Bid amount must be greater than current amount + step");
			highestBid = bid;
			highestBidder = msg.sender;
			activeBids[msg.sender] = bid;
		}

		emit bidPlaced(address(this), msg.sender, highestBid);

	}

	function cancelBid() public notOwner auctionInProgress payable {

		emit bidCancelled(address(this), msg.sender, 500);	
	}

	function cancelAuction() public onlyOwner {

		emit auctionCancelled(address(this));
	}

	function finishAuction() public{

		emit auctionFinished(address(this)); 
	}


	function withdrawFunds() public notOwner payable {
		// Only contract 
		emit fundsWithdrawn();	
	}


  	//*** Modifiers
  	modifier onlyOwner {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _; // 
    }
  	

  	modifier notOwner {
        require(msg.sender != owner, "Contract owner Cannot perform this action");
        _; // 
    }

    modifier auctionInProgress {
    	require(startTime <= block.timestamp && endTime >= block.timestamp, 
    		"Auction is not in progress yet");
        _; // 
    }

}
