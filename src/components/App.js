import React, {useEffect,useState,useCallback,useRef} from 'react';
import MagnetLinkBillboard from '../abis/MagnetLinkBillboard'
import Web3 from "web3";
import AddressBar from "./AddressBar";
import MagnetLinkList from "./MagnetLinkList";
import Download from './Download';
import Upload from "./Upload";
import {Link,Route,Switch} from 'react-router-dom';


export const AppContext=React.createContext({})

function App() {


    /*
       seedInfos: [
          {
              seedName: seedName1111
              keyWords: keyWords9999
              chargeAmount: 0
              seedId: 1
              endorseAmount: 12
              seedOwner: 0x345345456
              seedDescription: dfsdfdfssdf
          },
          {
               seedName: seedName2222
              keyWords: keyWords8888
              chargeAmount: 12
              seedId: 1
              endorseAmount: 12
              seedOwner: 0x345345456
              seedDescription: dfsdfdfssdf
          }
       ]

      * */
    const [seedInfos,setSeedInfos] = useState([]);
    const [currentAccount,setCurrentAccount]=useState(null)
   const [deployedContract,setDeployedContract]=useState(null)
   const [selectedSeed,setSelectedSeed] = useState(
        {
            seedName: "",
            keyWords: "",
            chargeAmount: 0,
            seedId: "",
            endorseAmount: 0,
            seedOwner: "",
            seedDescription: ""
        });

    let linkItemClickHandler=(seedInfo)=>{
        setSelectedSeed(seedInfo)
    }


  useEffect( ()=>{
    (async ()=>{
      await getWeb3ProviderAndWebSocket()
      await  getCurrentAccount()
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
    // window.web3Socket = new Web3("wss://rinkeby.infura.io/ws/v3/4770b93234ff418e8c15c8f67b45d41a");
    // if(!window.web3Socket){
    //   window.alert('Please make sure your wss copied from Infura is correct.')
    // }
  }

  async function getCurrentAccount() {
       const accounts = await window.web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
      window.ethereum.on('accountsChanged', function (accounts) {
          setCurrentAccount(accounts[0]);
      })
  }

  async function connectToContract(){
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId()
    const networkData = MagnetLinkBillboard.networks[networkId];

    if(networkData) {
      const deployedContractTemp = new web3.eth.Contract(MagnetLinkBillboard.abi, networkData.address);
      setDeployedContract(()=>deployedContractTemp)
    }

  }

    const getSeedInfosFromContract= async (forceToUpdate)=>{
        console.log("in getSeedInfosFromContract")
        const seedAmount=await deployedContract.methods.seedAmount().call()

        if(forceToUpdate||seedAmount>seedInfos.length){
            let seeds=[]
            for (let i = 1; i <=seedAmount; i++) {
                let res=await deployedContract.methods.magnetItemsPublicInfo(i).call()
                seeds.push(res)

            }
            setSeedInfos(seeds)
        }




    }





    return (
        <AppContext.Provider value={{
            deployedContract: deployedContract,
            currentAccount:currentAccount,
            selectedSeed: selectedSeed,
            seedInfos: seedInfos,
            linkItemClickHandler: linkItemClickHandler,
            getSeedInfosFromContract: getSeedInfosFromContract
        }}>

      <div className="container">

        <div>
          <div className="d-flex justify-content-center"><h2>Magnet Link Billboard</h2></div>
        </div>

        {/*<div className="nav d-flex justify-content-between">*/}
        {/*  <Link className="nav-link"  to="/user">User Center</Link>*/}
        {/*  <Link  to={{pathname:"/billboard"}} >Billboard</Link>*/}
        {/*  <Link to="/upload">Upload Seed</Link>*/}
        {/*  <Link to="/download">Download Seed</Link>*/}
        {/*</div>*/}

        {/*<div className="panel">*/}
        {/*  <Switch>*/}
        {/*    <div className="panel-body">*/}
        {/*      <Route path="/user" component={AddressBar}/>*/}
        {/*      <Route path="/(billboard|)" component={MagnetLinkList}/>*/}
        {/*        <Route path="/upload" component={Upload}/>*/}
        {/*      <Route path="/download" component={Download}/>*/}
        {/*    </div>*/}
        {/*  </Switch>*/}
        {/*</div>*/}



          <AddressBar></AddressBar>
          <MagnetLinkList></MagnetLinkList>
          <Upload> </Upload>
          <Download></Download>

       </div>
 </AppContext.Provider>

);
};

export default App;
