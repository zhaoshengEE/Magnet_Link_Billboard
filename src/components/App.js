import React, {useEffect,useState,useCallback} from 'react';
import MagnetLinkBillboard from '../abis/MagnetLinkBillboard'
import Web3 from "web3";
import AddressBar from "./AddressBar";
import MagnetLinkList from "./MagnetLinkList";

function App() {
   const [currentAccount,setCurrentAccount]=useState(null)
  const [deployedContract,setDeployedContract]=useState(null)


  useEffect( ()=>{
    (async ()=>{
      await getWeb3ProviderAndWebSocket()
      await connectToContract()
    })()
  },[])

  async function getWeb3ProviderAndWebSocket(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    window.web3Socket = new Web3("wss://rinkeby.infura.io/ws/v3/4770b93234ff418e8c15c8f67b45d41a");
    if(!window.web3Socket){
      window.alert('Please make sure your wss copied from Infura is correct.')
    }
  }

  async function connectToContract(){
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0]);
    const networkId = await web3.eth.net.getId()
    const networkData = MagnetLinkBillboard.networks[networkId];
    if(networkData) {
      const deployedContractTemp = new web3.eth.Contract(MagnetLinkBillboard.abi, networkData.address);
      setDeployedContract(()=>deployedContractTemp)
    }
  }






    return (
        <div>
          <AddressBar account={currentAccount}></AddressBar>
          <MagnetLinkList deployedContract={deployedContract} account={currentAccount}></MagnetLinkList>




        </div>
    );
};

export default App;