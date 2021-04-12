import {isTronAddress} from 'helper/tron_util'
import Cookies from 'universal-cookie';

const setSource = (source_from) => {
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

    console.log('记录用户来源',source_from);

    return true;
}

const getSource = () => {

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

module.exports = {
    setSource : setSource,
    getSource : getSource
}