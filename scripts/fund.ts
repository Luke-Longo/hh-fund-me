import { getNamedAccounts, ethers } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding the contract with .1 ether...");
  const sendValue = ethers.utils.parseEther(".1");
  const response = await fundMe.fund({ value: sendValue });
  const receipt = await response.wait(1);
  console.log("Contract funded");
  console.log("Fund Interaction response: ", response);
  console.log("Transaction receipt: ", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
