import React, {useCallback, useContext, useRef} from 'react';
import {AppContext} from "./App";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
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

        props.handleClose()


    },[currentAccount,deployedContract])

    return (

        <div>

            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>

                    {/*<p>Seed Name: <input  ref={inputSeedName}/></p>*/}
                    {/*<p>Seed Link: <input  ref={inputSeedLink}/></p>*/}
                    {/*<p>KeyWords: <input  ref={inputKeyWords}/></p>*/}
                    {/*<p>ChargeAmount: <input  defaultValue="0" ref={inputChargeAmount}/></p>*/}
                    {/*<p>SeedDescription: <input  ref={inputSeedDescription}/></p>*/}
                    <TextField  inputRef={inputSeedName} autoFocus margin="dense" id="name" label="Seed Name" type="text" fullWidth/>
                    <TextField  inputRef={inputSeedLink} autoFocus margin="dense" id="name" label="Seed Link" type="text" fullWidth/>
                    <TextField  inputRef={inputKeyWords} autoFocus margin="dense" id="name" label="Key Words " type="text" fullWidth/>
                    <TextField  inputRef={inputChargeAmount} defaultValue="0" autoFocus margin="dense" id="name" label="Charge Amount" type="text" fullWidth/>
                    <TextField  inputRef={inputSeedDescription} autoFocus margin="dense" id="name" label="Seed Description" type="text" fullWidth/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={uploadSeedToContract} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>







    );
};

export default Upload;