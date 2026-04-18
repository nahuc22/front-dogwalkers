import { createAsyncThunk } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../utils/Toast';
import { API_BASE_URL } from '../../../config/api';

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      console.log('Intentando conectar a:', `${API_BASE_URL}/users/login`);
      console.log('Credenciales enviadas:', credentials);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos
      
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        // El backend devuelve un objeto con el código de error
        const errorMessage = data.error || data.message || 'Error en las credenciales';
        console.log('Error del backend:', errorMessage);
        throw new Error(errorMessage);
      }

      Toast.show({
        type: 'success',
        text1: '¡Inicio de sesión exitoso!',
        text2: 'Bienvenido a la aplicación ',
        visibilityTime: 2000,
        autoHide: true,
        ...toastConfig.success
      });

      return data;

    } catch (error) {
      console.error(' Error de conexión:', error.message);
      
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: error.name === 'AbortError' ? 'Tiempo de espera agotado' : 'Verifica tu conexión',
        visibilityTime: 3000,
        autoHide: true,
        ...toastConfig.error,
      });
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (formValues, { rejectWithValue }) => {
    try {
      console.log('Registrando usuario con:', formValues);
      console.log('URL:', `${API_BASE_URL}/users/register`);

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Respuesta no es JSON:', text);
        throw new Error('El servidor no respondió con JSON. Verifica que el backend esté corriendo.');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Error al registrar';
        console.log('Error del backend:', errorMessage);
        throw new Error(errorMessage);
      }

      Toast.show({
        type: 'register',
        text1: '¡Registro realizado correctamente!',
        text2: 'Ahora puedes iniciar sesión ',
        visibilityTime: 2000,
        autoHide: true,
        ...toastConfig.register
      });

      return data;
    } catch (error) {
      console.error('❌ Error en registro:', error.message);
      
      Toast.show({
        type: 'error',
        text1: 'Error al registrarse',
        text2: error.message || 'Verifica tu conexión',
        visibilityTime: 3000,
        autoHide: true,
        ...toastConfig.error,
      });
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, role, profileData }, { rejectWithValue }) => {
    try {
      console.log('Actualizando perfil:', { userId, role, profileData });
      
      // Determinar endpoint según el rol
      const endpoint = role === 'owner' 
        ? `${API_BASE_URL}/owners/profile/${userId}`
        : `${API_BASE_URL}/walkers/profile/${userId}`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Error al actualizar perfil';
        console.log('Error del backend:', errorMessage);
        throw new Error(errorMessage);
      }

      Toast.show({
        type: 'success',
        text1: '¡Perfil actualizado!',
        text2: 'Tus cambios se guardaron correctamente',
        visibilityTime: 2000,
        autoHide: true,
        ...toastConfig.success
      });

      return data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error.message);
      
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar',
        text2: 'No se pudieron guardar los cambios',
        visibilityTime: 3000,
        autoHide: true,
        ...toastConfig.error,
      });
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);