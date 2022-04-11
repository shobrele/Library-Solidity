// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./LibraryToken.sol";

contract ETHWrapper {

	LibraryToken public LIBToken;

	event LogETHWrapped(address sender, uint256 amount);
	event LogETHUnwrapped(address sender, uint256 amount);

	constructor() {
		LIBToken = new LibraryToken();
	}

	function wrap() public payable {
		require(msg.value > 0, "We need to wrap at least 1 wei");
		//create tokens for sender
		LIBToken.mint(msg.sender, msg.value);
		emit LogETHWrapped(msg.sender, msg.value);
	}

	function unwrap(uint value) public {
		require(value > 0, "We need to unwrap at least 1 wei");
		//transfer weth from sender to this and then burn them
		LIBToken.transferFrom(msg.sender, address(this), value);
		LIBToken.burn(value);
		//send ETH to msg.sender
		payable(msg.sender).transfer(value);
		emit LogETHUnwrapped(msg.sender, value);
	}

	//upon funds receiving trigger the wrapping
	//can only be triggered while sending ETH
	receive() external virtual payable {
		wrap();
	} 

	//triggered in last resort and can be triggered with only data without sendign ETH
	fallback() external virtual payable {
		wrap();
	} 

}