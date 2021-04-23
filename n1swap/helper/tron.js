import {message} from 'antd';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const trc20ContractAddress = publicRuntimeConfig['env']['CONTRACT_ADDRESS'];

import {getSunFromTrx,getTrxFromSun,getSource} from 'helper/misc';

const getTronLinkLoginAccount = () => {
    if(window.tronWeb && window.tronWeb.defaultAddress.base58){
        return window.tronWeb.defaultAddress.base58;
    }else {
        return null;
    }
}

const getIsInstalledTronLink = () => {
    if(window.tronWeb){
        return true;
    }else {
        return false;
    }
}

const getTronWeb = () => {
    if(window.tronWeb && window.tronWeb.ready){
        return window.tronWeb;
    }else {
        return null;
    }
}


const getIsTronlinkReady = (with_message = true) => {

    let {tronWeb} = window;

    if (!tronWeb) {
        if (with_message) {
            message.error('tronlink is not installed');
        }
        return false;
    }
    if (!tronWeb.ready) {
        if (with_message) {
            message.error('tronlink is not ready');
        }
        return false;
    }

    return true;
}


const HexToBase58 = (hex) => {
    return tronWeb.address.fromHex(hex);
}

const Base58ToHex = (base58) => {
    return tronWeb.address.toHex(base58);
}

const getTrxBalance = async (addr) => {
    const {tronWeb} = window;

    if (!getIsTronlinkReady()) {
        return false;
    }
    
    let balance = await tronWeb.trx.getBalance(addr);

    console.log('trx余额',balance)
    return balance;

}

const address0 = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

const getTokenBalance = async (addr,contract_address) => {
    const {tronWeb} = window;

    if (!getIsTronlinkReady()) {
        return false;
    }

    let balance = null;
    try {
        let contract = await tronWeb.contract().at(contract_address);
        let result = await contract.balanceOf(addr).call();
        balance = parseInt(result._hex, 16)
        console.log('getTokenBalance:', balance);

    } catch(error) {
        console.error("trigger smart contract error",error)
    }

    
    return balance;

}
// export const sendTx = (account_name,amount,fun = null) => {
//     var obj = setInterval(async ()=>{
//         if (window.tronWeb && window.tronWeb.defaultAddress.base58) {

//             console.log('准备发送一笔交易，接收地址：',account_name);
//             console.log('准备发送一笔交易，金额：',amount);
//             console.log('准备发送一笔交易，发送地址：',window.tronWeb.defaultAddress.base58);

//             clearInterval(obj)
        
//             var tronweb = window.tronWeb
//             var tx = await tronweb.transactionBuilder.sendTrx(account_name, amount, window.tronWeb.defaultAddress.base58)
        
//             console.log('获得的tx是:',tx);

//             var signedTx = await tronweb.trx.sign(tx)
//             var broastTx = await tronweb.trx.sendRawTransaction(signedTx)
//             console.log(broastTx)

//             if (typeof fun == 'function') {
//                 fun();
//             }
//         }
//     }, 10)
// }

const getTx = async(txid) => {

    const {tronWeb} = window;

    if (!getIsTronlinkReady()) {
        return false;
    }

    let result = await tronWeb.trx.getTransaction(txid);
    return result['ret'];

}



// export const checkPixelPrice = async(x,y,price) => {

//     const {tronWeb} = window;

//     if (!getIsTronlinkReady()) {
//         return false;
//     }

//     if (x < 0 || y < 0 || x > 255 || y > 255) {
//         message.error('pixel is not exist');
//         return false;
//     }

//     if (price < 10) {
//         message.error('price must over 10');
//         return false;
//     }

//     try {
//         let contract = await tronWeb.contract().at(trc20ContractAddress);

//         let result = await contract.getMinBidPrice(x,y).call();
//         console.log('getMinBidPrice:', result ,x ,y);

//         if (!result) {
//             ///如果没有获得最新的价格也允许继续往下执行
//             return true;
//         }

//         let require_number = parseInt(result._hex, 16)

//         if (require_number <= getSunFromTrx(price)) {
//             ///价格大于最低需求价格
//             return true;
//         }else {
//             message.error('The Price must over '+getTrxFromSun(require_number)+' Trx');
//             console.log('传入的价格过小，要求',require_number,getSunFromTrx(price));
//             return false;
//         }


//     } catch(error) {
//         console.error("trigger smart contract error",error)
//     }
    
// } 


// export const buyPixel = async(x,y,price,r,g,b,comment = '') => {

//     const {tronWeb} = window;

//     if (!getIsTronlinkReady()) {
//         return false;
//     }

//     if (x < 0 || y < 0 || x > 255 || y > 255) {
//         message.error('pixel is not exist');
//         return;
//     }

//     if (price < 10) {
//         message.error('price must over 10');
//         return;
//     }

//     try {
        
//         let contract = await tronWeb.contract().at(trc20ContractAddress);

//         let source_from = getSource();
//         if (!source_from) {
//             source_from = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';
//         }
        
//         // 获得一个点颜色
//         // let result = await contract.getPointColor('1','23').call();
//         // let result = await contract.canvas('1','23').call();
//         let tx_id;
//         if (comment) {

//             tx_id = await contract['buyOneAndPaintAndComment'](x,y,r,g,b,comment,source_from).send({
//                 feeLimit:100000000,
//                 callValue:price*1000000,
//                 // shouldPollResponse:true
//             });

//         }else {
//             tx_id = await contract['buyOneAndPaint'](x,y,r,g,b,source_from).send({
//                 feeLimit:100000000,
//                 callValue:price*1000000,
//                 // shouldPollResponse:true
//             });
//         }
//         console.log('交易已经发送',tx_id);
//         return {
//             'status' : 'success',
//             'data'   : {
//                 'tx_id'  : tx_id
//             }
//         };

//     } catch(error) {
//         // console.error("trigger smart contract error",error)
//         return {
//             'status' : 'failure',
//             'message': error
//         };
//     }
// }

module.exports = {
    getTx           : getTx,
    getTrxBalance   : getTrxBalance,

    getTokenBalance : getTokenBalance,

    HexToBase58     : HexToBase58,
    Base58ToHex     : Base58ToHex,

    getIsTronlinkReady      : getIsTronlinkReady,
    getIsInstalledTronLink  : getIsInstalledTronLink,
    getTronLinkLoginAccount : getTronLinkLoginAccount,
    // getIsLoginTronLink : getIsLoginTronLink,
    getTronWeb         : getTronWeb,

    address0           : address0


}

// export const watchingTransaction = () => {
    
//     this.tronGrid = new TronGrid(window.tronWeb);

//     const options = {
//        minBlockTimestamp: _timestamp,
//        limit:100
//     };
//     const trans = await this.tronGrid.contract.getEvents(trc20ContractAddress,options).then(transactions => {
//              console.log(transactions);
//     }).catch(err => console.error(err));
// }