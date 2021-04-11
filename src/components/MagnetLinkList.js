import React, {useCallback, useContext, useEffect, useState} from 'react';
import LinkItem from "./LinkItem";
import {AppContext} from "./App";
import {Pagination} from "@material-ui/lab";

const itemsPerPage=10
function MagnetLinkList(props) {
    const appContext =useContext(AppContext)
    const deployedContract=appContext.deployedContract
    const selectedSeed=appContext.selectedSeed
    const getSeedInfosFromContract=appContext.getSeedInfosFromContract
    const seedInfos=appContext.seedInfos

    const pageCount=Math.ceil(seedInfos.length/itemsPerPage)
    const [currentPage,setCurrentPage]=useState(1)
    useEffect( ()=>{
        let timer
        (async ()=>{

            if(deployedContract){
                await getSeedInfosFromContract(true)

                timer= setInterval(()=>getSeedInfosFromContract(false),2000)
            }


        })()
        return ()=>{
            clearInterval(timer)
        }


    },[deployedContract])

    let thisPageItems=[]
    let startIndex=(currentPage-1)*itemsPerPage
    let endIndex=startIndex+itemsPerPage
    //per page items : [startIndex,endIndex)
    for(let i=startIndex; i<Math.min(seedInfos.length,endIndex);i++){
        thisPageItems.push(seedInfos[i])
    }

    return (
        <div>
            <div className="row">
                <table className=" table table-striped table-responsive-md">
                    <tbody>
                    <tr>
                        <td>Id</td>
                        <td>Name</td>
                        <td>Keywords</td>
                        <td>Seed Description</td>
                        <td>Charge Amount</td>
                        <td>Endorse Amount</td>


                    </tr>
                    {

                        thisPageItems?.map(
                            (seedInfo)=> {
                                if (seedInfo.seedId==selectedSeed.seedId){
                                   return <LinkItem key={seedInfo.seedId} seedInfo={seedInfo}  selected={true}></LinkItem>

                                }else {
                                    return  <LinkItem key={seedInfo.seedId} seedInfo={seedInfo}  selected={false}></LinkItem>

                                }
                            }
                        )
                    }

                    </tbody>
                </table>
            </div>
            <div  className="row justify-content-center">

                <Pagination
                    size="large"
                    count={pageCount}
                    page={currentPage}
                    onChange={(event, value) => {setCurrentPage(value)}}
                ></Pagination>



            </div>
        </div>




    );
};

export default MagnetLinkList;