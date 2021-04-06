const strFormat = function(str,args) {

    var keys = Object.keys(args);
    keys.forEach(one=>{
        // console.log('正在替换字符串预计替换',one,args[one])
        str = str.replace(new RegExp("\\{" + one + "\\}", "g"), args[one]);
    })

    return str;

}

module.exports = {
    'strFormat' : strFormat
}