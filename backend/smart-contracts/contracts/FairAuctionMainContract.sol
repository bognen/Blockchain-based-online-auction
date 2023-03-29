// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Auction.sol";

// The contract will serve as an entry point. It is
// - deployed on the startup.
// - responsible for creating auctions
// - responsible for adding auctions to auction array

contract FairAuctionMainContract {

	Auction[] public auctions;
	event auctionCreated(address auctionAddress, address owner);

	function createAuction(uint _price, uint _step, uint _startTime, uint _endTime) external returns(address) {

		Auction a = new Auction(msg.sender, _price, _step, _startTime, _endTime);
		require(address(a) != address(0), "Failed to create auction");
		auctions.push(a);
		emit auctionCreated(address(a), msg.sender);
		return address(a);
	}


	function getAuctions() public view returns (Auction[] memory){
		return auctions;
	}

}

// We need to have ability to:
// 1. Get all running contracts
// 2. Get info about any given auction (address)
// 3. Get info about all auctions an address participating