import React from 'react';

const SeedItem = (props) => {
    const seedInfo=props.seedInfo
    return (
        <tr>
            <td> {seedInfo.seedId} </td>
            <td> name: {seedInfo.seedName} </td>
            <td> keyWords: {seedInfo.keyWords} </td>
            <td> seedDescription: {seedInfo.seedDescription} </td>
            <td> endorseAmount: {seedInfo.endorseAmount} </td>


        </tr>


    );
};

export default SeedItem;