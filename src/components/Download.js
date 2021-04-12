import React, { Component } from 'react';
import Web3 from 'web3';
import {AppContext} from "./App";
import {Button} from "@material-ui/core";

class Download extends Component{

  constructor(props){
    super(props)
    this.state = {
      seen:false,
      seed:"777",
    }
    this.showLink = this.showLink.bind(this)
    this.endorse = this.endorse.bind(this)
  }

    componentDidMount() {
        Download.contextType = AppContext
    }



  async  showLink(){
      const selectedSeed=this.context.selectedSeed
      const deployedContract=this.context.deployedContract
      const currentAccount=this.context.currentAccount


      const charge = window.web3.utils.toWei(selectedSeed.chargeAmount.toString(),'Ether')



      try {
          const gasAmount = await deployedContract.methods.download(selectedSeed.seedId).estimateGas({from: currentAccount, value: charge})

          let seedLink = await deployedContract.methods.download(selectedSeed.seedId).send({from: currentAccount, value: charge, gas: gasAmount })
              //let downloadResult = await this.props.deployedContract.methods.download.call(selectSID.value, {from: this.props.account, value: charge, gas: gasAmount});
              .once('receipt', async(receipt)=>{
                  // let res=await this.props.deployedContract.methods.getLink(selectedSeed.seedId).call()
                  let res=await deployedContract.methods.getLink(selectedSeed.seedId).call();
                  this.setState({seed:seedLink});
                  this.setState({loading:false});
                  alert("Your link is: "+ res);
              })

      }catch (e) {
          try {
              let str=e.message.substring(e.message.indexOf("{"))

              let errorMsg=JSON.parse(str)['originalError']['message']
              alert(errorMsg)
          }catch (e){}

      }


    }


    async endorse(){
      const selectedSeed=this.context.selectedSeed
      const deployedContract=this.context.deployedContract

      const currentAccount=this.context.currentAccount


        try {
            const gasAmount = await deployedContract.methods.endorse(selectedSeed.seedId).estimateGas({from: currentAccount})
            let endorseSuccess = await deployedContract.methods.endorse(selectedSeed.seedId).send({from:currentAccount, gas: gasAmount })
                //let downloadResult = await this.props.deployedContract.methods.download.call(selectSID.value, {from: this.props.account, value: charge, gas: gasAmount});
                .once('receipt', async(receipt)=>{
                    // let res=await this.props.deployedContract.methods.getLink(selectSID.value).call()
                    // this.setState({seed:seedLink});
                    // this.setState({loading:false});
                    await this.context.getSeedInfosFromContract(true)
                    alert("Thanks for endorsing.");
                })

        }  catch (e) {
          try {
              let str=e.message.substring(e.message.indexOf("{"))
              let errorMsg=JSON.parse(str)['originalError']['message']
              alert(errorMsg)
          }catch (e){}

    }
  }


  render() {

    return (
        <AppContext.Consumer>
            {
                ({selectedSeed})=>{
                    return (
                        <div className="row d-flex  mt-2 " >
                        <div className="p-2 ">
                            <p>Selected Seed ID: {selectedSeed.seedId}</p>
                            <p>Seed Name: {selectedSeed.seedName}</p>
                            <p>Charge Amount: {selectedSeed.chargeAmount}</p>
                        </div>
                            <div className="p-2 ">
                                <Button variant="contained" onClick={this.showLink}>Download</Button>
                                <br></br>  <br></br>
                                <Button variant="contained" onClick={this.endorse}>Endorse</Button>
                            </div>

                    </div>
                    )
                }
            }
        </AppContext.Consumer>

    );
  }

}

export default Download;