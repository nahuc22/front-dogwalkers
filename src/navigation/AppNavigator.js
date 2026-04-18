// AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ErrorBoundry from '../ErrorBoundry/index.js';
import TabCreator from './TabCreator.js'
import RouterList from './RouterList.js';
import { LogBox } from 'react-native';

// LogBox.ignoreAllLogs();
export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);
  const isAuthenticated = user?.isAuthenticated || false;

  console.log('AppNavigator - isAuthenticated:', isAuthenticated, 'isLoggedIn:', isLoggedIn);

  // Sincronizar el estado local con Redux
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer>
      <ErrorBoundry>
        {isLoggedIn ? (
          <TabCreator setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <RouterList 
            setIsLoggedIn={setIsLoggedIn} 
            initialRoute="OnBoarding"
          />
        )}
      </ErrorBoundry>
    </NavigationContainer>
  );
}
