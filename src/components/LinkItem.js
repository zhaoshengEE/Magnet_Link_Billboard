import React, {useState, useEffect, useContext} from 'react';
import {AppContext} from "./App";

const azure = '#f0ffff';
const lightgreen = '#90ee90';

const LinkItem = (props) => {
    const appContext =useContext(AppContext)
    const linkItemClickHandler=appContext.linkItemClickHandler

    const seedInfo=props.seedInfo;
    const [color, setColor] = useState(azure);

    useEffect(()=>{
        console.log("useEffect")
        if(props.selected) {
            setColor(lightgreen)
        }else {
            setColor(azure)
        }
    },[props.selected])



    return (
        <tr style={{backgroundColor: color}} onClick={()=>linkItemClickHandler(seedInfo)}>
            <td> {seedInfo.seedId} </td>
            <td> name: {seedInfo.seedName} </td>
            <td> keyWords: {seedInfo.keyWords} </td>
            <td> seedDescription: {seedInfo.seedDescription} </td>
            <td> Charge Amount: {seedInfo.chargeAmount} </td>
            <td> endorseAmount: {seedInfo.endorseAmount} </td>


        </tr>


    );
};

export default LinkItem;