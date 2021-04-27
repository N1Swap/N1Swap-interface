import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const getConfigHelper = (name) => {
    return publicRuntimeConfig['env'][name]
} 

const getTronGridApiUrl = () => {
    let tron_net = getConfigHelper('TRON_NET');
    if (tron_net == 'shasta') {
        return 'https://api.shasta.trongrid.io/'
    }else if (tron_net == 'main') {
        return 'https://api.trongrid.io/'
    }
}
const getTronscanApiUrl = () => {
    let tron_net = getConfigHelper('TRON_NET');
    if (tron_net == 'shasta') {
        return 'https://shastapi.tronscan.org/'
    }else if (tron_net == 'main') {
        return 'https://apilist.tronscan.org/'
    }
}


module.exports = {
    getConfig           : getConfigHelper,
    getTronGridApiUrl   : getTronGridApiUrl,
    getTronscanApiUrl   : getTronscanApiUrl
}
