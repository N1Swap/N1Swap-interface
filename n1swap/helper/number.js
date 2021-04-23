const percentDecimal = function(num , dec = 2) {
    return (100 * num).toFixed(dec);
}



module.exports = {
    'percentDecimal' : percentDecimal
}