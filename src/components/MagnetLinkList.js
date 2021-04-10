import React, {useCallback, useContext, useEffect, useState} from 'react';
import LinkItem from "./LinkItem";
import {AppContext} from "./App";


function MagnetLinkList(props) {
    const appContext =useContext(AppContext)
    const deployedContract=appContext.deployedContract
    const selectedSeed=appContext.selectedSeed
    const getSeedInfosFromContract=appContext.getSeedInfosFromContract
    const seedInfos=appContext.seedInfos

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




    return (
        <div className="row">
            <table className="table table-striped table-responsive-md">
                <tbody>
                {
                    seedInfos?.map(
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
    );
};

export default MagnetLinkList;