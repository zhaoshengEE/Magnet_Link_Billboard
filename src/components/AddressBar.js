import React, {useCallback, useContext, useEffect, useState} from 'react';

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
    const seedInfos=appContext.seedInfos


    const [personalSeeds, setPersonalSeeds]=useState([])
    const [personalSeedsOpen, setPersonalSeedsOpen]=useState(false)
    const [uploadSeedsOpen, setUploadSeedsOpen]=useState(false)

    useEffect(()=>{
        (async ()=>{
            await checkUserSeeds()

        })()
    },[currentAccount,seedInfos])



  let checkUserSeeds =async()=>{
      if (deployedContract&&seedInfos.length>0){
          console.log("your personal SeedsID")
          let seedArray = []
          let counter = await deployedContract.methods.uploadAndDownloadCounter(currentAccount).call()

          console.log(counter)

          for (let i=0; i<counter; i++) {
              let id = await deployedContract.methods.OwnerSeedsSummary(currentAccount,i).call()
              let link=await deployedContract.methods.getLink(id).call();

                //seedInfos 的index 和 链上存储的 index差1
              seedArray.push({id,name: seedInfos[id-1].seedName,link})
          }
          seedArray.sort((seed1,seed2)=>{
              return seed1.id-seed2.id
          })
          console.log(seedArray)

          setPersonalSeeds(seedArray)
      }



  }




    return (

        <div>

            <nav className="row p-2 "  style={style}>
                <ul className="nav">
                    <li className="nav-item">
                     <span id="account">{"Your Address:" + currentAccount}</span>
                      &nbsp;&nbsp;
                    </li>
                    <li className="nav-item">
                      <Button onClick={()=>setPersonalSeedsOpen(true)}  variant="contained">Personal Seeds</Button>
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
                           personalSeeds={personalSeeds}>
            </PersonalSeeds>

            <Upload open={uploadSeedsOpen}
                    handleClose={()=>setUploadSeedsOpen(false)}>
            </Upload>

        </div>
    );
}

export default AddressBar;
