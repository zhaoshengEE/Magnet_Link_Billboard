import React, {useCallback, useEffect, useState} from 'react';
import LinkItem from "./LinkItem";

const style={

    border: "1px solid black"
}
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
        let timer
        (async ()=>{
            const deployedContract= props.deployedContract
            if(deployedContract){
                await getSeedInfosFromContract()

                timer= setInterval(getSeedInfosFromContract,5000)
            }

            return()=>{
                clearInterval(timer)
            }

        })()

    },[props.deployedContract])




    let getSeedInfosFromContract= async ()=>{
        console.log("--------in getSeedInfosFromContract")
        const deployedContract=props.deployedContract
        let seedAmount=await deployedContract.methods.seedAmount().call()
        console.log("seedAmount")
        console.log(seedAmount.toString())

        if (seedInfos==null||seedAmount>seedInfos.length){
            let seeds=[]
            for (let i = 1; i <=seedAmount; i++) {
                let res=await deployedContract.methods.magnetItemsPublicInfo(i).call()
                seeds.push(res)

            }
            setSeedInfos(seeds)

        }

    }





    return (
        <div>

            <table style={style}>
                <tbody>
                { seedInfos!=null&&
                    seedInfos.map((seedInfo)=>{
                    return <LinkItem key={seedInfo.seedId} seedInfo={seedInfo}>test</LinkItem>
                    })
                }


                </tbody>
            </table>


        </div>
    );
};

export default MagnetLinkList;