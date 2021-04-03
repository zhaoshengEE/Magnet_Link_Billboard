import React, {useCallback, useEffect, useState} from 'react';


function MagnetLinkList(props) {

    const [seedInfos,setSeedInfos] = useState(null);
    /*
       seedInfos: [
          {
              seedName: seedName1111
              keyWords: keyWords9999
              chargeAmount: 0
              seedId: 1
              endorseAmount: 12
              seedOwner: 0x345345456
              seedDescription: dfsdfdfssdf
          },
          {
               seedName: seedName2222
              keyWords: keyWords8888
              chargeAmount: 12
              seedId: 1
              endorseAmount: 12
              seedOwner: 0x345345456
              seedDescription: dfsdfdfssdf
          }
       ]

      * */

    useEffect( ()=>{
        (async ()=>{
            const deployedContract= props.deployedContract
            if(deployedContract){

                console.log()

            }

        })()
    },[props.deployedContract])


    let getSeedInfosFromContract= useCallback(async ()=>{
        const deployedContract=props.deployedContract
        let seedAmount=await deployedContract.methods.seedAmount().call()
        console.log("seedAmount")
        console.log(seedAmount.toString())
        let seeds=[]
        for (let i = 0; i <seedAmount; i++) {
            let res=await deployedContract.methods.magnetItemsPublicInfo(i).call()
            seeds.push(res)

        }
        // const seedAmount=await deployedContract.seedAmount().call()
        // console.log(await seedAmount)

        // let res= await deployedContract.methods.magnetItemsPublicInfo().call()
        setSeedInfos(seeds)
    },[props.deployedContract])

    let uploadSeedToContract= useCallback(async ()=>{
        const deployedContract=props.deployedContract

            let uploadHandler=await deployedContract.methods.upload(
                "The.Lego.Batman.The.Movie.2017.1080p",
                "magnet:?xt=urn:btih:ADAC5F0DA8330954997C5123B00A682E9F598E1C&dn=The.Lego.Batman.The.Movie.2017.1080p.WEB-DL.DD5.1.H264-FGT%5BEt...&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2F47.ip-51-68-199.eu%3A6969%2Fannounce",
                "movie lego Batman",
                0,
                "Files: 2\n Size 3.55 GiB\nEtHD - EtHD - Et High-Definition Movies\n" +
                "\n" +
                "-----------------------------------------------------\n" +
                "                \n" +
                "[url=https://extraimage.net/image/NLIQ][/url] \n" +
                "                            \n" +
                "The.Lego.Batman.The.Movie.2017.1080p.WEB-DL.DD5.1.H264-FGT\n" +
                "                    \n" +
                "http://www.imdb.com/title/tt2465238/\n" +
                "\n" +
                "[Video Bitrate]:.............: 4865kb/s\n" +
                "[Duration]:.............: 1 h 44 min\n" +
                "[Video Codec]:.............: AVC\n" +
                "[Resolution]:.............: 1912x792 px\n" +
                "[Aspect Ratio]:.............: 2.40:1\n" +
                "[Audio Codec]:.............: AC-3\n" +
                "[Audio Bitrate]:.............: 384kb/s\n" +
                "[Audio Channels]:.............: 5.1ch\n" +
                "[Audio Language]:.............: English\n" +
                "\n" +
                "Genre .......................: Animation | Action | Adventure | Family\n" +
                "#EtHD -> To avoid fakes, ALWAYS check that the torrent was added by EtHD \n" +
                "\n" +
                "\n" +
                "                            \n" +
                "To keep us going Support us by donating Bitcoin: 12tLYJMS8ESFvw3yEjo2LjRuxXDJnzTUde\n" +
                "\n" +
                "Screens...\n" +
                "\n" +
                "https://extraimage.net/image/NLIs\n" +
                "\n" +
                "https://extraimage.net/image/NLI7\n" +
                "\n" +
                "https://extraimage.net/image/NLIc\n" +
                "  \n" +
                "https://extraimage.net/image/NLI1\n" +
                " \n" +
                "https://extraimage.net/image/NLIL"
            )

        const gasAmount = await uploadHandler.estimateGas({from: props.account})
        uploadHandler.send({from: props.account, gas: gasAmount})
            .once('receipt', async (receipt)=> {
                console.log("receipt")
                console.log(receipt)

            })
        console.log("gasAmount")
        console.log(gasAmount)
        // console.log(seedAmount.toString())
        // const seedAmount=await deployedContract.seedAmount().call()
        // console.log(await seedAmount)

        // let res=await deployedContract.methods.magnetItemsPublicInfo(seedAmount).call()
        // let res= await deployedContract.methods.magnetItemsPublicInfo().call()
        // setSeedInfos(res)
    },[props.deployedContract])





    return (
        <div>
            <table>
                {JSON.stringify(seedInfos)}
                {/*    return( <tr key={seedInfo["seedId"]}>*/}
                {/*        {seedInfo["seedId"]}*/}
                {/*        {seedInfo["seedName"]}*/}
                {/*        {seedInfo["keyWords"]}*/}
                {/*        {seedInfo["endorseAmount"]}*/}
                {/*    </tr>)*/}

                {/*})}*/}
            </table>
            <button onClick={getSeedInfosFromContract}>get</button>
            <button onClick={uploadSeedToContract}>upload</button>

        </div>
    );
};

export default MagnetLinkList;