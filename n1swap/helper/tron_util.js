
const isTronAddress = (trx_addr) => {
    trx_addr = trx_addr.toLowerCase();

    if (!trx_addr) {
        // throw Error('Address is Empty')
        return false;
    }else if (trx_addr.length != 34) {
        // throw Error('Not validate TRX Wallet Address')
        return false;
    } else if (trx_addr.indexOf('t') != 0) {
        // throw Error('Trx Address must start with “T” word')
        return false;
    }
    return true;
}

const getShowBlance = (balance,decimal) => {
    let decimal_num = Math.pow(10,Number(decimal))
    if (decimal_num > 0) {
        return Number(balance) / decimal_num;
    }
}


const getBalanceList = async (address) => {

    let url = "https://apilist.tronscan.org/api/account";

    const res = await fetch(url+"?"+new URLSearchParams({
        'address' : address
    }));
    const data = await res.json()

    // console.log('原始请求的结果是',data);

    // catchError(data);

    let balance = {};

    data['tokens'].map(one=>{
        console.log('token',one);

        switch(one.tokenType) {
            case 'trc20':
            case 'trc10':

                let b = {
                    'balance'    : one.balance,
                    'decimal'    : one.tokenDecimal,
                    'type'       : one.tokenType,
                    'show_balance' : getShowBlance(one.balance,one.tokenDecimal),
                    'token_name' : one.tokenName,
                    'token_abbr' : one.tokenAbbr
                }

                let unique_id;
                if (b.type == 'trc20') {
                    unique_id = one.tokenId
                }else if (b.type == 'trc10') {
                    if (one.tokenId == '_') {
                        unique_id = 'trx'
                    }else {
                        unique_id = one.owner_address
                    }
                }

                if (unique_id) {
                    balance[unique_id] = b;
                }

                break;
            default:
                break;
        }

    })

    return balance;
}



module.exports = {
    isTronAddress  : isTronAddress,
    getBalanceList : getBalanceList
}