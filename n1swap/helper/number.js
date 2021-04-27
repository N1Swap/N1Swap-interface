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


module.exports = {
    'percentDecimal' : percentDecimal,
    'autoDecimal'    : autoDecimal,
    'getPoolPercent' : getPoolPercent,
    'getIntAmount'   : getIntAmount,
}