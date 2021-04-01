import React, {useEffect} from 'react';
import * as service from './service.js';

const App = () => {

  useEffect( ()=>{
    (async ()=>{
      await service.getWeb3ProviderAndWebSocket(window)
    })()


  },[])

    return (
        <div>

        </div>
    );
};

export default App;