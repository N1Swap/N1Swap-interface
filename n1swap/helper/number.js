const percentDecimal = function(num , dec = 2) {
    return (100 * num).toFixed(dec);
}

const autoDecimal = function(num) {
    num = Number(num);
    let foramt_num = num;
    if (num > 1) {
        foramt_num = num.toFixed(2);
    }else if(num > 0.001) {
        foramt_num = num.toFixed(4);
    }else if(num > 0.0000001) {
        foramt_num = num.toFixed(8);
    }else {
        foramt_num = num.toFixed(8);
    }

    return parseFloat(foramt_num);
}


const getPoolPercent = (token_amount,total_amount) => {
    token_amount = Number(token_amount);
    total_amount = Number(total_amount);
    console.log('计算我占据的算力，原始输入',token_amount,total_amount)
    if (token_amount) {
        let p = token_amount / (total_amount + token_amount)
        console.log('计算我占据的算力大约是',p)
        if (p < 0.0001) {
            return  "<" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
        }else {
            return "≈" + percentDecimal(token_amount / (total_amount + token_amount)) + '%'
        }
    }else {
        return '-';
    }
}

const getIntAmount = (token_amount,total_decimal) => {
    return Number(token_amount) * Math.pow(10,total_decimal);
}


const getPoolPriceAfter = (pool_amount1,pool_amount2,amount1) => {
    amount1 = Number(amount1)
    return (pool_amount1/pool_amount2)*Math.pow(1+(amount1/pool_amount1),2)
}


const getExchangePrice = (pool_amount1,pool_amount2,amount1) => {
    amount1 = Number(amount1)
    // console.log('T7,getExchangePrice输入',pool_amount1,pool_amount2,amount1)
    // console.log('T7,计算变动的amount2',(pool_amount2*amount1 / (pool_amount1 + amount1)))
    // console.log('T7,计算变动的amount1/amount2的价格',amount1 / (pool_amount2*amount1 / (pool_amount1 + amount1)))
    return amount1 / (pool_amount2*amount1 / (pool_amount1 + amount1))  ;
}

/*
*   Uniswap的交易遵循的规则如下
*   如果我们认为池子里一共有x,y个代币，每次交易x'和y'个代币，交易完成以后的池子代币金额是x2和y2
*   1.x*y = x2 * y2 = (x+x')*(y-y')
*   2.y' = y * (x' / (x+x')) 
*   由公示1可以推算出来公式3
*   3.x' = (x * y / (y - y')) - x
*/
const getToAmount = (pool_amount1,pool_amount2,amount1) => {
    amount1 = Number(amount1)
    return (pool_amount2*amount1 / (pool_amount1 + amount1));
}



const getFromAmount = (pool_amount1,pool_amount2,amount2) => {
    amount1 = Number(amount2)
    return (pool_amount1*pool_amount2 / (pool_amount2 - amount2)) - pool_amount1;
}


module.exports = {
    'percentDecimal' : percentDecimal,
    'autoDecimal'    : autoDecimal,
    'getPoolPercent' : getPoolPercent,
    'getIntAmount'   : getIntAmount,
    'getPoolPriceAfter' : getPoolPriceAfter,
    'getExchangePrice'  : getExchangePrice,
    'getToAmount'       : getToAmount,
    'getFromAmount'     : getFromAmount
}