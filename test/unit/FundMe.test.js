const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developementChains } = require("../../helper-hardhat-config")

!developementChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let FundMe
          let MockV3Aggregator
          let deployer
          const sendValue = ethers.utils.parseEther("0.1") // 1ETH or 1_000000000000000000 wei
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              FundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
          })

          describe("constructor", async () => {
              it("Should set the right owner", async () => {
                  const response = await FundMe.getOwner()
                  expect(response, deployer.address)
              })
              it("Sets the aggregator addresses correctly", async () => {
                  const response = await FundMe.getPriceFeed()
                  await assert.equal(response, MockV3Aggregator.address)
              })
          })

          describe("fund", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(FundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
              })

              it("Updates the amount funded data structure", async () => {
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

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await FundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async () => {
                  // Arrange
                  const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance = await FundMe.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await FundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Gas-cost
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

              it("allows us to withdraw with multiple getFunder", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await FundMe.connect(accounts[i])
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance = await FundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await FundMe.withdraw()
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

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await FundMe.connect(attacker)
                  await expect(attackerConnectedContract.withdraw()).to.be.reverted
              })
          })

          describe("withdraw-cheeper", async () => {
              beforeEach(async () => {
                  await FundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async () => {
                  // Arrange
                  const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance = await FundMe.provider.getBalance(deployer)
                  // Act
                  const transactionResponse = await FundMe.cheeperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Gas-cost
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

              it("allows us to withdraw with multiple getFunder", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await FundMe.connect(accounts[i])
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance = await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance = await FundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await FundMe.cheeperWithdraw()
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

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await FundMe.connect(attacker)
                  await expect(attackerConnectedContract.cheeperWithdraw()).to.be.reverted
              })
          })
      })
