
export const getTronLinkLoginAccount = () => {
    if(window.tronWeb && window.tronWeb.defaultAddress.base58){
        return window.tronWeb.defaultAddress.base58;
    }else {
        return null;
    }
}

export const getIsInstalledTronLink = () => {
    if(window.tronWeb){
        return true;
    }else {
        return false;
    }
}


export const getIsLoginTronLink = () => {
    if(window.tronWeb && window.tronWeb.ready){
        return true;
    }else {
        return false;
    }
}

export const sendTx = (account_name,amount) => {
    var obj = setInterval(async ()=>{
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {

        console.log('准备发送一笔交易，接收地址：',account_name);
        console.log('准备发送一笔交易，金额：',amount);
        console.log('准备发送一笔交易，发送地址：',window.tronWeb.defaultAddress.base58);

        clearInterval(obj)
        var tronweb = window.tronWeb
        var tx = await tronweb.transactionBuilder.sendTrx(account_name, amount, window.tronWeb.defaultAddress.base58)
        console.log('获得的tx是:',tx);

        var signedTx = await tronweb.trx.sign(tx)
        var broastTx = await tronweb.trx.sendRawTransaction(signedTx)
        console.log(broastTx)
    }
    }, 10)
}