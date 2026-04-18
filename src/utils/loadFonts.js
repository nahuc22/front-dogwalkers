import * as Font from 'expo-font';

export const loadFonts = () => {
  return Font.loadAsync({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins': require('../../assets/fonts/Poppins-Regular.ttf'),
  });
};