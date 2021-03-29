const MagnetLinkBillboard = artifacts.require("MagnetLinkBillboard");
require('chai')
.use(require('chai-as-promised'))
.should();
const truffleAssert = require('truffle-assertions');


contract("MagnetLinkBillboard",(accounts)=>{
    let magnetLinkBillboard;

    const validEther = '1';
    const invalidEther = '-1';

    const seedName = 'seedName9999';
    const seedLink = 'edLink_45tt534345ggr5';
    const keyWords = 'keyWords_g4545g45g45g';
    const chargeAmount = web3.utils.toWei('1', 'ether');
    const seedDescription = "This_is_seed description 1";

    const seedName2 = 'seedName8888';
    const seedLink2 = 'seedLink_45tt534345ggr3';
    const keyWords2 = 'keyWords_g3535g35g35g';
    const chargeAmount2 = web3.utils.toWei('1', 'ether');
    const seedDescription2 = "This_is_seed description 2";

    const seedName3 = 'seedName7777';
    const seedLink3 = 'seedLink_45tt534345ggr0';
    const keyWords3 = 'keyWords_g1515g15g15g';
    const chargeAmount3 = web3.utils.toWei('1', 'ether');
    const seedDescription3 = "This_is_seed description 3";

    const deployer = accounts[0];   // The owner of the contract
    const writer = accounts[1];     // The person who uploads contents to the billboard
    const visitor = accounts[2];    // The person who downloads or endorses the contents on billboard
    const visitor2 = accounts[3];
    const writer2 = accounts[4];

    // Used for testing the upload function when there exists empty input
    const invalidSeedName = '';
    const invalidSeedLink = '';
    const invalidKeyWords = '';
    const invalidSeedDescription = ''
    // const invalidChargeAmount = web3.utils.toWei(new web3.utils.BN(invalidEther));
    const invalidChargeAmount = web3.utils.toWei('-1', 'ether');
    // const invalidChargeAmount = -1;
    
    // Used for testing the case when the visitor has insufficient ether
    const insufficientChargeAmount = web3.utils.toWei('0.5', 'ether');

    before(async () =>{
        magnetLinkBillboard = await MagnetLinkBillboard.new({from:deployer});
    });

    describe('Test the validity of the contract deployment', async()=>{
        it('The contract should not be NULL', async() => {
            assert.isNotNull(magnetLinkBillboard);
        });
        
        it('The contract should have the designated name', async() => {
            assert.equal(await magnetLinkBillboard.billboardName(), "Magnet Link Billboard");
        });
    });

    describe('Test the invalid cases in the upload function', async()=>{
        it('If the seed name is empty, the upload cannot be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.upload(invalidSeedName, seedLink, keyWords, chargeAmount, seedDescription, {from: writer}),
                truffleAssert.ErrorType.REVERT
            );
        });
        
        it('If the seed link is empty, the upload cannot be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.upload(seedName, invalidSeedLink, keyWords, chargeAmount, seedDescription, {from: writer}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the seed keyword is empty, the upload cannot be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.upload(seedName, seedLink, invalidKeyWords, chargeAmount, seedDescription, {from: writer}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the seed description is empty, the upload cannot be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.upload(seedName, seedLink, keyWords, chargeAmount, invalidSeedDescription, {from: writer}),
                truffleAssert.ErrorType.REVERT
            );
        });

        // THE uint ALREADY ENFORCES THE chargeAmount TO BE GREATER THAN ZERO. LET'S DISCUSS IT LATER
        // it('If the charge amount is below zero, the upload cannot be accomplished', async() => {
        //     await truffleAssert.fails(
        //         magnetLinkBillboard.upload(seedName, seedLink, keyWords, invalidChargeAmount, seedDescription, {from: writer}),
        //         truffleAssert.ErrorType.REVERT
        //     );
        // });
    });

    describe('Test the valid case in the upload function', async()=>{
        it("A SeedUploaded should be emitted", async() => {
            let uploadReceipt = await magnetLinkBillboard.upload(seedName, seedLink, keyWords, chargeAmount, seedDescription, {from: writer});
            truffleAssert.eventEmitted(uploadReceipt, 'SeedUploaded', (ev)=>{
                return ev.seedId == 1
                    && ev.seedOwner == writer
                    && ev.seedName == seedName
                    && ev.keyWords == keyWords
                    && ev.chargeAmount.toString() == chargeAmount.toString()
                    && ev.seedDescription == seedDescription
                    && ev.endorseAmount == 0;
            });
        });

        it("The magnetItemsPublicInfo should have the corresponding contents", async() => {
            let magnetItemsPublicInfo = await magnetLinkBillboard.magnetItemsPublicInfo(1);
            assert.equal(magnetItemsPublicInfo.seedName, seedName);
            assert.equal(magnetItemsPublicInfo.keyWords, keyWords);
            assert.equal(magnetItemsPublicInfo.chargeAmount, chargeAmount);
            assert.equal(magnetItemsPublicInfo.seedId, 1);
            assert.equal(magnetItemsPublicInfo.endorseAmount, 0);
            assert.equal(magnetItemsPublicInfo.seedOwner, writer);
            assert.equal(magnetItemsPublicInfo.seedDescription, seedDescription);
        });

        // NOT SURE HOW TO TEST THE magnetItemsSeedLinks. LET'S DISCUSS IT LATER 
        // it("The seed link should be stored", async() => {
        //     let magnetItemsSeedLinks = await magnetLinkBillboard.magnetItemsSeedLinks(1);
        //     assert.equal(magnetItemsSeedLinks, seedLink);
        // });

        it("The OwnerSeedsSummary should be updated (testing checkUserSeeds function)", async() => {
            let userSeedID = await magnetLinkBillboard.checkUserSeeds({from: writer});
            assert.equal(userSeedID, 1);
        });

        it("The SeedsOwnerSummary should be updated (testing checkSeedOwner function)", async() => {
            let seedsOwner = await magnetLinkBillboard.checkSeedOwner(1);
            assert.equal(seedsOwner, writer);
        });
    });

    describe('Test the invalid cases in download function', async()=>{
        it('If the seedID is not greater than zero, the download function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(0, {from: visitor, value: chargeAmount}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the seedID exceeds the number of seeds on the billboard, the download function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(2, {from: visitor, value: chargeAmount}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the visitor is the writer himself/herself, the download function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(1, {from: writer, value: chargeAmount}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the visitor has insufficient ether, the download function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(1, {from: visitor, value: insufficientChargeAmount}),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

    describe('Test the valid cases in download function', async()=>{
        it("A SeedDownloaded should be emitted", async() => {
            let downloadReceipt = await magnetLinkBillboard.download(1, {from: visitor, value: chargeAmount});
            truffleAssert.eventEmitted(downloadReceipt, 'SeedDownloaded', (ev)=>{
                return ev.seedId == 1
                    && ev.seedOwner == visitor
                    && ev.seedName == seedName
                    && ev.keyWords == keyWords
                    && ev.chargeAmount.toString() == chargeAmount.toString()
                    && ev.seedDescription == seedDescription
                    && ev.endorseAmount == 0;
            });
        });

        it('The same visitor seed should not download the seed again', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(1, {from: visitor, value: chargeAmount}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it("The seed link should be returned", async() => {
            let uploadReceipt = await magnetLinkBillboard.upload(seedName2, seedLink2, keyWords2, chargeAmount2, seedDescription2, {from: writer});
            let downloadResult = await magnetLinkBillboard.download.call(2, {from: visitor2, value: chargeAmount2});
            assert.equal(downloadResult, seedLink2);
        });

        it("the seed owner should receive the chargeAmount", async() => {
            let contractBalanceBefore = await web3.eth.getBalance(magnetLinkBillboard.address);
            let uploadReceipt = await magnetLinkBillboard.upload(seedName3, seedLink3, keyWords3, chargeAmount3, seedDescription3, {from: writer2});
            let downloadResult = await magnetLinkBillboard.download(3, {from: visitor2, value: chargeAmount3});
            let contractBalanceAfter = await web3.eth.getBalance(magnetLinkBillboard.address);
            assert.equal(contractBalanceBefore*1 + chargeAmount2* 1/10, contractBalanceAfter*1);
        });

        // NOT SURE HOW TO TEST THE OUTPUT OF THE FUNCTION. 
        // SINCE THE FUNCTION EMITS A EVENT AND RETURNS AN OUTPUT SIMULTANEOUSLY.
        // LET'S DISCUSS IT LATER 

    });


    describe('Test the invalid cases in endorse function', async()=>{
        it('If the seedID is not greater than zero, the endorse function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.endorse(0, {from: visitor}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the seedID exceeds the number of seeds on the billboard, the endorse function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.endorse(10, {from: visitor}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('If the visitor is the writer himself/herself, the endorse function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(1, {from: writer}),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

    describe('Test the valid cases in endorse function', async()=>{
        it("The visitor who has downloaded the seed should be able to endorse the seed", async() => {
            await truffleAssert.passes(
                magnetLinkBillboard.endorse(1, {from: visitor})
            );
        });

        it("The endorseAmount should be updated", async() => {
            let magnetItemsPublicInfo = await magnetLinkBillboard.magnetItemsPublicInfo(1);
            assert.equal(magnetItemsPublicInfo.endorseAmount, 1);
        });

        it("seed owner should receive the ether after seed being downloaded", async() => {
            let seedOwnerBalanceBefore = await magnetLinkBillboard.checkSeedOwnerBalance({from: writer2});
            let endorseReceipt = await magnetLinkBillboard.endorse(3, {from: visitor2});
            let seedOwnerBalanceAfter = await magnetLinkBillboard.checkSeedOwnerBalance({from: writer2});
            let contractBalance = await web3.eth.getBalance(magnetLinkBillboard.address);
            assert.equal(seedOwnerBalanceAfter*1, seedOwnerBalanceBefore*1 + contractBalance/100000000000);
        });
    });
});
