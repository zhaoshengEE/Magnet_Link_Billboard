// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
//todo: search function, update download and upload function
//optional: tag viewing, modifier,
contract MagnetLinkBillboard {
    struct SeedInfo {
        string seedName;
        //string seedLink;
        string keyWords;
        uint256 chargeAmount;
        uint256 seedId; // The primary key
        uint256 endorseAmount;
        address payable seedOwner;
        string seedDescription;
    }

    mapping(uint256 => SeedInfo) public magnetItemsPublicInfo;
    mapping(uint256 => string) magnetItemsSeedLinks;            // Archive the seed link for each seed
    mapping(address => uint[]) public OwnerSeedsSummary;        // Archive all the IDs of uploaded seeds for each writer
    mapping(uint => address[]) public SeedsOwnerSummary;        // Archive the writer for each seed
    mapping(address => uint[]) public endorseableSeedsSummary;  // Archive all the seeds that a user can endorse
    
    string public billboardName;
    string empty = '';
    uint256 seedAmount = 0; // The number of seeds/files on the magnet link billboard

    // A SeedUploaded event is emitted after uploading a seed to the billboard
    event SeedUploaded (
        uint256 indexed seedId,
        address payable indexed seedOwner,
        string seedName,
        string keyWords,
        string seedDescription,
        uint256 chargeAmount,
        uint256 endorseAmount
    );

    // A SeedDownloaded event is emitted after downloading a seed from the billboard
    event SeedDownloaded (
        uint256 indexed seedId,
        address payable indexed seedOwner,
        string seedName,
        string keyWords,
        string seedDescription,
        uint256 chargeAmount,
        uint256 endorseAmount
    );

    constructor() public {
        billboardName = "Magnet Link Billboard";
    }

    /** A writer can contribute to the billboard by uploading a valid file/seed **/
    /** Input:                                                                  **/
    /** _seedName: The name of the uploaded file/seed, should not be empty      **/
    /** _seedLink: The link of the uploaded file/seed, should not be empty      **/
    /** _keyWords: The key words of the uploaded file/seed, should not be empty **/
    /** _chargeAmount: The charge that a visitor needs to pay if he/she wants   **/
    /**                to download the file/seed, should not be smaller than 0  **/
    /** _seedDescription: A simple description of the content in the file/seed, **/
    /**                   should not be empty                                   **/
    /** Output:                                                                 **/
    /** A SeedUploaded event                                                    **/
    function upload(string memory _seedName, string memory _seedLink, string memory _keyWords, uint256 _chargeAmount, string memory _seedDescription) public {

        require(keccak256(bytes(_seedName)) != keccak256(bytes(empty)), 'invalid seedName');
        require(keccak256(bytes(_seedLink)) != keccak256(bytes(empty)), 'invalid seedLink');
        require(keccak256(bytes(_keyWords)) != keccak256(bytes(empty)), 'invalid keyWords');
        require(keccak256(bytes(_seedDescription)) != keccak256(bytes(empty)), 'invalid seedDescription');
        require(_chargeAmount >= 0);

        seedAmount += 1;            // Increase the amount of seeds on the billboard
        uint256 seedId= seedAmount; // Assign the seed ID

        // Archive the basic information of the uploaded seed, and record the seed link separately
        magnetItemsPublicInfo[seedId] = SeedInfo(_seedName, _keyWords, _chargeAmount, seedId, 0, msg.sender, _seedDescription);
        magnetItemsSeedLinks[seedId] = _seedLink;

        // Doubly link the writer and the seed ID, indicating the writer owns this seed, and the seed belongs to the writer
        OwnerSeedsSummary[msg.sender].push(magnetItemsPublicInfo[seedId].seedId);
        SeedsOwnerSummary[magnetItemsPublicInfo[seedId].seedId].push(msg.sender);

        // An uploaded seed can be endorsed by the visitors later on
        endorseableSeedsSummary[msg.sender].push(magnetItemsPublicInfo[seedId].seedId);

        emit SeedUploaded(seedId, msg.sender, _seedName, _keyWords, _seedDescription, _chargeAmount, magnetItemsPublicInfo[seedId].endorseAmount);

    }

    /** A visitor can download a file/seed from the billboard             **/
    /** Input:                                                            **/
    /** _seedID: The index that points to the downloaded seed, should not **/ 
    /**          smaller than 0 or exceed the existing amount of seed     **/
    /** Output:                                                           **/
    /** magnetItemsSeedLinks[_seedId]: The link to the downloaded seed    **/
    /** A SeedDownloaded event                                            **/
    function download(uint256 _seedId) public payable returns(string memory){

        SeedInfo memory _seed = magnetItemsPublicInfo[_seedId];
        address payable _uploader = _seed.seedOwner;
        require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'The seed does not exist');

        // The vistor should have enough ether if he/she wants to download the file
        require(msg.value >= _seed.chargeAmount, 'You have insufficient ether');

        // The writer cannot download the files he/she uploads to the billboard
        require(msg.sender != _uploader, 'You cannot download your own resources.');
        bool exist = false;
        for (uint8 i=0; i<OwnerSeedsSummary[msg.sender].length; i++){
            if (OwnerSeedsSummary[msg.sender][i]==_seedId){
                exist = true;
                msg.sender.transfer(msg.value);
                break;
            }
        }

        // Every vistor can only download each file/seed once
        require(!exist, "You have already download the seed");

        // 90% of the chargeAmount will be given to the writer who uploads the seed, the remains will be stored in the contract
        _uploader.transfer(_seed.chargeAmount*9/10);

        // Refund the extra ether to the visitor
        msg.sender.transfer(msg.value - _seed.chargeAmount);

        // After downloading the seed, the visitor owns the seed as well
        OwnerSeedsSummary[msg.sender].push(magnetItemsPublicInfo[_seedId].seedId);
        SeedsOwnerSummary[magnetItemsPublicInfo[_seedId].seedId].push(msg.sender);
        endorseableSeedsSummary[msg.sender].push(magnetItemsPublicInfo[_seedId].seedId);

        emit SeedDownloaded(seedAmount, msg.sender, _seed.seedName, _seed.keyWords, _seed.seedDescription, _seed.chargeAmount, _seed.endorseAmount);
        return magnetItemsSeedLinks[_seedId];
    }


    // function search(string memory _keyWords) public returns (uint[] memory) {

    //     // require(keyMap[_keyWords].seedId > 0 && keyMap[_keyWords].seedId <= seedAmount, 'seed should be uploaded');

    //     for (uint256 i=0; i < seedAmount; i++ ) {

    //         SeedInfo memory _seed = magnetItems[i];

    //         if (keccak256(abi.encodePacked(_seed.keyWords)) == keccak256(abi.encodePacked(_keyWords))) {

    //             SearchResult[keyMap[_keyWords].keyWords].push(keyMap[_keyWords].seedId);
    //             break;
    //         }
    //     }
    //     return (SearchResult[_keyWords]);   
    // }

    /** A visitor can endorse a file/seed on the billboard                **/
    /** Input:                                                            **/
    /** _seedID: The index that points to the downloaded seed, should not **/ 
    /**          smaller than 0 or exceed the existing amount of seed     **/
    function endorse(uint256 _seedId) public {

        require(_seedId > 0 && _seedId <= seedAmount, 'The seed does not exist');
        bool found = false;

        // This for loop is used to contrain only the user, who has downloaded this seed, can endorse it

        for (uint256 i = 0; i < endorseableSeedsSummary[msg.sender].length; i++) {

            if (endorseableSeedsSummary[msg.sender][i] == _seedId) {
                // The writer cannot endorse the seeds he/she uploads to the billboard
                require((msg.sender) != (magnetItemsPublicInfo[_seedId].seedOwner), "You cannot endorse your own torrent file." );
                
                // Constrain each user can endorse each seed only once
                removeEndorsedSeeds(i);

                // The seed owner receives the rewards when his/her seed has been endorsed
                magnetItemsPublicInfo[_seedId].seedOwner.transfer(contractBalance()/100000000000);
                magnetItemsPublicInfo[_seedId].endorseAmount ++;
                found = true;

                break;
            }
        }
        require(found, "Only the downloaded seeds can be endorsed, or you have already endorsed that seed");
    }

    /** This function is designed to avoid a visitor endorsing the same   **/
    /** seed more than once                                               **/
    /** Input:                                                            **/
    /** _seedID: The index that points to the downloaded seed, should not **/ 
    /**          smaller than 0 or exceed the existing amount of seed     **/
    function removeEndorsedSeeds(uint256 index) internal {
        uint lastIndex = endorseableSeedsSummary[msg.sender].length-1;
        require (index <= lastIndex, "Target index does not exist");
        // Swap the target seed and the last seed, and remove the target seed
        uint temp = endorseableSeedsSummary[msg.sender][lastIndex];
        endorseableSeedsSummary[msg.sender][lastIndex] = endorseableSeedsSummary[msg.sender][index];
        endorseableSeedsSummary[msg.sender][index] = temp;
        endorseableSeedsSummary[msg.sender].pop();
    }


    /** Check the balance in the smart contract **/
    function contractBalance() public view returns (uint256 contractEth){

        return (address(this).balance);
    }

    /** Check the owner of the designated seed                                   **/
    /** Input:                                                                   **/
    /** _seedID: The index that points to the designated seed                    **/
    /** Output:                                                                  **/
    /** SeedsOwnerSummary[_seedId]: The address of the writer that owns the seed **/
    function checkSeedOwner(uint256 _seedId) public view returns (address[] memory) {

        return (SeedsOwnerSummary[_seedId]);
    }

    /** Check the owner of the designated seed                                   **/
    /** Output:                                                                  **/
    /** OwnerSeedsSummary[msg.sender]: A 1-D array that contains all the IDs of  **/
    /**                                the seeds that belong to the writer       **/
    function checkUserSeeds() public view returns (uint[] memory) {

        return (OwnerSeedsSummary[msg.sender]);
    }

    /** Check the balance in the writer's account **/
    function checkSeedOwnerBalance() public view returns(uint256 SeedOwnerBalance) {

        return (msg.sender.balance);
    }


}
