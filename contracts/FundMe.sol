// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public adressToAmountFunded;

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only owner can do this.");
        _;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Didn't send enough!");
        funders.push(msg.sender);
        adressToAmountFunded[msg.sender] = msg.value;
    }

    function widraw() public onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            adressToAmountFunded[funders[i]] = 0;
        }

        funders = new address[](0);

        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
