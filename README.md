# Magnet_Link_Billboard

frontend url: https://www.magnetlinkbillboard.com/

https://infura.io/dashboard/ethereum/4770b93234ff418e8c15c8f67b45d41a/settings


https://rinkeby.infura.io/v3/4770b93234ff418e8c15c8f67b45d41a
wss://rinkeby.infura.io/ws/v3/4770b93234ff418e8c15c8f67b45d41a
前端界面只显示magnetItemsPublicInfo，
想获取链接要请求download(),对于免费资源直接返回链接，对于付费的资源请求的时候要带足够的钱才能返回链接

更新合约后重新部署：
    删除abis中的两个json文件，再运行：
   ` truffle migrate --network rinkeby`