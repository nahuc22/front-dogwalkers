import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import OnBoardingScreen from '../screens/OnBoarding';
import RegisterScreen from "../screens/Register"
import RegisterOwnerScreen from "../screens/RegisterOwner"
import ChoiceScreen from '../screens/Choice';
import TabCreator from './TabCreator';

const Stack = createStackNavigator();

const RouterList = ({setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding">
        {(props) => <OnBoardingScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Choice">
        {(props) => <ChoiceScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} setIsLoggedIn={setIsLoggedIn}/>}
      </Stack.Screen>
      <Stack.Screen name="RegisterOwner">
        {(props) => <RegisterOwnerScreen {...props} setIsLoggedIn={setIsLoggedIn}/>}
      </Stack.Screen>
      <Stack.Screen name="TabCreator" component={TabCreator} />
    </Stack.Navigator>
  );
};

export default RouterList;
