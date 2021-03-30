const MagnetLinkBillboard = artifacts.require("MagnetLinkBillboard");
require('chai')
.use(require('chai-as-promised'))
.should();
const truffleAssert = require('truffle-assertions');


contract("MagnetLinkBillboard",(accounts)=>{
    let magnetLinkBillboard;

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
    const writer = accounts[1];     // The first person who uploads contents to the billboard
    const writer2 = accounts[2];    // The second person who uploads contents to the billboard
    const visitor = accounts[3];    // The first person who downloads or endorses the contents on billboard
    const visitor2 = accounts[4];   // The second person who downloads or endorses the contents on billboard
    const visitor3 = accounts[5];   // The person who just visits the billboard

    // Used for testing the upload function when there exists empty input
    const invalidSeedName = '';
    const invalidSeedLink = '';
    const invalidKeyWords = '';
    const invalidSeedDescription = ''
    
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
    });

    describe('Test the valid case in the upload function', async()=>{
        it("A SeedUploaded event should be emitted", async() => {
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
        it("A SeedDownloaded event should be emitted", async() => {
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

        it("The corresponding seed link should be returned", async() => {
            await magnetLinkBillboard.upload(seedName2, seedLink2, keyWords2, chargeAmount2, seedDescription2, {from: writer});
            let downloadResult = await magnetLinkBillboard.download.call(2, {from: visitor2, value: chargeAmount2});
            assert.equal(downloadResult, seedLink2);
        });

        it("The contract deployer should remain one-tenth of the chargeAmount", async() => {
            let contractBalanceBefore = await magnetLinkBillboard.contractBalance();
            await magnetLinkBillboard.upload(seedName3, seedLink3, keyWords3, chargeAmount3, seedDescription3, {from: writer2});
            await magnetLinkBillboard.download(3, {from: visitor2, value: chargeAmount3});
            let contractBalanceAfter = await magnetLinkBillboard.contractBalance();
            assert.equal(contractBalanceBefore * 1 + chargeAmount2 * 1/10, contractBalanceAfter * 1);
        });
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

        it('If the visitor has not downloaded the seed, the endorse function should not be accomplished', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.download(1, {from: visitor3}),
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

        it('The visitor should not endorse the same seed again (testing removeEndorsedSeeds function)', async() => {
            await truffleAssert.fails(
                magnetLinkBillboard.endorse(1, {from: visitor}),
                truffleAssert.ErrorType.REVERT
            );
        });

        it("The seed owner should receive the rewards after his/her seed has been endorsed", async() => {
            let seedOwnerBalanceBefore = await magnetLinkBillboard.checkSeedOwnerBalance({from: writer2});
            await magnetLinkBillboard.endorse(3, {from: visitor2});
            let seedOwnerBalanceAfter = await magnetLinkBillboard.checkSeedOwnerBalance({from: writer2});
            let contractBalance = await magnetLinkBillboard.contractBalance();
            assert.equal(seedOwnerBalanceAfter * 1, seedOwnerBalanceBefore * 1 + contractBalance / 100000000000);
        });
    });
});
