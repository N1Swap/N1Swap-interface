import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";

import { createAction, createReducer } from 'redux-act';

export const set_balance = createAction('set_balance');
export const remove_balance_all = createAction('remove_balance_all');

export const reducer = createReducer({
  [set_balance]  : (state,payload)   =>  state.setIn(['balance',payload['token']],Immutable.fromJS(payload['data'])),
  [remove_balance_all] : (state,payload) => state.setIn(['balance'],Immutable.Map({}))
}, Immutable.fromJS({
    'list' : [],
    'balance' : Immutable.Map({})
})); 