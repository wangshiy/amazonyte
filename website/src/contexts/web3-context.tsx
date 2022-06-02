import {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
  useCallback,
} from "react";
import { Notification } from "@arco-design/web-react";
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
      Notification.error({ content: "Ethereum not connected" });
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
      Notification.error({ content: "Smart contract not deployed" });
    }
  };

  const connectMetaMask = async () => {
    let accounts = [];
    try {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (error: any) {
      Notification.error({ content: error.message });
    }
    setAccount(accounts?.[0]);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  const handleAccountsChanged = useCallback(
    async (accounts: any) => {
      console.log("handleAccountsChanged", accounts);
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        setAccount(null);
        await connectMetaMask();
      } else if (accounts[0] !== account) {
        setAccount(accounts?.[0]);
      }
    },
    [web3]
  );

  const handleChainChanged = useCallback(
    (_chainId: any) => {
      console.log("_chainId", _chainId);
      window.location.reload();
    },
    [web3]
  );

  useEffect(() => {
    if (web3) {
      connectMetaMask();
      loadContracts(web3);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleAccountsChanged);
    };
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
