//const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
//const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async () => {
    /*
    async function deployedContract() {
        const sendValue = ethers.utils.parseEther("1") // 1ETH or 1000000000000000000 wei

        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        //const [deployer, superCoder] = await ethers.getSigners()
        const { deployer, superCoder } = await getNamedAccounts()
        await deployments.fixture(["all"])
        const FundMe = await ethers.getContract("FundMe", deployer)
        const MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)

        return { deployer, superCoder, FundMe, MockV3Aggregator, sendValue }
    }
    */
    let FundMe
    let MockV3Aggregator
    let deployer
    const sendValue = ethers.utils.parseEther("1") // 1ETH or 1000000000000000000 wei
    beforeEach(async () => {
        //{ deployer, superCoder } = await getNamedAccounts()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        FundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async () => {
        it("Should set the right owner", async () => {
            //const { FundMe, deployer } = await loadFixture(deployedContract)

            const response = await FundMe.getOwner()
            expect(response, deployer.address)
        })
        it("Sets the aggregator addresses correctly", async () => {
            //const { FundMe, MockV3Aggregator } = await loadFixture(deployedContract)

            const response = await FundMe.getPriceFeed()
            await assert.equal(response, MockV3Aggregator.address)
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            //const { FundMe } = await loadFixture(deployedContract)

            await expect(FundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        })

        it("Updates the amount funded data structure", async () => {
            //const { FundMe, deployer, sendValue } = await loadFixture(deployedContract)

            await FundMe.fund({ value: sendValue })
            const response = await FundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("Adds funder to an array of getFunder", async () => {
            await FundMe.fund({ value: sendValue })
            const funder = await FundMe.getFunder(0)
            expect(funder, deployer)
        })
    })

    describe("widraw", async () => {
        beforeEach(async () => {
            await FundMe.fund({ value: sendValue })
        })

        it("widraw ETH from a single founder", async () => {
            // Arrange
            const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerBalance = await FundMe.provider.getBalance(deployer)
            // Act
            const transactionResponse = await FundMe.widraw()
            const transactionReceipt = await transactionResponse.wait(1)

            // Gascost
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const endingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Assert
            expect(endingFundMeBalance, 0)
            expect(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("allows us to widraw with multiple getFunder", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await FundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await FundMe.widraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const endingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Assert
            expect(endingFundMeBalance, 0)
            expect(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            // Make sure getFunder are reset propperly
            await expect(FundMe.getFunder(0)).to.be.reverted

            for (let i; i < 6; i++) {
                expect(await FundMe.getAddressToAmountFunded(accounts[i].address), 0)
            }
        })

        it("Only allows the owner to widraw", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await FundMe.connect(attacker)
            await expect(attackerConnectedContract.widraw()).to.be.reverted
        })
    })

    describe("widraw-cheeper", async () => {
        beforeEach(async () => {
            await FundMe.fund({ value: sendValue })
        })

        it("widraw ETH from a single founder", async () => {
            // Arrange
            const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerBalance = await FundMe.provider.getBalance(deployer)
            // Act
            const transactionResponse = await FundMe.cheeperWidraw()
            const transactionReceipt = await transactionResponse.wait(1)

            // Gascost
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const endingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Assert
            expect(endingFundMeBalance, 0)
            expect(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("allows us to widraw with multiple getFunder", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await FundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await FundMe.cheeperWidraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
            const endingDeployerBalance = await FundMe.provider.getBalance(deployer)

            // Assert
            expect(endingFundMeBalance, 0)
            expect(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            // Make sure getFunder are reset propperly
            await expect(FundMe.getFunder(0)).to.be.reverted

            for (let i; i < 6; i++) {
                expect(await FundMe.getAddressToAmountFunded(accounts[i].address), 0)
            }
        })

        it("Only allows the owner to widraw", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await FundMe.connect(attacker)
            await expect(attackerConnectedContract.cheeperWidraw()).to.be.reverted
        })
    })
})
