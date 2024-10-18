import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import WorldClockScreen from '../screens/WorldClockScreen';
import AlarmScreen from '../screens/AlarmScreen';
import StopwatchScreen from '../screens/StopwatchScreen';
import TimerScreen from '../screens/TimerScreen';

const Navigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Stopwatch"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'World Clock') {
              iconName = 'earth';
            } else if (route.name === 'Alarm') {
              iconName = 'alarm';
            } else if (route.name === 'Stopwatch') {
              iconName = 'timer';
            } else if (route.name === 'Timer') {
              iconName = 'speedometer';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FBA10D',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {
            backgroundColor: 'black',
            paddingBottom: 5,
            height: 60,
            borderTopWidth: 0,
            elevation: 0,
          },
          headerShown: false,
        })}>
        <Tab.Screen name="World Clock" component={WorldClockScreen} />
        <Tab.Screen name="Alarm" component={AlarmScreen} />
        <Tab.Screen name="Stopwatch" component={StopwatchScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
