const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const FundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contract..")
    const transactionResponse = await FundMe.fund({
        value: ethers.utils.parseEther("0.3"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
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
