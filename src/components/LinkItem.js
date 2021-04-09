import React, {useState} from 'react';

const azure = '#f0ffff';
const lightgreen = '#90ee90';

const SeedItem = (props) => {
    const seedInfo=props.seedInfo;
    const [color, setColor] = useState(azure);
    const newColor = color == azure ? lightgreen : azure;

    return (
        <tr style={{backgroundColor: color}}>
            <td onClick={()=>setColor(newColor)}> {seedInfo.seedId} </td>
            <td onClick={()=>setColor(newColor)}> name: {seedInfo.seedName} </td>
            <td onClick={()=>setColor(newColor)}> keyWords: {seedInfo.keyWords} </td>
            <td onClick={()=>setColor(newColor)}> seedDescription: {seedInfo.seedDescription} </td>
            <td onClick={()=>setColor(newColor)}> endorseAmount: {seedInfo.endorseAmount} </td>


        </tr>


    );
};

export default SeedItem;