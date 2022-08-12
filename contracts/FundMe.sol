// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.9;
// Imports
import "hardhat/console.sol";
import "./PriceConverter.sol";
// Error Codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts

// NatSpec
/// @title A contract for crowdfunding
/// @author Martin Capovcak
/// @notice This contract is to demo a sample funding contract
/// @dev This implements price feeds as our library
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address _priceFeed) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /// @notice This function fund this contract
    /// @dev This implements price feeds as our library
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function widraw() public payable onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            addressToAmountFunded[funders[i]] = 0;
        }

        funders = new address[](0);

        payable(msg.sender).transfer(address(this).balance);
    }
}
