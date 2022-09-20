import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import { networkConfig } from "../helper-hardhat.config";

export default async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let priceFeedAddress: string = "";

    // Could choose to store the network keys as chainIds and use const ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;

    // if contract does not exist often we will create a mock contract prior to deployment to ensure the other smart contracts can us the address.

    if (chainId === 31337) {
    } else if (chainId === 5) {
        priceFeedAddress = networkConfig.goerli.ethUsdPriceFeed || "";
    } else {
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [priceFeedAddress], // will be the priceFeed address for the chain
    });
    // when going for local host or hardhat network we want ot use a mock
};
