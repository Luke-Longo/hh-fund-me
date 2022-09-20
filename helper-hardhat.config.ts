export interface NetworkConfigItem {
    ethUsdPriceFeed?: string;
    blockConfirmations?: number;
}

export interface NetworkConfigInfo {
    [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
    goerli: {
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        blockConfirmations: 6,
    },
    hardhat: {},
    localhost: {},
    polygon: {
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        blockConfirmations: 6,
    },
};

export const developmentChains = ["hardhat", "localhost"];

export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
