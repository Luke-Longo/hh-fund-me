import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId: number = network.config.chainId;
};
