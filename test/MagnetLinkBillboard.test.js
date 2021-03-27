const MagnetLinkBillboard = artifacts.require("MagnetLinkBillboard");
require('chai')
.use(require('chai-as-promised'))
.should();
const truffleAssert = require('truffle-assertions');


contract("MagnetLinkBillboard",([deployer,uploader1,downloader])=>{
    let magnetLinkBillboard;

    let seedName='seedName9999'
    let seedLink='seedLink_45tt534345ggr5'
    let keyWords='keyWords_g4545g45g45g'
    let chargeAmount=web3.utils.toWei("0.1",'ether') //wei
    let  seedDescription="dfgfsgsdfgdfgdfg"



    before(async () =>{
        magnetLinkBillboard = await MagnetLinkBillboard.new({from:deployer});
    });

    it('test contract deployment', async()=>{
        assert.isNotNull(magnetLinkBillboard)

        assert.equal(await magnetLinkBillboard.billboardName(),"Magnet Link Billboard")
    });


    it("test upload",async ()=>{


        let uploadReceipt=await magnetLinkBillboard.upload(seedName,seedLink,keyWords,chargeAmount,seedDescription)

        truffleAssert.eventEmitted(uploadReceipt,'SeedUploaded',(event)=>{
            return chargeAmount.toString()==event.chargeAmount.toString()
        })
        })


     it("test get one magnetItemsPublicInfo",async ()=>{
         let magnetItemsPublicInfo= await magnetLinkBillboard.magnetItemsPublicInfo(1)
         assert.equal(magnetItemsPublicInfo.seedName,seedName)
         assert.equal(magnetItemsPublicInfo.seedDescription,seedDescription)
         assert.equal(magnetItemsPublicInfo.keyWords,keyWords)




     })



});



