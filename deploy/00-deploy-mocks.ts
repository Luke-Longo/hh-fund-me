import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import { DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/types";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (chainId === 31337) {
    log("Local network detected, Deploying Mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed");
    log("--------------------------------");
  }
};

export default deployMocks;

deployMocks.tags = ["all", "mocks"];
