# NFT Words

> Mint your own NFT collection!

This is a buildspace project for generating NFTs. Each NFT is a random 3-word phrase with a random color background. It's a pretty great starter project that teaches you the ropes of NFT development.

The project includes a smart contract written in Solidity and a React-based frontend. Code defaults to Ropsten testnet but also includes Rinkeby (commented out).

## Environment Variables

Create a `.env` file with the constants below. Add the required credentials:

```
REACT_APP_ALCHEMY_RINKEBY_KEY=your-rinkeby-key
REACT_APP_ALCHEMY_ROPSTEN_KEY=your-ropsten-key
REACT_APP_PRIVATE_KEY=your-metamask-private-key
REACT_APP_CONTRACT_ADDR=your-contract-address
REACT_APP_ETHERSCAN_KEY=your-etherscan-key
```

## Built Using

- [React](https://reactjs.org/)
- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [OpenZeppelin](https://openzeppelin.com/)
- [Etherscan](https://etherscan.io/)

## To Do

- [ ] Refactor/cleanup code
- [ ] Allow selecting of network
- [ ] Add deployment instructions

## Acknowledgements

Huge thanks to the [buildspace](https://buildspace.so/) team for creating this awesome tutorial!
