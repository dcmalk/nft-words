import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import twitterLogo from './assets/twitter-logo.svg';
import './styles/App.css';

import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDR;
const TWITTER_HANDLE = 'dcmalk';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [maxMint, setMaxMint] = useState(0);
  const [mintCount, setMintCount] = useState(0);
  const [chainSupported, setChainSupported] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
      checkIfChainIsSupported();

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
    } else {
      console.log('No authorized account found');
    }
  };

  const checkIfChainIsSupported = async () => {
    try {
      const { ethereum } = window;

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain ' + chainId);

      // ChainId 4 = Rinkeby, 3 = Ropsten
      if (chainId !== '0x3') {
        setChainSupported(false);
        toast.error('Please connect to the Ropsten Test Network');
      } else {
        setChainSupported(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.error('This app requires MetaMask');
        return;
      }

      // Request access to account.
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      checkIfChainIsSupported();

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalNFTsMinted = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        const count = await connectedContract.getTotalNFTsMintedSoFar();
        setMintCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // Get max supply and mint count.
        const supply = await connectedContract.MAX_MINT();
        setMaxMint(supply.toNumber());
        getTotalNFTsMinted();

        // This will essentially "capture" our event when our contract throws it (similar to webhooks).
        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          getTotalNFTsMinted();
          toast((t) => (
            <div>
              <p>Hey there! We've minted your NFT and sent it to your wallet.</p>
              <p> It may be blank right now. It can take a max of 10 min to show up on OpenSea.</p>
              <button
                className="cta-button connect-wallet-button"
                onClick={() =>
                  //window.open(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`, '_blank').focus()
                  window.open(`https://ropsten.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`, '_blank').focus()
                }
              >
                Show me my NFT!
              </button>
            </div>
          ));
          setIsMinting(false);
        });

        console.log('Setup event listener!');
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log('Going to pop wallet now to pay gas...');
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setIsMinting(true);

        console.log('Mining...please wait.');
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://ropsten.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
        setIsMinting(false);
      }
    } catch (error) {
      console.log(error);
      setIsMinting(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <>
      {mintCount === maxMint ? (
        <p className="gradient-text">Sorry, all NFTs have been minted!</p>
      ) : (
        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      )}
      <p className="sub-text">
        {mintCount} of {maxMint} available NFTs minted
      </p>
    </>
  );

  return (
    <div className="App">
      <Toaster position="top-right" toastOptions={{ /*duration: 30000,*/ style: { margin: '0 16px 16px 0' } }} />
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">Each unique. Each beautiful. Discover your NFT today.</p>
          {currentAccount === '' || !chainSupported ? renderNotConnectedContainer() : renderMintUI()}
          {isMinting ? (
            <>
              <img src="https://i.giphy.com/media/3orifbi68gpoinx59m/giphy.webp" alt="monkeys mining" style={{ marginTop: '40px' }} />
              <p className="sub-text">Mining in progress...</p>
            </>
          ) : (
            ''
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`more like this @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
