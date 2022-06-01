import PageLayout from "src/components/layout/index";
import "./App.css";
import { Web3Provider } from "./contexts/web3-context";

const App = () => {
  return (
    <Web3Provider>
      <div className="App">
        <PageLayout />
      </div>
    </Web3Provider>
  );
};

export default App;
