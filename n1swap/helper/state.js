import {sortStr} from 'helper/str'
import Immutable from "immutable";

const getLpToken = function(state,token1,token2) {

    if (!token1 || !token2) {
        return 0;
    }

    let li = sortStr(token1,token2);
    let lp_token = state.getIn(['liquidity','lp_token',li[0],li[1]]);

    if (lp_token) {
        return lp_token
    }else {
        return 0
    }

}

const getPool = function(state,token1,token2) {

    if (!token1 || !token2) {
        return 0;
    }

    let li = sortStr(token1,token2);
    let pool = state.getIn(['liquidity','pool',li[0],li[1]]);

    if (pool) {
        return pool
    }else {
        return Immutable.fromJS({
            'total_lp_token'    : 0,
            'token1_amount'     : 0,
            'token2_amount'     : 0,
        })
    }

}


module.exports = {
    'getLpToken' : getLpToken,
    'getPool'    : getPool
}