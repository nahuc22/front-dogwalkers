import { Platform } from 'react-native';
import { API_BASE_URL } from './apiConfig';

// Exportamos la URL configurada
export { API_BASE_URL };

// Función para obtener la URL base según el entorno (backup)
const getBaseURL = () => {
  // Para desarrollo web (Expo Web)
  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }
  
  // Para Expo Go en dispositivo físico
  return 'http://192.168.100.39:3001/api'; // WiFi local
};

// Para emulador Android:
// export const API_BASE_URL = 'http://10.0.2.2:3001/api';

// Para simulador iOS:
// export const API_BASE_URL = 'http://localhost:3001/api';
