import React, {useCallback, useContext, useState} from 'react';

import {AppContext} from "./App";
import {Button} from "@material-ui/core";
import PersonalSeeds from "./PersonalSeeds";
import Upload from "./Upload";


const style={
    background: "#ff7744"
}

function AddressBar (props) {
  const appContext =useContext(AppContext)
  const currentAccount=appContext.currentAccount
  const deployedContract = appContext.deployedContract

    const [personalSeedsContent, setPersonalSeedsContent]=useState("")
    const [personalSeedsOpen, setPersonalSeedsOpen]=useState(false)
    const [uploadSeedsOpen, setUploadSeedsOpen]=useState(false)


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
    setPersonalSeedsOpen(true)
    setPersonalSeedsContent("your personal SeedID:  " + seedArray.toString())

  },[deployedContract,currentAccount])




    return (

        <div>

            <nav className="row p-2 "  style={style}>
                <ul className="nav">
                    <li className="nav-item">
                     <span id="account">{"Your Address:" + currentAccount}</span>
                      &nbsp;&nbsp;
                    </li>
                    <li className="nav-item">
                      <Button onClick={checkUserSeeds}  variant="contained">Personal Seeds</Button>
                      &nbsp;&nbsp;
                    </li>

                    <li className="nav-item">
                        <Button onClick={()=>setUploadSeedsOpen(true)}  variant="contained">Upload new Seed</Button>
                        &nbsp;&nbsp;
                    </li>

                </ul>
            </nav>

            <PersonalSeeds open={personalSeedsOpen}
                           handleClose={()=>setPersonalSeedsOpen(false)}
                           personalSeedsContent={personalSeedsContent}>
            </PersonalSeeds>

            <Upload open={uploadSeedsOpen}
                    handleClose={()=>setUploadSeedsOpen(false)}>
            </Upload>

        </div>
    );
}

export default AddressBar;
