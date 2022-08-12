// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        (, int256 answer, , , ) = _priceFeed.latestRoundData();
        // ETH/USD rate in 18 digit
        return uint256(answer * 1e10); // 1**10 == 10000000000
    }

    // 1000000000
    // call it get fiatConversionRate, since it assumes something about decimals
    // It wouldn't work for every aggregator
    function getConversionRate(uint256 _ethAmount, AggregatorV3Interface _priceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice(_priceFeed);
        uint256 ethAmountInUsd = (ethPrice * _ethAmount) / 1e18;
        // the actual ETH/USD conversation rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}
