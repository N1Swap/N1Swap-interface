import {message} from 'antd';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const swapContractAddress = publicRuntimeConfig['env']['CONTRACT_ADDRESS'];

console.log('T2,现在采用的合约地址是',swapContractAddress);
// import {getSunFromTrx,getTrxFromSun,getSource} from 'helper/misc';

import {address0,getIsTronlinkReady} from 'helper/tron'
import {getAmountFromHex,getAmountToInt} from 'helper/tron_util'

const tokenApprove =  async(token_contract_address,amount) => {


    if (!getIsTronlinkReady(false)) {
        console.log('Tronlink is not ready')
        return false;
    }

    const {tronWeb} = window;

    if (!token_contract_address) {
        message.error('token cannot be empty');
        return false;
    }

    if (token_contract_address == address0) {
        console.log('token是TRX不需要授权')
        return false;
    }

    console.log('T2执行了token的授权，token地址是',token_contract_address)
    console.log('T2执行了token的授权，金额是',amount)


    let contract = await tronWeb.contract().at(token_contract_address);
    try {

        let tx_id = await contract.approve(swapContractAddress,amount).send({
            feeLimit: 100000000,
            // shouldPollResponse:true
        })

        console.log('T2执行了token的授权，结果是',tx_id)

        return {
            'status' : 'success',
            'tx_id'  : tx_id 
        }

    }catch(e) {
        console.log('T2,执行错误：',e);

        return {
            'status'   : 'abort',
            'message'  : e
        }
    }


}


const getLiquidity = async(token1,token2) => {

    // console.log('T1调用了getLiquidity:',token1,token2);
    if (!getIsTronlinkReady(false)) {
        console.log('Tronlink is not ready')
        return false;
    }

    const {tronWeb} = window;

    if (!token1 || !token2) {
        message.error('token cannot be empty');
        return false;
    }

    let token1_address = token1.contract_address;
    let token2_address = token2.contract_address;

    // console.log('T1初始化数据以后:',token1_address,token2_address);

    if (!token1_address || !token2_address) {
        message.error('token cannot be empty');
        return false;
    }

    // console.log('T1准备开始获得数据:',token1,token2);

    try {

        // console.log('T1合约地址:',swapContractAddress);
        let contract = await tronWeb.contract().at(swapContractAddress);

        let result = await contract.getLiquidity(token1_address,token2_address).call();
        console.log('T1获得数据的结果:', result ,token1,token2);

        if (!result) {
            ///如果没有获得最新的价格也允许继续往下执行
            return false;
        }

        return {
            'token1_amount' : getAmountFromHex(result.token1Amount,token1.decimal),
            'token2_amount' : getAmountFromHex(result.token2Amount,token2.decimal),
            'total_lp_token' : parseInt(0),
        }


    } catch(error) {
        console.error("trigger smart contract error",error)
    }
    
} 

const addLiquidity =  async(token1,token1_amount,token2,token2_amount,tolerance = 0.001) => {


    if (!getIsTronlinkReady(false)) {
        console.log('Tronlink is not ready')
        return false;
    }

    const {tronWeb} = window;


    console.log('T2执行了添加流动性的方法，数据',token1,token1_amount,token2,token2_amount,tolerance)

    let contract = await tronWeb.contract().at(swapContractAddress);
    try {

        let callvalue = 0;
        if (token1 == address0) {
            callvalue = token1_amount
        }else if (token2 == address0) {
            callvalue = token2_amount
        }

        let tx_id = await contract.addLiquidity(token1,token1_amount,token2,token2_amount,tolerance).send({
            feeLimit: 100000000,
            callValue: callvalue,
            // shouldPollResponse:true
        })

        console.log('T2执行了添加流动性的操作，结果是',tx_id)

        return {
            'status' : 'success',
            'tx_id'  : tx_id 
        }

    }catch(e) {
        console.log('T2,执行错误：',e);

        return {
            'status'   : 'abort',
            'message'  : e
        }
    }


}


module.exports = {
    getLiquidity : getLiquidity,
    tokenApprove : tokenApprove,
    addLiquidity : addLiquidity
}
