import React, { useCallback, useEffect, useState } from 'react';
import Web3 from "web3";


const style={
    background: "#ff7744"
}

const buttonStyle={
    background: "428bca",
}

function AddressBar (props) {

  const [currentAccount,setCurrentAccount]=useState(null)
  const deployedContract = props.deployedContract
  

  useEffect( ()=>{
    let timer
    (async ()=>{
      await getWeb3ProviderAndWebSocket()
      await connectToContract()

      timer= setInterval(connectToContract,1000)
      
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
  }  

  let checkUserSeeds = useCallback (async()=>{

    console.log("your personal SeedsID")
    let seedArray = []

    let counter = await deployedContract.methods.uploadAndDownloadCounter(currentAccount).call()

    // var len = 0
    // for (var j in counter)
    // len ++
    // console.log (len)
    // console.log(props.account)
    console.log(counter)

    for (let i=0; i<counter; i++) {
      let personalSeeds = await deployedContract.methods.OwnerSeedsSummary(currentAccount,i).call()
      seedArray.push(personalSeeds)
    }

    console.log(seedArray.toString())
    alert("your personal SeedID:  " + seedArray.toString())

  },[props.deployedContract])




    return (
    <nav style={style}>
        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-black"><span id="account">{"Your Address:" + currentAccount}</span></small>
            <button style={buttonStyle} onClick={checkUserSeeds}>Personal Seeds</button>
            </li>
        </ul>
    </nav> 
    );
}

export default AddressBar;
