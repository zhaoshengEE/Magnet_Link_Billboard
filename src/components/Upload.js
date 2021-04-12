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
    const inputChargeAmount = useRef(null);
    const inputSeedDescription = useRef(null);

    const uploadSeedToContract= useCallback(async ()=>{

        const web3 = window.web3;
        let seedName=inputSeedName.current.value.trim()
        let seedLink=inputSeedLink.current.value.trim()
        let keyWords=inputKeyWords.current.value.trim()
        let chargeAmount=inputChargeAmount.current.value.trim()
        let seedDescription=inputSeedDescription.current.value.trim()




        if(!(seedName&&seedLink&&keyWords&&isNumber(chargeAmount)&&seedDescription)){

            return
        }

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

    function isNumber(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
            !isNaN(parseFloat(str))
    }

    return (

        <div>

            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload new seed</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the following information to upload the new magnetic link.
                    </DialogContentText>


                    <TextField  required  inputRef={inputSeedName}  autoFocus margin="dense" id="inputSeedName" label="Seed Name" type="text" fullWidth/>
                    <TextField required inputRef={inputSeedLink}  margin="dense" id="inputSeedLink" label="Seed Link" type="text" fullWidth/>
                    <TextField  required inputRef={inputKeyWords}  margin="dense" id="inputKeyWords" label="Key Words " type="text" fullWidth/>
                    <TextField  required inputRef={inputChargeAmount}  defaultValue="0"  margin="dense" id="inputChargeAmount" label="Charge Amount" type="text" fullWidth/>
                    <TextField  required inputRef={inputSeedDescription}   margin="dense" id="inputSeedDescription" label="Seed Description" type="text" fullWidth/>

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