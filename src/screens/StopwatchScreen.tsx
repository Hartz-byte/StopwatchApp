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

import {formatTime} from '../utils/formatTime';

const {width, height} = Dimensions.get('window');

// interface
interface TimerState {
  time: number;
  isRunning: boolean;
  laps: {time: number; diff: number | null}[];
}

const Stopwatch = () => {
  const dispatch = useDispatch();
  const {time, isRunning, laps} = useSelector(
    (state: {timer: TimerState}) => state.timer,
  );

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [lastLapTime, setLastLapTime] = useState<number | null>(null);

  // useEffect to update the timer
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        dispatch({type: 'UPDATE_TIME', payload: time + 10});
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

  // dispatch functions
  const handleStart = () => dispatch({type: 'START_TIMER'});
  const handleStop = () => dispatch({type: 'STOP_TIMER'});
  const handleReset = () => dispatch({type: 'RESET_TIMER'});
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
    fontFamily: 'Inter-Regular',
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
  },
  stopText: {
    color: 'red',
    fontSize: width < 380 ? 16 : 20,
  },
  startText: {
    color: '#217E36',
    fontSize: width < 380 ? 16 : 20,
  },
  lapList: {
    marginTop: 40,
    maxHeight: height * 0.31,
    width: '100%',
  },
  lapText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  lapContainer: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  lapTimeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  lapDiffText: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'Inter-Medium',
  },
});

export default Stopwatch;
