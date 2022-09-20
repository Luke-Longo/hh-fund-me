import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import { networkConfig } from "../helper-hardhat.config";

export default async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let priceFeedAddress: string = "";
};
