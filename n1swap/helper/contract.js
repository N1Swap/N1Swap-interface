import {message} from 'antd';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const swapContractAddress = publicRuntimeConfig['env']['CONTRACT_ADDRESS'];

// import {getSunFromTrx,getTrxFromSun,getSource} from 'helper/misc';

import {address0,getIsTronlinkReady} from 'helper/tron'



export const getLiquidity = async(token1,token2) => {

    console.log('T1调用了getLiquidity:',token1,token2);

    const {tronWeb} = window;

    if (!getIsTronlinkReady()) {
        console.log('Tronlink有问题')
        return false;
    }

    if (!token1) {
        token1 = address0;
    }else if (!token2) {
        token2 = address0;
    }
    console.log('T1初始化数据以后:',token1,token2);

    if (!token1 || !token2) {
        message.error('token cannot be empty');
        return false;
    }

    console.log('T1准备开始获得数据:',token1,token2);

    try {

        console.log('T1合约地址:',swapContractAddress);
        let contract = await tronWeb.contract().at(swapContractAddress);

        let result = await contract.getLiquidity(token1,token2).call();
        // console.log('T1获得数据的结果:', result ,token1,token2);

        if (!result) {
            ///如果没有获得最新的价格也允许继续往下执行
            return false;
        }

        return {
            'token1Amount' : parseInt(result.token1Amount._hex, 16),
            'token2Amount' : parseInt(result.token2Amount._hex, 16),
        }


    } catch(error) {
        console.error("trigger smart contract error",error)
    }
    
} 

module.exports = {


    getLiquidity : getLiquidity
}
