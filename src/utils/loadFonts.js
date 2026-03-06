import * as Font from 'expo-font';

export const loadFonts = () => {
  return Font.loadAsync({
    'Poppins-Bold': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2',
      display: Font.FontDisplay.SWAP,
    },
    'Poppins': {
      uri: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
      display: Font.FontDisplay.SWAP,
    },
  });
};