const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const FundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding..")
    const transactionResponse = await FundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Got it back!")
}

//async runMain
const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

//runMain
runMain()
