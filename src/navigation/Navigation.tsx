import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';

import WorldClockScreen from '../screens/WorldClockScreen';
import AlarmScreen from '../screens/AlarmScreen';
import StopwatchScreen from '../screens/StopwatchScreen';
import TimerScreen from '../screens/TimerScreen';

// icon selection function
const getTabBarIcon = (routeName: string, focused: boolean, color: string) => {
  let iconName;
  let IconComponent = Icon;

  switch (routeName) {
    case 'World Clock':
      iconName = 'earth';
      IconComponent = Icon2;
      break;
    case 'Alarm':
      iconName = 'alarm';
      break;
    case 'Stopwatch':
      iconName = 'timer';
      break;
    case 'Timer':
      iconName = 'speedometer';
      break;
    default:
      iconName = 'timer';
  }

  return <IconComponent name={iconName} size={28} color={color} />;
};

const Navigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Stopwatch"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color}) =>
            getTabBarIcon(route.name, focused, color),
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
