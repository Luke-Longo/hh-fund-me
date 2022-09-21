import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat.config";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";

describe("FundMe", async function () {
  let fundMe: FundMe;
  let deployer: SignerWithAddress;
  let mockV3Aggregator: MockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async () => {
    // make sure the network is a development chain
    if (!developmentChains.includes(network.name)) {
      throw "you need to be on a development chain to run tests";
    }
    // gets the accounts from the hardhat network
    const accounts = await ethers.getSigners();
    // get the deployer account
    deployer = accounts[0];
    // deploys the contract
    await deployments.fixture("all");
    // gets the deployed contract instance to interact with
    fundMe = await ethers.getContract("FundMe", deployer);
    // gets the deployed mockV3Aggregator instance to interact with
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("Constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      // this function checks the price feed address and makes sure that the address is the same as the moc v3 deploye on the local hardahat network
      const responseAddress = await fundMe.priceFeed();
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
      const response = await fundMe.addressToAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Adds funder to funders array", async function () {
      // we are using the deployer to be the one to interact with the contracts via the ether.getContract function and passing the contract name and the deployer address as the signer
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);
      assert.equal(response, deployer.address);
    });
  });
});
