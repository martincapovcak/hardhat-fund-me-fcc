// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        (, int256 answer, , , ) = _priceFeed.latestRoundData();
        // ETH in terms of USD
        // 2000_00000000 - 8 decimals digit
        // ETH/USD rate in 18 digit
        return uint256(answer * 1e10); // returning 18digit uint now
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
        // 2000_000000000000000000 = ETH / USD price
        // 1_000000000000000000 ETH
        uint256 ethAmountInUsd = (ethPrice * _ethAmount) / 1e18;
        // the actual ETH/USD conversation rate, after adjusting the extra 0s.

        return ethAmountInUsd;
    }
}
