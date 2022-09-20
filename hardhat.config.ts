import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";

const developmentChains = ["hardhat", "localhost"];

const ALCHEMY_GOERLI_URL = process.env.ALCHEMY_GOERLI_URL || "";
const ALCHEMY_PRIVATE_KEY = process.env.ALCHEMY_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: ALCHEMY_GOERLI_URL,
            accounts: [ALCHEMY_PRIVATE_KEY!],
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    solidity: "0.8.8",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
};

export default config;
