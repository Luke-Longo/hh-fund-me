import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert } from "chai";

describe("FundMe", async function () {
    let fundMe: FundMe;
    let deployer;
    let mockV3Aggregator: MockV3Aggregator;
    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        const accountZero = accounts[0];
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });
    describe("Constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
});
