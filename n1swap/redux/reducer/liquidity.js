import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";

import { createAction, createReducer } from 'redux-act';

export const add_liquidity = createAction('add_liquidity');
export const remove_liquidity = createAction('remove_liquidity');

export const set_liquidity_lp_token = createAction('set_liquidity_lp_token');
export const set_liquidity_pool = createAction('set_liquidity_pool');

import {sortStr} from 'helper/str'
import {wrapper} from 'redux/store';

import {getLPTokenBalance,getLiquidity} from 'helper/contract';

export const get_liquidity_by_token = (disptch) =>  async (token1,token2,account) => {

    ///1.获得具体的流动性
    let result = await getLPTokenBalance(token1,token2,account);

    if (result.status == 'success') {
        let li = sortStr(token1.contract_address,token2.contract_address);
        disptch(set_liquidity_lp_token({
            'token1'    : li[0],
            'token2'    : li[1],
            'lp_token'  : result.data
        }))
    }

    return result;

}

export const get_pool_by_token = (disptch) =>  async (token1,token2) => {

    ///1.获得具体的流动性
    let result = await getLiquidity(token1,token2);
    if (result.status == 'success') {

        let li = sortStr(token1.contract_address,token2.contract_address);
        disptch(set_liquidity_pool({
            'token1'            : li[0],
            'token2'            : li[1],
            'total_lp_token'    : result.total_lp_token,
            'token1_amount'     : result.token1_amount,
            'token2_amount'     : result.token2_amount,
        }))
    }

    return result;
}


export const reducer = createReducer({
    // [add_liquidity]  : (state,payload)   =>  {
    //     let list = state.get('list');
    //     list.map(one=>{
    //     })
    //     return state.setIn(['balance',payload['token']],Immutable.fromJS(payload['data']))
    // },
    // [remove_liquidity] : (state,payload) => state.setIn(['balance'],Immutable.Map({}))
    [set_liquidity_lp_token] : (state,payload) => {
        return state.setIn(['lp_token',payload.token1,payload.token2],payload.lp_token);
    },
    [set_liquidity_pool] : (state,payload) => {
        return state.setIn(['pool',payload.token1,payload.token2],Immutable.Map({
            'total_lp_token'    : payload.total_lp_token,
            'token1_amount'     : payload.token1_amount,
            'token2_amount'     : payload.token2_amount,
        }));
    },

}, Immutable.fromJS({
    'pool'     : {},
    'lp_token' : {},
})); 