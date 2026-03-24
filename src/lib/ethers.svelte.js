import { ethers } from "ethers";

let provider = $state(null);
let signer = $state(null);
let signerAddress = $state("");

export function getEthersState() {
  return {
    get provider() {
      return provider;
    },
    get signer() {
      return signer;
    },
    get signerAddress() {
      return signerAddress;
    },
  };
}

export async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await browserProvider.getSigner();

      provider = browserProvider;
      signer = newSigner;
      signerAddress = await newSigner.getAddress();
    } catch (error) {
      console.error("User rejected the request.");
    }
  } else {
    alert("Please install a web3 wallet like MetaMask.");
  }
}

export function disconnectWallet() {
  provider = null;
  signer = null;
  signerAddress = "";
}
