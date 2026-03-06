import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen'; 
import { loadFonts } from '../utils/loadFonts'; 

export default function FontLoader({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return children;
}
