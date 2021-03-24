// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

contract magnet{
    
    struct SeedInfo {
        
        string seedName;
        string seedLink;
        string keyWords;
        uint256 chargeAmount;
        uint256 seedId;
        uint256 endorseAmount;
        address payable seedOwner;
        string seedDescription;
        //bool isFree;
    }
    
    struct UserInfo {
        mapping (uint256 => SeedInfo) personalSeedMap;
        SeedInfo[] personalseeds;
    }
  
    
    mapping (uint256 => SeedInfo) magnetItems;
    mapping (address => UserInfo) users;
    mapping (string => SeedInfo) keyMap;

    
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

    // modifier onlybuyer {
        
    //     require();
    //     _;
        
    // }
    
    constructor() public {
        
        billboardName = "Magnet Link Billboard";
        owner = msg.sender;
    }
    
    
    function upload(string memory _seedName, string memory _seedLink, string memory _keyWords, uint256 _chargeAmount, string memory _seedDescription) public {
        
        require(keccak256(bytes(_seedName)) != keccak256(bytes(empty)),'invalid seedName');
        require(keccak256(bytes(_seedLink)) != keccak256(bytes(empty)),'invalid seedLink');
        require(keccak256(bytes(_keyWords)) != keccak256(bytes(empty)),'invalid keyWords');        
        require(keccak256(bytes(_seedDescription)) != keccak256(bytes(empty)),'invalid seedDescription');       
        require(_chargeAmount >= 0);
        
        seedAmount += 1;
        magnetItems[seedAmount] = SeedInfo(_seedName,_seedLink,_keyWords,_chargeAmount,seedAmount,0,msg.sender,_seedDescription);
        users[msg.sender].personalseeds.push(magnetItems[seedAmount]);
        emit seedUploaded(seedAmount,msg.sender,_seedName,_keyWords,_seedLink,_seedDescription,_chargeAmount,magnetItems[seedAmount].endorseAmount);
        
    }
    
    
    function download(uint256 _seedId) public payable {
        
        SeedInfo memory _seed = magnetItems[_seedId];
        address payable _uploader = _seed.seedOwner;
        require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'seed should be uploaded');   
        require (msg.value >= _seed.chargeAmount,'insufficient ether');
        require(msg.sender != _uploader, 'cannot download himself');
        
        if(msg.value > _seed.chargeAmount){
            
            msg.sender.transfer(msg.value - _seed.chargeAmount);
            users[msg.sender].personalseeds.push(_seed);
        }
        
        emit seedDownloaded(seedAmount,msg.sender,_seed.seedName,_seed.keyWords,_seed.seedLink,_seed.seedDescription,_seed.chargeAmount,_seed.endorseAmount);
    }
    
    
    // function search(string memory _keyWords) view public
    //                 returns (uint256 seedId, string memory seedName, string memory seedDescription, address seedOwner, uint256 chargeAmount) {

    //     SeedInfo memory _seed = keyMap[_keyWords];
    //     require(_seed.seedId > 0 && _seed.seedId <= seedAmount, 'seed should be uploaded');
        
    //     return (_seed.seedId,_seed.seedName,_seed.seedDescription,_seed.seedOwner,_seed.chargeAmount);   
        
    // }
    
    
    function endorse(uint256 _seedId) public {
        
        require(_seedId > 0 && _seedId <= seedAmount, 'seed should exists');
        
        //只有下载之后才可以endorse 在自己的种子数组中遍历
        
        for (uint256 i=0; i <= seedAmount; i++) {
            
            if (users[msg.sender].personalseeds[i].seedId == _seedId) {
                
                users[msg.sender].personalseeds[i].seedOwner.transfer(users[msg.sender].personalseeds[i].chargeAmount*9/10);
                users[msg.sender].personalseeds[i].endorseAmount ++;
            }
        }
        
    }
    
    
    function contractBalance() public view returns(uint256 contractEth){

        return (address(this).balance);

    }    
}
