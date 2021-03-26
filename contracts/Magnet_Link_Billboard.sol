// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
//todo: search function, update download and upload function
//optional: tag viewing, modifier,
contract magnet {

    struct SeedInfo {
        string seedName;
        string seedLink;
        string keyWords;
        uint256 chargeAmount;
        uint256 seedId; //primary key
        uint256 endorseAmount;
        address payable seedOwner;
        string seedDescription;
    }
    struct UserInfo { // * seedId -> struct
        mapping(uint256 => SeedInfo) personalSeedMap;
        SeedInfo[] personalseeds;
    }
    mapping(uint256 => SeedInfo) magnetItems;
    // mapping(address => UserInfo) users;
    //mapping(string => SeedInfo) keyMap;
    //mapping(uint=>bool)
    mapping(address=>uint[]) public OwnerSeedsSummary; //record all uploaded seeds for each owner
    mapping(uint=>address[]) public SeedsOwnerSummary; //record all owners for each seeds


    address public owner;
    string public billboardName;
    string empty = '';
    uint256 seedAmount = 0;

    event seedUploaded (
        uint256 indexed seedId,
        address payable indexed seedOwner,
        string seedName,
        string indexed keyWords,
        string seedLink,
        string seedDescription,
        uint256 chargeAmount,
        uint256 endorseAmount
    );

    event seedDownloaded (

        uint256 indexed seedId,
        address payable indexed seedOwner,
        string seedName,
        string indexed keyWords,
        string seedLink,
        string seedDescription,
        uint256 chargeAmount,
        uint256 endorseAmount
    );

    // modifier endorseonce {

    //     require();
    //     _;

    // }

    constructor() public {
        billboardName = "Magnet Link Billboard";
        owner = msg.sender;
    }


    function upload(string memory _seedName, string memory _seedLink, string memory _keyWords, uint256 _chargeAmount, string memory _seedDescription) public {

        require(keccak256(bytes(_seedName)) != keccak256(bytes(empty)), 'invalid seedName');
        require(keccak256(bytes(_seedLink)) != keccak256(bytes(empty)), 'invalid seedLink');
        require(keccak256(bytes(_keyWords)) != keccak256(bytes(empty)), 'invalid keyWords');
        require(keccak256(bytes(_seedDescription)) != keccak256(bytes(empty)), 'invalid seedDescription');
        require(_chargeAmount >= 0);

        seedAmount += 1;
        magnetItems[seedAmount] = SeedInfo(_seedName, _seedLink, _keyWords, _chargeAmount, seedAmount, 0, msg.sender, _seedDescription); //
        
        OwnerSeedsSummary[msg.sender].push(magnetItems[seedAmount].seedId); // * msg.sender push this seed into his seedArray
        SeedsOwnerSummary[magnetItems[seedAmount].seedId].push(msg.sender); // * this seed add msg.sender as one of  its owner
        
        // users[msg.sender].personalseeds.push(magnetItems[seedAmount]);
        emit seedUploaded(seedAmount, msg.sender, _seedName, _keyWords, _seedLink, _seedDescription, _chargeAmount, magnetItems[seedAmount].endorseAmount);

    }


    function download(uint256 _seedId) public payable returns(string memory){

        SeedInfo memory _seed = magnetItems[_seedId];
        address payable _uploader = _seed.seedOwner;
        require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'seed does not exist');
        require(msg.value >= _seed.chargeAmount, 'insufficient ether');
        require(msg.sender != _uploader, 'you cannot download your own resources.');
        bool exist = false;
        for (uint8 i=0; i<OwnerSeedsSummary[msg.sender].length;i++){
            if (OwnerSeedsSummary[msg.sender][i]==_seedId){
                exist = true;
                msg.sender.transfer(msg.value); //refund
                break;
            }
        }
        require(!exist, "you have already download");
        _uploader.transfer(_seed.chargeAmount*9/10); //give 0.9 to downloader; 0.1 remains in contract
        msg.sender.transfer(msg.value - _seed.chargeAmount); //return extra money
        OwnerSeedsSummary[msg.sender].push(magnetItems[_seedId].seedId);
        SeedsOwnerSummary[magnetItems[_seedId].seedId].push(msg.sender);
            
            // users[msg.sender].personalseeds.push(_seed);

        emit seedDownloaded(seedAmount, msg.sender, _seed.seedName, _seed.keyWords, _seed.seedLink, _seed.seedDescription, _seed.chargeAmount, _seed.endorseAmount);
        return magnetItems[_seedId].seedLink;
    }


    // function search(string memory _keyWords) view public
    //                 returns (uint256 seedId, string memory seedName, string memory seedDescription, address seedOwner, uint256 chargeAmount) {

    //     SeedInfo memory _seed = keyMap[_keyWords];
    //     require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'seed should be uploaded');

    //     return (_seed.seedId,_seed.seedName,_seed.seedDescription,_seed.seedOwner,_seed.chargeAmount);   

    // }


    function endorse(uint256 _seedId) public {

        require(_seedId > 0 && _seedId <= seedAmount, 'seed does not exist');
        bool found = false; 
        
        // * this for loop is to limit user only who have downloaded this seed can endorse it
        
        for (uint256 i = 0; i < OwnerSeedsSummary[msg.sender].length; i++) {
             
            if (OwnerSeedsSummary[msg.sender][i] == _seedId) {
                require((msg.sender) != (magnetItems[_seedId].seedOwner), "you cannot endorse your own torrent file." );
                magnetItems[_seedId].seedOwner.transfer(contractBalance()/100000000000);
                magnetItems[_seedId].endorseAmount ++;
                found = true;
                break;
            }
        }
        require(found, "Only can endorse downloaded torrent files");
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
    
    
}
