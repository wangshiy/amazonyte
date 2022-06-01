import { useState, useEffect, createContext, useContext, FC } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import Collections from "src/abis/Collections.json";

const initialState = {
  web3: null,
  account: null,
  collectionsContract: null,
};

const Web3Context = createContext(initialState);

interface IWeb3ProviderProps {
  children: any;
}

export const Web3Provider: FC<IWeb3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [collectionsContract, setCollectionsContract] = useState<any>(null);

  const loadWeb3 = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log("Ethereum successfully detected!", provider);
      const web3 = new Web3(provider as any);
      setWeb3(web3);
    } else {
      console.log("ethereum not connected");
    }
  };

  const loadContracts = async (web3: any) => {
    const networkId = await web3.eth.net.getId();
    // @ts-ignore
    const networkData = Collections.networks![networkId];
    console.log("networkId, networkData", networkId, networkData);
    if (networkData) {
      const address = networkData.address;
      const collectionsAbi = Collections.abi;
      const collectionsContract = new web3.eth.Contract(
        collectionsAbi,
        address
      );
      setCollectionsContract(collectionsContract);
    } else {
      console.log("smart contract not deployed");
    }
  };

  const connectMetaMask = async (web3: any) => {
    let accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    if (accounts.length === 0) {
      console.log("User is not logged in to MetaMask");
      try {
        // @ts-ignore
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } catch (error: any) {
        if (error.code === 4001) {
          // User rejected request
          console.log("User rejected request");
        }
      }
    }
    setAccount(accounts?.[0]);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      connectMetaMask(web3);
      loadContracts(web3);
    }
  }, [web3]);
  return (
    <Web3Context.Provider value={{ web3, account, collectionsContract }}>
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = () => {
  const context = useContext<any>(Web3Context);

  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export default useWeb3;
