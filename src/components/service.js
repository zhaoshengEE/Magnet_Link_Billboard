import Web3 from "web3";

export async function getWeb3ProviderAndWebSocket(window){
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    console.log("window.web3:")
    console.log(window.web3)

    window.web3Socket = new Web3("wss://rinkeby.infura.io/ws/v3/4770b93234ff418e8c15c8f67b45d41a");
    if(!window.web3Socket){
        window.alert('Please make sure your wss copied from Infura is correct.')
    }
    console.log(" window.web3Socket")
    console.log( window.web3Socket)


}

export async function connectToContract(window){

}

