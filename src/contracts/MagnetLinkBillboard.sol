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
        uint256 seedId; //primary key
        uint256 endorseAmount;
        address payable seedOwner;
        string seedDescription;
    }
    mapping(uint256 => SeedInfo) public magnetItemsPublicInfo;
    mapping(uint256 => string) magnetItemsSeedLinks;
    mapping(address => uint[]) public OwnerSeedsSummary; //record all uploaded seeds for each owner
    mapping(uint => address[]) public SeedsOwnerSummary; //record all owners for each seeds
    mapping(address => uint[]) public endorseableSeedsSummary;
    string public billboardName;
    string empty = '';
    uint256 public seedAmount = 0;
    mapping(address => uint) public uploadAndDownloadCounter;

    event SeedUploaded (
        uint256 indexed seedId,
        address payable indexed seedOwner,
        string seedName,
        string keyWords,
        string seedDescription,
        uint256 chargeAmount,
        uint256 endorseAmount
    );

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


    function upload(string memory _seedName, string memory _seedLink, string memory _keyWords, uint256 _chargeAmount, string memory _seedDescription) public {

        require(keccak256(bytes(_seedName)) != keccak256(bytes(empty)), 'invalid seedName');
        require(keccak256(bytes(_seedLink)) != keccak256(bytes(empty)), 'invalid seedLink');
        require(keccak256(bytes(_keyWords)) != keccak256(bytes(empty)), 'invalid keyWords');
        require(keccak256(bytes(_seedDescription)) != keccak256(bytes(empty)), 'invalid seedDescription');
        require(_chargeAmount >= 0);

        seedAmount += 1;
        uint256 seedId= seedAmount;
        magnetItemsPublicInfo[seedId] = SeedInfo(_seedName, _keyWords, _chargeAmount, seedId, 0, msg.sender, _seedDescription); //
        magnetItemsSeedLinks[seedId] = _seedLink;
        OwnerSeedsSummary[msg.sender].push(magnetItemsPublicInfo[seedId].seedId); // * msg.sender push this seed into his seedArray
        SeedsOwnerSummary[magnetItemsPublicInfo[seedId].seedId].push(msg.sender); // * this seed add msg.sender as one of  its owner
        endorseableSeedsSummary[msg.sender].push(magnetItemsPublicInfo[seedId].seedId);
        uploadAndDownloadCounter[msg.sender] += 1;
        
        emit SeedUploaded(seedId, msg.sender, _seedName, _keyWords, _seedDescription, _chargeAmount, magnetItemsPublicInfo[seedId].endorseAmount);

    }
    function getLink(uint256 _seedId) public view returns(string memory){
        return magnetItemsSeedLinks[_seedId];
    }

    function download(uint256 _seedId) public payable returns(bool){
        bool transcationSucceed = false;
        SeedInfo memory _seed = magnetItemsPublicInfo[_seedId];
        address payable _uploader = _seed.seedOwner;
        require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'seed does not exist');
        require(msg.value >= _seed.chargeAmount, 'insufficient ether');
        require(msg.sender != _uploader, 'you cannot download your own resources.');
        bool exist = false;
        for (uint8 i=0; i<OwnerSeedsSummary[msg.sender].length; i++){
            if (OwnerSeedsSummary[msg.sender][i]==_seedId){
                exist = true;
                msg.sender.transfer(msg.value); //refund
                break;
            }
        }
        require(!exist, "you have already download");
        _uploader.transfer(_seed.chargeAmount*9/10); //give 0.9 to downloader; 0.1 remains in contract
        msg.sender.transfer(msg.value - _seed.chargeAmount); //return extra money
        OwnerSeedsSummary[msg.sender].push(magnetItemsPublicInfo[_seedId].seedId);
        SeedsOwnerSummary[magnetItemsPublicInfo[_seedId].seedId].push(msg.sender);
        endorseableSeedsSummary[msg.sender].push(magnetItemsPublicInfo[_seedId].seedId);
        uploadAndDownloadCounter[msg.sender] += 1;
        
        emit SeedDownloaded(seedAmount, msg.sender, _seed.seedName, _seed.keyWords, _seed.seedDescription, _seed.chargeAmount, _seed.endorseAmount);
        transcationSucceed = true;
        return transcationSucceed;
        // return magnetItemsSeedLinks[_seedId];
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


    function endorse(uint256 _seedId) public {

        require(_seedId > 0 && _seedId <= seedAmount, 'seed does not exist');
        bool found = false; 

        // * this for loop is to limit user only who have downloaded this seed can endorse it
        
        for (uint256 i = 0; i < endorseableSeedsSummary[msg.sender].length; i++) {

            if (endorseableSeedsSummary[msg.sender][i] == _seedId) {
                require((msg.sender) != (magnetItemsPublicInfo[_seedId].seedOwner), "you cannot endorse your own torrent file." );
                removeEndorsedSeeds(i);
                magnetItemsPublicInfo[_seedId].seedOwner.transfer(contractBalance()/100000000000);
                magnetItemsPublicInfo[_seedId].endorseAmount ++;
                found = true;
                
                break;
            }
        }
        require(found, "Only can endorse downloaded torrent files; or you have already endorsed");
    }
    
    
    function removeEndorsedSeeds(uint256 index) internal {
        uint lastIndex = endorseableSeedsSummary[msg.sender].length-1;
        require (index <= lastIndex, "target index does not exist");
        //swap target and the last one
        uint temp = endorseableSeedsSummary[msg.sender][lastIndex];
        endorseableSeedsSummary[msg.sender][lastIndex] = endorseableSeedsSummary[msg.sender][index];
        endorseableSeedsSummary[msg.sender][index] = temp;
        endorseableSeedsSummary[msg.sender].pop();
    }



    function contractBalance() public view returns (uint256 contractEth){

        return (address(this).balance);
    }
    
    function checkSeedOwner(uint256 _seedId) public view returns (address[] memory) {
        
        return (SeedsOwnerSummary[_seedId]);
    }
    
    function checkUserSeeds() public view returns (uint[] memory) {
        
        return (OwnerSeedsSummary[msg.sender]);
    }
    
    function checkSeedOwnerBalance() public view returns(uint256 SeedOwnerBalance) {
        
        return (msg.sender.balance);
    }
    
    
    
}
