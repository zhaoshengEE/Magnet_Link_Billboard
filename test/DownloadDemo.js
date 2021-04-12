const account1Balance=53.2136  //0x65247d1e3ba01cd574ba10814a525e80c5f55a10
const account2Balance=6.4956   //0x922334bc42f8135f5fff779f4d55460a445d24d4
const chargeAmount=3
const contractBalance=0.999999999976


console.log(
`
account1(uploader) upload a resource with ${chargeAmount} ether chargeAmount
Before Download:
    account1Balance (uploader): ${account1Balance}
    account2Balance (downloader): ${account2Balance}
    contractBalance: ${contractBalance}
    
After downloader download:
    account1Balance (uploader): ${account1Balance+(0.9*chargeAmount)}
    account2Balance (downloader): ${account2Balance-chargeAmount}
    contractBalance: ${contractBalance+(0.1*chargeAmount)}

Users can only endorse 1 time for what they have downloaded

Users cannot repeatedly download what they have downloaded or what they uploaded

`)



