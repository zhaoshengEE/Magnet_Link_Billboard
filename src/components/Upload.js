import React, {useCallback, useContext, useRef} from 'react';
import {AppContext} from "./App";
const style={
    background: "lightgray"
}
const Upload = (props) => {
    const appContext =useContext(AppContext)
    const currentAccount=appContext.currentAccount
    const deployedContract=appContext.deployedContract
    const getSeedInfosFromContract=appContext.getSeedInfosFromContract

    const inputSeedName = useRef(null);
    const inputSeedLink = useRef(null);
    const inputKeyWords = useRef(null);
    const inputChargeAmount = useRef(0);
    const inputSeedDescription = useRef(null);

    const uploadSeedToContract= useCallback(async ()=>{
        const web3 = window.web3;
        let seedName=inputSeedName.current.value
        let seedLink=inputSeedLink.current.value
        let keyWords=inputKeyWords.current.value
        let chargeAmount=inputChargeAmount.current.value
        let seedDescription=inputSeedDescription.current.value
        console.log("uploadSeedToContract----------------------")
        console.log(seedName,seedLink,keyWords,chargeAmount,seedDescription)

        let uploadHandler=await deployedContract.methods.upload(seedName, seedLink, keyWords, chargeAmount, seedDescription)

        const gasAmount = await uploadHandler.estimateGas({from: currentAccount})
        const gasPrice=await web3.eth.getGasPrice()
        console.log(gasPrice*1.01)
        uploadHandler.send({from: currentAccount, gas: gasAmount,gasPrice:gasPrice*1.01})
            .once('receipt', async (receipt)=> {

                if(inputSeedName.current){
                    inputSeedName.current.value=""
                    inputSeedLink.current.value=""
                    inputKeyWords.current.value=""
                    inputChargeAmount.current.value="0"
                    inputSeedDescription.current.value=""
                }

                await getSeedInfosFromContract(true)
            })


    },[currentAccount,deployedContract])
    return (

            <div style={style} className="row row-cols-md-2 p-3">

                    <p>Seed Name: <input  ref={inputSeedName}/></p>
                    <p>Seed Link: <input  ref={inputSeedLink}/></p>
                    <p>KeyWords: <input  ref={inputKeyWords}/></p>
                    <p>ChargeAmount: <input  defaultValue="0" ref={inputChargeAmount}/></p>
                    <p>SeedDescription: <input  ref={inputSeedDescription}/></p>
                    <p><button onClick={uploadSeedToContract}>upload</button></p>


            </div>


    );
};

export default Upload;