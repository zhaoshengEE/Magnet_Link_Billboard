import React, { useCallback, useEffect } from 'react';


const style={
    background: "#61dafb"
}

function AddressBar (props) {

  useEffect( ()=>{ 
    (async ()=>{
      const deployedContract= props.deployedContract
      if(deployedContract){

          console.log()

      }

  })()
  },[props.deployedContract])

  let checkUserSeeds = useCallback (async()=>{
    const deployedContract=props.deployedContract

    console.log("your personal SeedsID")
    let seedArray = []

    let counter = await deployedContract.methods.uploadAndDownloadCounter(props.account).call()

    // var len = 0
    // for (var j in counter)
    // len ++
    // console.log (len)
    // console.log(props.account)
    console.log(counter)

    for (let i=0; i<counter; i++) {
      let personalSeeds = await deployedContract.methods.OwnerSeedsSummary(props.account,i).call()
      seedArray.push(personalSeeds)
    }

    console.log(seedArray.toString())
    alert("your personal SeedID:  " + seedArray.toString())

  },[props.deployedContract])




    return (
    <nav style={style}>
        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <button onClick={checkUserSeeds}>
                <small className="text-black"><span id="account">{"Your Address: " + props.account}</span></small>
            </button>
            </li>
        </ul>
    </nav>
    );
}

export default AddressBar;
