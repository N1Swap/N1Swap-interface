
import getConfig from 'next/config'
import Cookies from 'universal-cookie';

const { publicRuntimeConfig } = getConfig()


export const pageReady = (func) => {
    window.addEventListener('load', function() {
        func();
    });
}

export const  componentToHex = function(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export const  rgbToHex = function(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


export const fetchData = async function(url) {

    let fetch_url = publicRuntimeConfig['env']['API']+url;

    const res = await fetch(fetch_url)
    const data = await res.json()


    return data;
}

export const tronscanTxUrl = function(id) {
    return publicRuntimeConfig['env']['TRONSCAN_URL']+'/#/transaction/'+id;
}

export const getPixelImageUrl = function (network,timestamp) {
    return publicRuntimeConfig['env']['API'] + "/api/trx/image?timestamp="+timestamp
}

export const getTrxFromSun  = (sun,is_exact = true) => { 
    if (!is_exact) {
      return Math.ceil(Number(sun)/1000000);
    }else {
      return Number(sun)/1000000;
    }
}

export const getSunFromTrx = (trx) => { 
    return trx * 1000000;
}



export const setSource = (source_from) => {
    ///判断source_from是不是trx的钱包地址
    try {
        isTronAddress(source_from)
    }catch(e) {
        console.log('来源不是trx地址，不会记录')
        return false;
    }

    ///1.写入cookie
    const cookies = new Cookies();
    cookies.set('f', source_from, { path: '/' });

    return true;

}

export const getSource = () => {

    const cookies = new Cookies();
    let source_from = cookies.get('f');

    try {
        isTronAddress(source_from)
    }catch(e) {
        console.log('来源不是trx地址，不会使用')
        return '';
    }

    return source_from

}

export const getTimezone = () => {
    return (0 - new Date().getTimezoneOffset() / 60);
}

export const showTime = (timestamp) => {
    var date = new Date(timestamp); //获取一个时间对象
    var timezone = new Date().getTimezoneOffset()
    var d = new Date(date.getTime())

    let options = {  
        month: "short",  day: "numeric", hour: "2-digit", second: "2-digit", minute: "2-digit"  
    };  

    return d.toLocaleString("en-us", options);
}
