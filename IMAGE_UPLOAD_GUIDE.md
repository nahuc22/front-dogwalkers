# 📸 Guía de Upload de Imágenes - Frontend

## ✅ Implementación Completada

Se ha implementado la funcionalidad completa de subir y mostrar imágenes de perfil de usuario usando Cloudinary.

## 🎯 Características

### ✨ Funcionalidades Implementadas

1. **Selección de Imagen**
   - Selector de galería con recorte cuadrado (1:1)
   - Compresión automática (calidad 80%)
   - Preview inmediato antes de subir

2. **Upload a Cloudinary**
   - Subida automática al seleccionar imagen
   - Indicador de carga mientras se sube
   - Actualización en tiempo real de la imagen

3. **Visualización**
   - Muestra imagen de Cloudinary si existe
   - Fallback a imagen por defecto si no hay foto
   - Actualización inmediata al cambiar

4. **Feedback al Usuario**
   - Toast de éxito al subir correctamente
   - Toast de error si falla el upload
   - Loading spinner durante la subida

## 📱 Cómo Usar

### Para el Usuario Final

1. **Abrir Perfil**
   - Ve a la pantalla de Perfil

2. **Activar Modo Edición**
   - Toca el botón de editar (lápiz) arriba a la derecha

3. **Cambiar Foto de Perfil**
   - Toca el ícono de cámara sobre la foto de perfil
   - Selecciona una imagen de tu galería
   - Recorta la imagen (opcional)
   - La imagen se sube automáticamente

4. **Guardar Cambios**
   - Toca el botón de check (✓) para guardar todos los cambios
   - O simplemente sal del modo edición

## 🔧 Configuración Técnica

### Dependencias Instaladas

```json
{
  "expo-image-picker": "~15.0.8"
}
```

### Archivos Creados/Modificados

1. **`src/services/imageService.js`** - Servicio de API
   - `uploadUserProfileImage()`
   - `uploadPetProfileImage()`
   - `deleteUserProfileImage()`
   - `deletePetProfileImage()`

2. **`src/screens/Profile.jsx`** - Componente actualizado
   - Función `handlePickImage()`
   - Estado `isUploadingImage`
   - Lógica de preview y upload

### Permisos Necesarios

El app solicita automáticamente:
- ✅ Acceso a la galería de fotos
- ✅ Permiso de lectura de medios

## 🌐 Configuración de API

Asegúrate de que `src/config/apiConfig.js` apunte a tu backend:

```javascript
export const API_BASE_URL = API_CONFIG.local; // Para desarrollo
// export const API_BASE_URL = API_CONFIG.production; // Para producción
```

## 🧪 Testing

### Test Manual

1. **Iniciar el servidor backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar la app**
   ```bash
   cd frontend
   npm start
   ```

3. **Probar en dispositivo/emulador**
   - Escanea el QR con Expo Go
   - O ejecuta en emulador: `npm run android` / `npm run ios`

### Casos de Prueba

- [ ] Seleccionar imagen de galería
- [ ] Cancelar selección
- [ ] Subir imagen exitosamente
- [ ] Ver preview inmediato
- [ ] Verificar que la imagen se guarda en Cloudinary
- [ ] Verificar que la URL se guarda en la base de datos
- [ ] Cerrar sesión y volver a entrar (debe mantener la imagen)

## 🐛 Troubleshooting

### Error: "No se pudo subir la imagen"

**Posibles causas:**
1. Backend no está corriendo
2. URL de API incorrecta en `apiConfig.js`
3. Credenciales de Cloudinary no configuradas en backend
4. Problema de red/conectividad

**Solución:**
```bash
# Verificar que el backend esté corriendo
cd backend
npm run dev

# Verificar logs del servidor
# Debería mostrar: "Server running on port 3001"
```

### Error: "Permisos denegados"

**Causa:** El usuario no otorgó permisos de galería

**Solución:**
- Android: Settings → Apps → DogWalkers → Permissions → Photos
- iOS: Settings → DogWalkers → Photos → Allow Access

### La imagen no se muestra

**Verificar:**
1. Que la URL de Cloudinary sea válida (https://res.cloudinary.com/...)
2. Que el perfil en Redux tenga `profileImage` actualizado
3. Revisar console.log para errores

## 📊 Flujo de Datos

```
Usuario selecciona imagen
    ↓
Preview local (URI temporal)
    ↓
Upload a backend (FormData)
    ↓
Backend sube a Cloudinary
    ↓
Backend guarda URL en MySQL
    ↓
Backend retorna URL de Cloudinary
    ↓
Frontend actualiza estado local
    ↓
Usuario ve imagen de Cloudinary
```

## 🔒 Seguridad

✅ **Implementado:**
- Validación de tipo de archivo en backend
- Límite de tamaño (5MB)
- URLs firmadas de Cloudinary (HTTPS)
- API keys nunca expuestas en frontend

⚠️ **Pendiente (Recomendado):**
- Autenticación JWT en endpoints
- Validación de que el usuario solo pueda subir su propia foto
- Rate limiting para prevenir abuso

## 🎨 Personalización

### Cambiar Calidad de Imagen

En `Profile.jsx`, línea ~71:
```javascript
const result = await ImagePicker.launchImageLibraryAsync({
  quality: 0.8, // Cambiar entre 0.0 y 1.0
});
```

### Cambiar Aspecto del Recorte

```javascript
aspect: [1, 1], // Cuadrado
// aspect: [16, 9], // Horizontal
// aspect: [4, 3], // Estándar
```

### Cambiar Tamaño Máximo

En `backend/src/middleware/uploadMiddleware.ts`:
```typescript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB
}
```

## 📚 Recursos Adicionales

- [Expo Image Picker Docs](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [React Native FormData](https://reactnative.dev/docs/network#using-formdata)

## 🚀 Próximos Pasos

### Mejoras Sugeridas

1. **Tomar Foto con Cámara**
   ```javascript
   await ImagePicker.launchCameraAsync()
   ```

2. **Múltiples Imágenes para Mascotas**
   - Galería de fotos de mascotas
   - Carrusel de imágenes

3. **Edición de Imagen**
   - Filtros
   - Rotación
   - Ajustes de brillo/contraste

4. **Caché de Imágenes**
   - Usar `react-native-fast-image`
   - Mejorar performance de carga

5. **Compresión Avanzada**
   - Usar `expo-image-manipulator`
   - Reducir tamaño antes de subir

## ✨ Ejemplo de Uso en Otros Componentes

Si quieres usar la misma funcionalidad en otros lugares:

```javascript
import { uploadUserProfileImage } from '../services/imageService';
import * as ImagePicker from 'expo-image-picker';

const handleUploadImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    const imageFile = {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      fileName: 'image.jpg',
    };

    const response = await uploadUserProfileImage(userId, role, imageFile);
    console.log('Imagen subida:', response.imageUrl);
  }
};
```

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del backend
2. Revisa la consola de React Native
3. Verifica la configuración de Cloudinary
4. Asegúrate de que todos los servicios estén corriendo
