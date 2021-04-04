import React, {useEffect,useState,useCallback,useRef} from 'react';
import MagnetLinkBillboard from '../abis/MagnetLinkBillboard'
import Web3 from "web3";
import AddressBar from "./AddressBar";
import MagnetLinkList from "./MagnetLinkList";


function App() {
   const [currentAccount,setCurrentAccount]=useState(null)
  const [deployedContract,setDeployedContract]=useState(null)
  const inputSeedName = useRef(null);
  const inputSeedLink = useRef(null);
  const inputKeyWords = useRef(null);
  const inputChargeAmount = useRef(null);
  const inputSeedDescription = useRef(null);


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
      const transactionCount= await web3.eth.getTransactionCount(networkData.address)
      console.log("transactionCount")
      console.log(transactionCount)


  }
  const uploadSeedToContract= useCallback(async ()=>{

      const web3 = window.web3;

    let seedName=inputSeedName.current.value
    let seedLink=inputSeedLink.current.value

    let keyWords=inputKeyWords.current.value
    let chargeAmount=inputChargeAmount.current.value
    let seedDescription=inputSeedDescription.current.value


    let uploadHandler=await deployedContract.methods.upload(seedName, seedLink, keyWords, chargeAmount, seedDescription)

    const gasAmount = await uploadHandler.estimateGas({from: currentAccount})
    const gasPrice=await web3.eth.getGasPrice()
      console.log(gasPrice*1.01)
    uploadHandler.send({from: currentAccount, gas: gasAmount,gasPrice:gasPrice*1.01})
        .once('receipt', async (receipt)=> {

          console.log(receipt)
        })


  },[currentAccount,deployedContract])





    return (
        <div>
          <AddressBar account={currentAccount}></AddressBar>
          <MagnetLinkList deployedContract={deployedContract} account={currentAccount}></MagnetLinkList>
          seedName: <input  ref={inputSeedName}/><br/>
          seedLink: <input ref={inputSeedLink}/><br/>
          KeyWords: <input ref={inputKeyWords}/><br/>
          ChargeAmount: <input value="0" ref={inputChargeAmount}/><br/>
          SeedDescription: <input ref={inputSeedDescription}/><br/>


          <button onClick={uploadSeedToContract}>upload</button>





        </div>
    );
};

export default App;