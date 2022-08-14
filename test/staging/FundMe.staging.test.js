const { getNamedAccounts, ethers, network } = require("hardhat")
const { developementChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developementChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let FundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.3")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              FundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async () => {
              await FundMe.fund({ value: sendValue })
              await FundMe.withdraw()

              const endingBalance = await FundMe.provider.getBalance(FundMe.address)
              assert.equal(endingBalance.toString(), "0")
          })
      })
