const initialState = {
  time: 0,
  isRunning: false,
  laps: [],
};

const timerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_TIMER':
      return {...state, isRunning: true};
    case 'STOP_TIMER':
      return {...state, isRunning: false};
    case 'RESET_TIMER':
      return {...state, time: 0, laps: []};
    case 'UPDATE_TIME':
      return {...state, time: action.payload};
    case 'ADD_LAP':
      return {...state, laps: [...state.laps, action.payload]};
    default:
      return state;
  }
};

export default timerReducer;
