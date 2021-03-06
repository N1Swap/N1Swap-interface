import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {createWrapper} from 'next-redux-wrapper';
import Immutable from 'immutable';

import reducer from './reducer.js';

function createMiddlewares () { // { isServer }
    let middlewares = [
        thunkMiddleware,
    ]
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        middlewares.push(createLogger({
            level: 'info',
            collapsed: true,
            stateTransformer: state => state.toJS(),
        }))
    }
    return middlewares
}

export const initStore = (initialState = {}, context) => {
  // const { isServer } = context
  const middlewares = createMiddlewares()

  return createStore(
    reducer,
    Immutable.fromJS(initialState),
    compose(
      applyMiddleware(...middlewares),
      typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}

// create a makeStore function
export const makeStore = context => initStore();

// export an assembled wrapper
// export const wrapper = createWrapper(makeStore, {debug: true});
export const wrapper = createWrapper(makeStore
    , {
        debug: true ,
        serializeState: state => state.toJS(),
        deserializeState: state => Immutable.fromJS(state),
    }
);

