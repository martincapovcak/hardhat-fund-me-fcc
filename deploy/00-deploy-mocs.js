// dependencies
const { network } = require("hardhat")

//imports
const { developementChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config.js")

module.exports = async (hre) => {
    //console.log("\n\n@ Spinning-up Mock..")
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //console.log("->")

    if (developementChains.includes(network.name)) {
        log("-> Local network detected!")
        log("-> Deploying mocs..")
        log("--------------------------------------------------------")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("--------------------------------------------------------")
        log("-> Mocks deployed!\n")
    }
}

module.exports.tags = ["all", "mocks"]
