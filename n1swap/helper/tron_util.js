
const isTronAddress = (trx_addr) => {
    trx_addr = trx_addr.toLowerCase();

    if (!trx_addr) {
        throw Error('Address is Empty')
        return false;
    }else if (trx_addr.length != 34) {
        throw Error('Not validate TRX Wallet Address')
        return false;
    } else if (trx_addr.indexOf('t') != 0) {
        throw Error('Trx Address must start with “T” word')
        return false;
    }
    return true;
}

module.exports = {
    isTronAddress : isTronAddress
}