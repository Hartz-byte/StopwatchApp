import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {formatTime} from '../utils/formatTime';

const {width, height} = Dimensions.get('window');

// TimerState interface
interface TimerState {
  time: number;
  isRunning: boolean;
  laps: {time: number; diff: number | null}[];
}

// Lap interface
interface Lap {
  time: number;
  diff: number | null;
}

const Stopwatch = () => {
  const dispatch = useDispatch();
  const {time, isRunning, laps} = useSelector(
    (state: {timer: TimerState}) => state.timer,
  );

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [lastLapTime, setLastLapTime] = useState<number | null>(null);

  // save timer state to AsyncStorage
  const saveTimerState = async () => {
    try {
      const timerState = {time, isRunning, laps};
      await AsyncStorage.setItem('timerState', JSON.stringify(timerState));
    } catch (e) {
      console.error('Failed to save the timer state.', e);
    }
  };

  // useEffect to load timer state from AsyncStorage
  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('timerState');

        if (savedState) {
          const {
            time: savedTime,
            isRunning: savedIsRunning,
            laps: savedLaps,
          } = JSON.parse(savedState);
          dispatch({type: 'UPDATE_TIME', payload: savedTime});
          if (savedIsRunning) {
            dispatch({type: 'STOP_TIMER'});
          }

          savedLaps.forEach((lap: Lap) =>
            dispatch({type: 'ADD_LAP', payload: lap}),
          );
        }
      } catch (e) {
        console.error('Failed to load the timer state.', e);
      }
    };

    loadTimerState();
  }, [dispatch]);

  // useEffect to update the timer
  useEffect(() => {
    let startTime = Date.now() - time;

    if (isRunning) {
      const id = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        dispatch({type: 'UPDATE_TIME', payload: elapsedTime});
      }, 10);

      setIntervalId(id);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, dispatch, time]);

  // handle start functions
  const handleStart = () => dispatch({type: 'START_TIMER'});

  // handle stop functions
  const handleStop = () => {
    // save the timer state to AsyncStorage
    saveTimerState();

    dispatch({type: 'STOP_TIMER'});
  };

  // handle reset functions
  const handleReset = async () => {
    // remove the timer state to AsyncStorage
    await AsyncStorage.removeItem('timerState');

    dispatch({type: 'RESET_TIMER'});
    setLastLapTime(null);
  };

  // handle lap functions
  const handleLap = () => {
    const newLap = {
      time: time,
      diff: lastLapTime !== null ? time - lastLapTime : null,
    };
    setLastLapTime(time);
    dispatch({type: 'ADD_LAP', payload: newLap});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>

      {/* conditional buttons */}
      <View style={styles.buttonContainer}>
        {isRunning ? (
          <View style={styles.flexStyle}>
            <TouchableOpacity onPress={handleLap} style={styles.resetButton}>
              <View style={styles.innerResetButton}>
                <Text style={styles.buttonText}>Lap</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
              <View style={styles.innerStopButton}>
                <Text style={styles.stopText}>Stop</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.flexStyle}>
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <View style={styles.innerResetButton}>
                <Text style={styles.buttonText}>Reset</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStart} style={styles.startButton}>
              <View style={styles.innerStartButton}>
                <Text style={styles.startText}>Start</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* laps data view */}
      <ScrollView style={styles.lapList}>
        {laps
          .slice()
          .reverse()
          .map((lap, index) => {
            // color determination for laps
            let lapColor = 'red';
            if (index === 0) {
              lapColor = 'white';
            } else if (index === 1) {
              lapColor = '#217E36';
            }

            return (
              <View key={index} style={styles.lapContainer}>
                {/* divider */}
                <View style={styles.divider} />

                {/* lap text */}
                <View style={styles.flexStyle}>
                  <Text style={[styles.lapText, {color: lapColor}]}>
                    Lap {laps.length - index}
                  </Text>

                  {/* conditional rendering of lap time */}
                  {lap.diff === null ? (
                    <Text style={[styles.lapTimeText, {color: lapColor}]}>
                      {formatTime(lap.time)}
                    </Text>
                  ) : (
                    <Text style={[styles.lapTimeText, {color: lapColor}]}>
                      {formatTime(lap.diff)}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
    paddingTop: height * 0.18,
  },
  timeText: {
    fontSize: width < 380 ? 50 : 70,
    color: 'white',
    fontFamily: 'Inter Medium',
  },
  buttonContainer: {
    marginTop: height * 0.1,
    flexDirection: 'row',
    width: '100%',
  },
  flexStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  resetButton: {
    width: width * 0.21,
    height: width * 0.21,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333333',
  },
  innerResetButton: {
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#333333',
  },
  startButton: {
    width: width * 0.21,
    height: width * 0.21,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#092911',
  },
  innerStartButton: {
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#092911',
  },
  stopButton: {
    width: width * 0.21,
    height: width * 0.21,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#9B2D2E',
  },
  innerStopButton: {
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#9B2D2E',
  },
  buttonText: {
    color: '#fff',
    fontSize: width < 380 ? 16 : 20,
    fontFamily: 'Inter Regular',
  },
  stopText: {
    color: 'red',
    fontSize: width < 380 ? 16 : 20,
    fontFamily: 'Inter Regular',
  },
  startText: {
    color: '#217E36',
    fontSize: width < 380 ? 16 : 20,
    fontFamily: 'Inter Regular',
  },
  lapList: {
    marginTop: 40,
    maxHeight: height * 0.31,
    width: '100%',
  },
  lapText: {
    fontSize: 16,
    fontFamily: 'Inter Regular',
  },
  lapTimeText: {
    fontSize: 16,
    fontFamily: 'Inter Regular',
    color: '#fff',
  },
  lapContainer: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  lapDiffText: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'Inter Regular',
  },
});
