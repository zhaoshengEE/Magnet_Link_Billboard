const MagnetLinkBillboard = artifacts.require("MagnetLinkBillboard");
require('chai')
.use(require('chai-as-promised'))
.should();
const truffleAssert = require('truffle-assertions');


contract("MagnetLinkBillboard",([deployer,uploader1,downloader])=>{
    let magnetLinkBillboard;



    before(async () =>{
        magnetLinkBillboard = await MagnetLinkBillboard.new({from:deployer});
    });

    it('test contract deployment', async()=>{
        assert.isNotNull(magnetLinkBillboard)
        console.log(magnetLinkBillboard)

        assert.equal(await magnetLinkBillboard.billboardName(),"Magnet Link Billboard")
    });

    //        function upload(string memory _seedName,
    //        string memory _seedLink,
    //        string memory _keyWords,
    //        uint256 _chargeAmount,
    //        string memory _seedDescription) public {
    it("test upload",async ()=>{
        let seedName='seedName9999'
        let seedLink='seedLink_45tt534345ggr5'
        let keyWords='keyWords_g4545g45g45g'
        let chargeAmount=web3.utils.toWei("0.1",'ether') //wei
        let  seedDescription="dfgfsgsdfgdfgdfg"

        let uploadReceipt=await magnetLinkBillboard.upload(seedName,seedLink,keyWords,chargeAmount,seedDescription)

        truffleAssert.eventEmitted(uploadReceipt,'SeedUploaded',(event)=>{
            return chargeAmount.toString()==event.chargeAmount.toString()
        })
        })


     it("test get one magnetItem",async ()=>{
         let res= await magnetLinkBillboard.magnetItems(1)
         console.log("---------test get magnetItem-----------------------")
         console.log(res)
     })

});



