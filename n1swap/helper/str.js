const strFormat = function(str,args) {

    var keys = Object.keys(args);
    keys.forEach(one=>{
        console.log('正在替换字符串预计替换',str)
        str = str.toString().replace(new RegExp("\\{" + one + "\\}", "g"), args[one]);
    })

    return str;

}

const sortStr = function(str1,str2) {
    let li = [str1,str2];
    li.sort();
    return li;
}

module.exports = {
    'strFormat' : strFormat,
    'sortStr'   : sortStr
}