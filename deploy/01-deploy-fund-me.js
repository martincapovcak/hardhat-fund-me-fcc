// dependencies
const { getNamedAccounts, deployments, network } = require("hardhat")
require("dotenv").config

// imports
const { networkConfig, developementChains } = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    //console.log("\n\n@ Spinning-up contract deploy..")
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log("->")
    log("-> network name: ", network.name)
    log("-> network id: ", chainId)
    log("-> price-feed address processing..")

    // programaticaly accessing Chainlink oracle price-feed based on a chain we are going to deploy to
    // if the contract doesn't exist, we deploy a minimal version "Mock" for a local testnet
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // when going for localhost or hardhat network we want to use a mock
    log("-> Deploying contract..")
    log("--------------------------------------------------------")
    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: [ethUsdPriceFeedAddress], //price-feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("--------------------------------------------------------")
    log("-> Contract deployed!\n")

    // verification
    if (!developementChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}
module.exports.tags = ["all", "fundme"]
