// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage para Expo
import { combineReducers } from 'redux';
import userReducer from '../slices/user/userSlice'; // Importa tu slice
import themeReducer from '../slices/themeSlice'
import usersListReducer from '../slices/usersListSlice';

// Configuración de redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'theme'], // Solo persiste el estado de 'user' (NO usersList para que se recargue siempre)
};

const rootReducer = combineReducers({
  user: userReducer,
  usersList: usersListReducer,
  // theme: themeReducer 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export const clearPersistedState = async () => {
  await persistor.purge(); // Limpia el estado persistido
};