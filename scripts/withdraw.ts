import { getNamedAccounts, ethers } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing the balance from the contract");
  const tx = await fundMe.withdraw();
  const receipt = await tx.wait(1);
  console.log("Funds withdrawn");
  console.log("Withdraw Interaction response: ", tx);
  console.log("Transaction receipt: ", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
