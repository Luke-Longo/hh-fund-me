import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import { networkConfig, developmentChains } from "../helper-hardhat.config";
import { verify } from "../utils/verify";

const deployFundMe = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const name = network.name;
    let ethUsdPriceFeedAddress: string = "";

    // Could choose to store the network keys as chainIds and use const ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;

    // if contract does not exist often we will create a mock contract prior to deployment to ensure the other smart contracts can us the address.

    if (chainId === 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
        log("Local network detected, setting MockV3Aggregator address");
    } else if (chainId === 5) {
        ethUsdPriceFeedAddress = networkConfig.goerli.ethUsdPriceFeed || "";
    } else {
    }

    // this below will deploy the fundMe contract and any contract dependencies to the desired chainId/network being used. Once deployed you will be able to interact with the contract
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args, // will be the priceFeed address for the chain
        log: true,
        waitConfirmations: networkConfig[name].blockConfirmations || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
        log(`FundMe deployed to: ${fundMe.address}`);
        log("--------------------------------");
        // when going for local host or hardhat network we want ot use a mock
    } else {
        log(`Local network detected, deployed to address ${fundMe.address}`);
        log("--------------------------------");
    }
};

export default deployFundMe;

deployFundMe.tags = ["all", "fundMe"];
