import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert } from "chai";

describe("FundMe", async function () {
    let fundMe: FundMe;
    let deployer;
    let mockV3Aggregator: MockV3Aggregator;
    beforeEach(async () => {
        // gets the accounts from the hardhat network
        const accounts = await ethers.getSigners();
        const accountZero = accounts[0];
        // get the deployer account
        deployer = (await getNamedAccounts()).deployer;
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
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
});
