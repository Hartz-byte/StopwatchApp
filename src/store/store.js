// import {createStore} from 'redux';
// import {combineReducers} from 'redux';
// import timerReducer from './timerReducer';

// const rootReducer = combineReducers({
//   timer: timerReducer,
// });

// const store = createStore(rootReducer);

// export default store;

import {configureStore} from '@reduxjs/toolkit';
import timerReducer from './timerReducer';

const store = configureStore({
  reducer: {
    timer: timerReducer,
  },
});

export default store;
