import {HYDRATE} from 'next-redux-wrapper';
import Immutable from "immutable";
import { combineReducers } from 'redux-immutable';

import { reducer as setting } from './reducer/setting.js'
import { reducer as token } from './reducer/token.js'

function entities(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        // case HYDRATE:
        //     return state.mergeDeep(Immutable.fromJS(action.response.entities))
        default:
            return state;
    }
}

// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         case HYDRATE:
//             return {...state, ...action.payload};
//         case 'TICK':
//             return {...state, tick: action.payload};
//         default:
//             return state;
//     }
// };

// // export default reducer

const allReducer = combineReducers({
    entities,
    setting,
    token
})

export default allReducer