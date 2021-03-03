import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";

import { createAction, createReducer } from 'redux-act';

const tronlink_installed = createAction('tronlink_installed');
const tronlink_logined = createAction('tronlink_logined');
const tronlink_set_account = createAction('tronlink_set_account');

const reducer = createReducer({
  [tronlink_installed]  : (state) => state.setIn(['tronlink','is_installed'],true),
  [tronlink_logined]    : (state) =>  state.setIn(['tronlink','tronlink_logined'],true),
  [tronlink_set_account]: (state, payload) =>state.setIn(['tronlink','account'],payload),
}, Immutable.fromJS({
    'tronlink' : {
        'is_installed' : false,
        'is_login'     : false,
        'account'      : '',
    }
}); // <-- This is the default state

export default {
    'reducer' : reducer
};

// export function reducer(state = Immutable.fromJS({
//     'tronlink' : {
//         'is_installed' : false,
//         'is_login'     : false,
//         'account'      : '',
//     }
// }), action) {
//     switch (action.type) {
//         default:
//             return state
//     }
// }


