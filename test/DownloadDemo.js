const account1Balance=53.5144
const account2Balance=6.7965
const chargeAmount=3
const contractBalance=0.399999999996

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

`)

if(" "){
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
}



