import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from '../screens/Home';
import Inbox from '../screens/Inbox';
import ScheduleScreen from '../screens/Schedule';
import Profile from '../screens/Profile';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function TabCreator({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => <TabNavigator setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator({ setIsLoggedIn }) {
  const insets = useSafeAreaInsets();
  const HomeWrapper = (props) => <Home {...props} setIsLoggedIn={setIsLoggedIn} />;
  const InboxWrapper = (props) => <Inbox {...props} setIsLoggedIn={setIsLoggedIn} />;
  const ProfileWrapper = (props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} />;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { 
          display: 'flex',
          height: scale(60) + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : scale(8),
          paddingTop: scale(8),
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: (props) => <CustomIcon props={props} iconName="home" />,
        }}
      >
        {(props) => <HomeWrapper {...props} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Comunidad"
        options={{
          tabBarLabel: 'Comunidad',
          tabBarIcon: (props) => <CustomIcon props={props} iconName="groups" />,
        }}
      >
        {(props) => <HomeWrapper {...props} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Chat"
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: (props) => <CustomIcon props={props} iconName="chat" />,
        }}
      >
        {(props) => <InboxWrapper {...props} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: (props) => <CustomIcon props={props} iconName="person" />,
        }}
      >
        {(props) => <ProfileWrapper {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const CustomIcon = ({props , iconName, animationProps})  => {
  const { focused } = props
  return (
      <Animatable.View 
          {...animationProps}
          style={{padding: scale(5),
          height: scale(40),
          width: scale(40),
          justifyContent: 'center',
          alignItems: 'center'
          }}>
      <View
      style={[{
          borderRadius:scale(20),
      }, focused? {} : { opacity: 0.5}]}>
      <MaterialIcons
          name={iconName ? iconName: 'home'}
          size={scale(24)}
          {...props}
      />
      </View>
      </Animatable.View>
  )
}