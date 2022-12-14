import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe: FundMe;
      let deployer: SignerWithAddress;
      let mockV3Aggregator: MockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");
      let accounts: SignerWithAddress[];
      let account1: SignerWithAddress;
      beforeEach(async () => {
        // make sure the network is a development chain
        if (!developmentChains.includes(network.name)) {
          throw "you need to be on a development chain to run tests";
        }
        // gets the accounts from the hardhat network
        accounts = await ethers.getSigners();
        // get the deployer account
        deployer = accounts[0];
        // get a second account
        account1 = accounts[1];
        // deploys the contract
        await deployments.fixture("all");
        // gets the deployed contract instance to interact with
        fundMe = await ethers.getContract("FundMe", deployer);
        // gets the deployed mockV3Aggregator instance to interact with
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("Constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
          // this function checks the price feed address and makes sure that the address is the same as the moc v3 deploye on the local hardahat network
          const responseAddress = await fundMe.getPriceFeed();
          assert.equal(responseAddress, mockV3Aggregator.address);
        });
      });
      describe("fund", async function () {
        it("fails if you do not send enough eth", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("updates the amount data structure", async function () {
          await fundMe.fund({
            value: sendValue,
          });
          const response = await fundMe.getAddressToAmountFunded(
            deployer.address
          );
          assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to s_funders array", async function () {
          // we are using the deployer to be the one to interact with the contracts via the ether.getContract function and passing the contract name and the deployer address as the signer
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer.address);
        });
      });
      describe("Withdraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });
        it("allows the owner to withdraw", async function () {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // These provide the same balance
          // const startingFunderBalance = await deployer.getBalance();
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          // Act
          const txRes = await fundMe.withdraw();
          const txReceipt = await txRes.wait(1);
          // Mine const gasCost = txReceipt.gasUsed.mul(txRes.gasPrice as BigNumber);
          // patricks way
          const { gasUsed, effectiveGasPrice } = txReceipt;

          const gasCost = gasUsed.mul(effectiveGasPrice);
          // Assert

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          // can find gasCost with tx Receipt

          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        beforeEach(async () => {
          accounts.forEach(async (account, index) => {
            if (index < 6) {
              await fundMe.connect(account).fund({ value: sendValue });
            }
          });
          const fundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
        });

        it("allows us to withdraw with multiple getFunders", async function () {
          // arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          // act
          const txRes = await fundMe.withdraw();
          const txReceipt = await txRes.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer.address
          );
          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it("prevents any account beside the deployer from initiating the withdraw function", async function () {
          // arranged in before each
          // act & assert
          await expect(fundMe.connect(account1).withdraw()).to.be.reverted;
        });
      });
    });
