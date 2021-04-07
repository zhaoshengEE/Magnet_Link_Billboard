import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

class Download extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectSID:0,
      account:"",
      chargeAmount:0,
      loading:true,
      seen:false,
      seed:"777",
    }  
    this.showLink = this.showLink.bind(this)
    this.endorse = this.endorse.bind(this)
  }
          
    // toggleDownloadPop = async(selectSID, sellingAmount)=>{
    //   console.log(this.state.seen);
    //   this.setState({loading:true})
    //   const gasAmount = this.state.deployedBillboards.methods.download(selectSID).estimateGas({from: this.state.account, value: sellingPrice})
    //   var seedLink = this.state.deployedBillboards.methods.download(selectSID).send({from: this.state.account, value: sellingPrice, gas: gasAmount })
    //   .once('receipt', async(receipt)=>{
    //       this.setState({seed:seedLink});
    //       this.setState({loading:false});
    //       this.state({seen:!this.state.seen});
    //   })
    //   .once('receipt', async (receipt)=> {
    //       const totalNumber = await this.state.deployedEthbay.methods.totalNumber().call();
    //       this.setState({totalNumber});
    //       this.setState({items: []});
    //       for (var i = 1;i<= totalNumber;i++) {
    //         const item = await this.state.deployedEthbay.methods.items(i).call();
    //         this.setState({
    //           items:[...this.state.items, item]
    //         });
    //       }
    //          this.setState({loading: false});
    //     })
    // }
    async showLink(){
      const {selectSID} = this;
      //const {chargeAmount} = this;
      const charge = window.web3.utils.toWei(this.chargeAmount.value.toString(),'Ether')
      //calling smart contract
      
      console.log(12345);
      console.log(this.props.deployedContract);
      console.log(this.props.account);
      //this.setState({loading:true})
      const gasAmount = await this.props.deployedContract.methods.download(selectSID.value).estimateGas({from: this.props.account, value: charge})
      let seedLink = await this.props.deployedContract.methods.download(selectSID.value).send({from: this.props.account, value: charge, gas: gasAmount })
      //let downloadResult = await this.props.deployedContract.methods.download.call(selectSID.value, {from: this.props.account, value: charge, gas: gasAmount});
      .once('receipt', async(receipt)=>{
          let res=await this.props.deployedContract.methods.getLink(selectSID.value).call()
          this.setState({seed:seedLink});
          this.setState({loading:false});
          alert("Your link is: "+ res);
      })
      console.log(seedLink)      
    }
    async endorse(){
      const {selectSID} = this;
      const gasAmount = await this.props.deployedContract.methods.endorse(selectSID.value).estimateGas({from: this.props.account})
      let endorseSuccess = await this.props.deployedContract.methods.endorse(selectSID.value).send({from: this.props.account, gas: gasAmount })
      //let downloadResult = await this.props.deployedContract.methods.download.call(selectSID.value, {from: this.props.account, value: charge, gas: gasAmount});
      .once('receipt', async(receipt)=>{
          // let res=await this.props.deployedContract.methods.getLink(selectSID.value).call()
          // this.setState({seed:seedLink});
          // this.setState({loading:false});
          alert("Thanks for endorsing.");
      })
    }
  render() {
    return (
      <div>
        <input ref={(input)=>{this.selectSID = input}} type="text" placeholder="select SID"/>&nbsp;
        <input ref={(input2)=>{this.chargeAmount = input2}} type="text" placeholder="chargeAmount"/>&nbsp;
        <button onClick={this.showLink}>Download</button>&nbsp;
        <button onClick={this.endorse}>Endorse</button>&nbsp;
      </div>
    );   
    }
  }
 export default Download;