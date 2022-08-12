// Chainlist: https://chainlist.org/

// Chainlink data-feed
// https://docs.chain.link/docs/reference-contracts/
const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x0a87e12689374A4EF49729582B474a1013cceBf8", //chainlink data-feed address
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945", //chainlink data-feed address
    },
    // 31337 hardhat chainId
}

const developementChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developementChains,
    DECIMALS,
    INITIAL_ANSWER,
}
