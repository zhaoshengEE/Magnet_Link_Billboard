import React, { useCallback, useContext } from 'react';

import {AppContext} from "./App";


const style={
    background: "#ff7744"
}

function AddressBar (props) {
   const appContext =useContext(AppContext)
  const currentAccount=appContext.currentAccount
  const deployedContract = appContext.deployedContract


  let checkUserSeeds = useCallback (async()=>{

    console.log("your personal SeedsID")
    let seedArray = []
    let counter = await deployedContract.methods.uploadAndDownloadCounter(currentAccount).call()

    console.log(counter)

    for (let i=0; i<counter; i++) {
      let personalSeeds = await deployedContract.methods.OwnerSeedsSummary(currentAccount,i).call()
      seedArray.push(personalSeeds)
    }

    console.log(seedArray.toString())
    alert("your personal SeedID:  " + seedArray.toString())

  },[deployedContract,currentAccount])




    return (
    <nav className="row p-2 "  style={style}>
        <ul className="nav">
            <li className="nav-item">
             <span id="account">{"Your Address:" + currentAccount}</span>
              &nbsp;&nbsp;
            </li>
            <li className="nav-item">
              <button onClick={checkUserSeeds}>Personal Seeds</button>
              &nbsp;&nbsp;
            </li>
        </ul>
    </nav> 
    );
}

export default AddressBar;
