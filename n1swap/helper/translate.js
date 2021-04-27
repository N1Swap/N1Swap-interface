import React, { Component,useContext } from 'react';
import Text from 'helper/translate/text'

const t = function(word) {
    return <Text>{word}</Text>
}

// const getTranslate = function() {
//     const translate = useContext(translateContext);
//     console.log('debug translate,获得了数据',translate);
//     return translate;
// }

const tpure = function(word,translate) {
    return translate.localeMessage[word] ? translate.localeMessage[word] : word
}

const strFormat = function(str,args) {
    // console.log('typeof str',typeof str)
    if (typeof str == 'object') {
        str = str.props.children;
        // console.log('str',str)
    }
    var keys = Object.keys(args);
    keys.forEach(one=>{
        // console.log('正在替换字符串预计替换',str)
        str = str.toString().replace(new RegExp("\\{" + one + "\\}", "g"), args[one]);
    })
    return str;
}


module.exports = {
    t           : t,
    tpure       : tpure,
    strFormat   : strFormat,
    // getTranslate: getTranslate
}