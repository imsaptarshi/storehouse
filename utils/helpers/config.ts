import abi from "../../contracts/storehouse/abi.json"

const config = {
    title: "Storehouse",
    description: "Secure cloud storage on-chain",
    chainId: 80001,
    maxFileSize: 8388608,
    storehouse: {
        address: "0xc64a998AB01e1401181726cfd55831b9648fB522",
        abi: abi
    }
}

export default config;