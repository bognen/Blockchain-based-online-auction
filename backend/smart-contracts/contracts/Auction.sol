// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Auction {

    // Possible options to extend functionality
    // ** option for BuyNow
    // ** option to use auction commision

    // Contract costructor variables
	address public owner;
	string public ipfsHash;
	uint public startPrice;
	uint public step;
	bool public promoted;
	uint public startTime; 		// all dates must come in UTC
	uint public endTime;		// all dates must come in UTC

	// Contract state variables
	bool public cancelled = false;
	address public highestBidder;
	uint public highestBid = 0;
 	uint public bidderCount = 0;

 	// Contract mappings
	mapping(address=>uint) public activeBids;   
	mapping(address=>uint) public cancelledBids;

	// Bidding history
	uint bidderHistoryCount = 0;
	mapping(uint=>address) bidHistory;

	// Events
	event bidPlaced(address _auction, address _bidder, uint _highestBid, uint _bidderCount);
	event bidCancelled(address _auction, address _bidder, uint _highestBid, uint _bidderCount);
	event auctionCancelled(address _auction, uint _auctionBalance);
	event auctionFinished(address _auction, address _winner, uint _finalPrice, uint _auctionBalance);
	event fundsWithdrawn(address _auction, address _bidder, uint _amount, uint _auctionBalance);

	constructor(address _owner, string memory _ipfsHash, uint _price, uint _step, bool _promoted, uint _startTime, uint _endTime){
		owner = _owner;
		ipfsHash = _ipfsHash;
		startPrice = _price;
		step = _step;
		promoted = _promoted;
		startTime = _startTime;		
		endTime = _endTime;			
	}

	function placeBid() public notOwner auctionInProgress notCancelled payable { 
	
		// Check current bid
		require(msg.value != 0, "Cannot be an empty bid");
		require(msg.sender != address(0), "Must be a legitimate user");	

		// If highestBid is still 0, its the first bid
		if(highestBid == 0){
			require(msg.value >= startPrice, "Bid amount must be greater than start price");
			highestBid = msg.value;		
			highestBidder = msg.sender;
			activeBids[msg.sender] = msg.value;
			bidderCount++;
		}else{
			// Calculate amount new bid amount
			uint bid = activeBids[msg.sender] + msg.value;
			require(bid > (highestBid + step), "Bid amount must be greater than current amount + step");
			// Save the previsous bid
			// Set new values for bidders
			highestBid = bid;
			highestBidder = msg.sender;
			if(activeBids[msg.sender] == 0) bidderCount++;
			activeBids[msg.sender] = bid;			
		}
		// Save bidding historical aspect
		bidderHistoryCount++;
		bidHistory[bidderHistoryCount] = msg.sender;	

		emit bidPlaced(address(this), msg.sender, highestBid, bidderCount); 
	}

	function cancelBid() public notOwner auctionInProgress notCancelled payable {

		require(bidderCount > 0, "No bids to cancel");
		require(activeBids[msg.sender]>0, "Only active bidders can cancel bids");
		require(msg.sender != address(0), "Must be a legitimate user");	

		if(msg.sender == highestBidder && bidderCount == 1){		
			// simply return it to start price
			highestBidder = address(0);
			highestBid = 0;
		}else if(msg.sender == highestBidder){
			(highestBidder, highestBid) = getNewHighestBid(bidderHistoryCount);
		}

  		cancelledBids[msg.sender] = activeBids[msg.sender];
		delete activeBids[msg.sender];
		bidderCount--;
		emit bidCancelled(address(this), msg.sender, highestBid, bidderCount);	
	}

	function cancelAuction() public onlyOwner {
		cancelled=true;
		emit auctionCancelled(address(this), address(this).balance);
	}

	function finishAuction() public onlyOwner{
		require(endTime <= block.timestamp, "Auction cannot be finished before its end time");
		emit auctionFinished(address(this), highestBidder, activeBids[highestBidder], address(this).balance); 
	}

	// Have to handle cases:
	// 1. Cancelled by owner
	// 2. Owner withdraws funds
	// 3. Participants withdraw funds
	function withdrawFunds() public inactiveAuction payable returns(bool success) {  
		
		address recipientAccount;
        uint recipientAmount;

		if(cancelled){
			require(activeBids[msg.sender] > 0, "Only active bidders can withdraw funds");
			recipientAccount = msg.sender;
			recipientAmount = activeBids[msg.sender];
		} else{
			// If the bid is was can
			if(msg.sender == owner){
				recipientAccount = owner;
				recipientAmount = highestBid;
			}else{
				require(msg.sender != highestBidder, "The winner cannot withdraw funds");
				recipientAccount = msg.sender;
				recipientAmount = activeBids[msg.sender];
			}			
		}

		if (recipientAmount == 0) revert("Amount must be non-zero value");

		address payable payableRecipientAccount = payable(recipientAccount);
		if (!payableRecipientAccount.send(recipientAmount)) revert("Fund transfer has failed");
 		delete activeBids[msg.sender];

		emit fundsWithdrawn(address(this), recipientAccount, recipientAmount, address(this).balance);	
		return true;
	}

	function withdrawFundsCancelledBid() public notOwner payable returns(bool success) {
		address recipientAccount = msg.sender;
        uint recipientAmount = cancelledBids[recipientAccount];

		if (recipientAmount == 0) revert("Amount must be non-zero value");
		
		address payable payableRecipientAccount = payable(recipientAccount);
        if (!payableRecipientAccount.send(recipientAmount)) revert("Fund transfer has failed");
 		delete cancelledBids[recipientAccount];

		emit fundsWithdrawn(address(this), recipientAccount, recipientAmount, address(this).balance);	
		return true;
	}

	// Helper function. Can be invoked only when msg.sender == highestBidder
	// The function cannpot be called if there less than two active bidders
	// _order should correspond to the current highest bid
	function getNewHighestBid(uint _order) private view returns (address newHighestBidder, uint newHighestBid) {
		
		address historicalBidder =  bidHistory[_order-1];
		if(activeBids[historicalBidder] > 0) return (historicalBidder, activeBids[historicalBidder]); 	
		else getNewHighestBid(_order-1);  
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
    		"Auction is not in progress");
        _; // 
    }

    modifier notCancelled {
    	require(!cancelled, "Auction is cancelled");
        _; // 
    }

    modifier inactiveAuction {
    	require(block.timestamp >= endTime || cancelled, "Auction is still active");
        _; // 
    }

}
