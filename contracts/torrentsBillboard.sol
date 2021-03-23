// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

contract torrentsBillboard {
    address owner;
    uint8 Tid;
    constructor(){
        owner = msg.sender;
        Tid = 0;
    }
    struct BittorrentsItem{
        uint256 Tid;
        string torrents;
        bool isFree;
        uint256 fee;
        address payable TOwner;
        string description;
        uint256 downloadTimes;
    }
    //BittorrentsItem[] private T;
    mapping(uint256=>BittorrentsItem) public _billboard;
    function uploadBittorrents(string calldata link, bool isFree, uint256 fee, string calldata words) public{
        Tid = Tid +1;
        _billboard[Tid].Tid = Tid;
        _billboard[Tid].torrents = link;
        _billboard[Tid].isFree = isFree;
        _billboard[Tid].TOwner = msg.sender;
        if (!isFree) {
            _billboard[Tid].fee = fee;
        }
        _billboard[Tid].description = words;
    }
    function downloadBittorrents(uint8 Tid) external payable returns (string memory) {
        require(msg.value >= _billboard[Tid].fee, "Your remaining eth is not enough");
        if (msg.value > _billboard[Tid].fee){
            msg.sender.transfer(msg.value-_billboard[Tid].fee);
        }
        _billboard[Tid].TOwner.transfer(_billboard[Tid].fee);
        _billboard[Tid].downloadTimes +=1;
        //check Tid...
        return _billboard[Tid].torrents;
    }
}