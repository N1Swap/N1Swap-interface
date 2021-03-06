import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";

import { createAction, createReducer } from 'redux-act';

export const tronlink_installed = createAction('tronlink_installed');
export const tronlink_logined = createAction('tronlink_logined');
export const tronlink_set_account = createAction('tronlink_set_account');

export const reducer = createReducer({
  [tronlink_installed]  : (state,payload)   =>  state.setIn(['tronlink','is_installed'],payload),
  [tronlink_logined]    : (state,payload)   =>  state.setIn(['tronlink','is_logined'],payload),
  [tronlink_set_account]: (state, payload)  =>  state.setIn(['tronlink','account'],payload),
}, Immutable.fromJS({
    'tronlink' : {
        'is_installed' : false,
        'is_login'     : false,
        'account'      : '',
    }
})); 