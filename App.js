import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store/Store';
import AppNavigator from './src/navigation/AppNavigator.js';
import { ActivityIndicator} from 'react-native'
import FontLoader from './src/components/FontLoader.jsx';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/Toast.js';
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <FontLoader>
          <AppNavigator />  
            <Toast config={toastConfig}/>
        </FontLoader>
      </PersistGate>
    </Provider>
  );
}