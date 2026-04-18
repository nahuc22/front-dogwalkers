# 🐾 Perfil de Mascota - Sistema de Edición

## ✅ Implementación Completada

Se ha rediseñado completamente el componente `PetRegistration` para funcionar como un **perfil editable** similar al perfil de usuario, con:
- ✅ Modo visualización y modo edición
- ✅ Botón flotante de edición/guardado (lápiz/check)
- ✅ Nombre de mascota en lugar de "Add Profile Photo"
- ✅ Ícono de cámara flotante solo visible en modo edición
- ✅ Campos de texto solo editables al activar el modo edición

## 🎯 Características

### ✨ Funcionalidades Implementadas

1. **Sistema de Edición Dual**
   - **Modo Visualización**: Muestra todos los datos de la mascota de forma limpia
   - **Modo Edición**: Permite modificar todos los campos
   - Toggle entre modos con botón flotante (lápiz/check)

2. **Botón Flotante de Edición**
   - Ubicado arriba a la derecha (igual que perfil de usuario)
   - Ícono de lápiz en modo visualización
   - Ícono de check en modo edición
   - Guarda automáticamente al hacer click en check

3. **Visualización del Nombre**
   - Muestra el nombre de la mascota debajo de la foto
   - Muestra la raza como subtítulo
   - Reemplaza el texto "Add Profile Photo"

4. **Ícono de Cámara Condicional**
   - Solo visible en modo edición
   - Diseño flotante en esquina inferior derecha
   - Loading spinner durante la subida

5. **Campos Editables Condicionales**
   - En modo visualización: Muestra valores como texto
   - En modo edición: Muestra inputs, selectors y toggles
   - Todos los campos respetan el estado `isEditing`

6. **Upload de Imagen**
   - Selector de galería con recorte cuadrado (1:1)
   - Compresión automática (calidad 80%)
   - Preview inmediato antes de subir
   - Upload automático a Cloudinary si existe `petId`

7. **Feedback Visual**
   - Toast de éxito al subir correctamente
   - Toast de error si falla el upload
   - Loading spinner durante la subida

## 📱 Cómo Funciona

### Flujo de Visualización (Modo Vista)

1. **Usuario abre perfil de mascota**
2. **Ve todos los datos** en modo solo lectura
3. **Nombre y raza** debajo de la foto
4. **Botón flotante de lápiz** arriba a la derecha
5. **Sin ícono de cámara** (solo en edición)

### Flujo de Edición

1. **Usuario toca botón de lápiz** (arriba a la derecha)
2. **Modo edición activado**:
   - Botón cambia a ícono de check ✓
   - Aparece ícono de cámara en la foto
   - Todos los campos se vuelven editables
3. **Usuario puede**:
   - Cambiar foto (toca ícono de cámara)
   - Editar nombre, raza, tamaño, etc.
   - Modificar toggles de vacunación/esterilización
   - Actualizar información médica
4. **Usuario toca check** para guardar
5. **Cambios guardados** y vuelve a modo visualización

### Flujo de Cambio de Foto

1. **En modo edición**, toca ícono de cámara
2. **Selecciona imagen** de galería
3. **Recorta** (opcional, aspecto 1:1)
4. **Preview inmediato**
5. Si existe `petId`:
   - **Upload automático** a Cloudinary
   - **Toast de éxito**
   - **URL actualizada**
6. Si no existe `petId` (nueva mascota):
   - **Preview local** hasta guardar

## 🔧 Integración con Backend

### Cuando Crees una Mascota

Después de crear la mascota en el backend, necesitas:

```javascript
// En tu función de crear mascota
const createPet = async (petData) => {
  // 1. Crear mascota en backend
  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData),
  });
  
  const newPet = await response.json();
  
  // 2. Si hay foto local, subirla a Cloudinary
  if (petData.photo && !petData.photo.startsWith('http')) {
    const imageFile = {
      uri: petData.photo,
      type: 'image/jpeg',
      fileName: `pet_${newPet.id}.jpg`,
    };
    
    const imageResponse = await uploadPetProfileImage(newPet.id, imageFile);
    
    // 3. Actualizar la mascota con la URL de Cloudinary
    await fetch(`${API_BASE_URL}/pets/${newPet.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileImage: imageResponse.imageUrl }),
    });
  }
  
  return newPet;
};
```

## 🎨 Diseño Visual

### Antes
```
┌─────────────┐
│             │
│   [Paw]     │  ← Placeholder
│             │
└─────────────┘
  Add Photo
```

### Después
```
┌─────────────┐
│             │
│   [Foto]    │  ← Imagen seleccionada
│         📷  │  ← Ícono flotante
└─────────────┘
  Add Photo
```

## 📊 Estados del Componente

### Estado Inicial
- Muestra placeholder con ícono de paw
- Ícono de cámara flotante visible
- Sin loading

### Seleccionando Imagen
- Abre selector de galería
- Permite recorte 1:1
- Cierra al seleccionar o cancelar

### Preview Local
- Muestra imagen seleccionada
- Ícono de cámara sigue visible
- Permite cambiar la imagen

### Subiendo a Cloudinary
- Muestra loading spinner en el ícono
- Deshabilita el botón temporalmente
- Imagen en preview

### Imagen Subida
- Muestra imagen de Cloudinary
- Ícono de cámara normal
- Toast de éxito

## 🐛 Manejo de Errores

### Error: No hay permisos
```javascript
Alert.alert(
  'Permisos necesarios',
  'Necesitamos acceso a tu galería para agregar la foto de tu mascota'
);
```

### Error: Falla el upload
```javascript
Toast.show({
  type: 'error',
  text1: 'Error',
  text2: 'No se pudo subir la imagen'
});
// Mantiene el preview local
```

### Error: No hay conexión
- Mantiene la imagen local
- Muestra error en toast
- Permite reintentar más tarde

## 🔄 Actualización del Componente

### Props Necesarias

Si quieres pasar el `petId` desde fuera:

```javascript
<PetRegistration 
  onSave={handleSave}
  onCancel={handleCancel}
  petId={existingPetId} // Para edición
  initialData={petData} // Para edición
/>
```

### Actualizar el Componente

```javascript
export default function PetRegistration({ 
  onSave, 
  onCancel, 
  petId: initialPetId = null,
  initialData = null 
}) {
  const [petId, setPetId] = useState(initialPetId);
  
  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setDogName(initialData.name || '');
      setBreed(initialData.breed || '');
      setProfilePhoto(initialData.profileImage || null);
      // ... otros campos
    }
  }, [initialData]);
  
  // ... resto del código
}
```

## 📝 Ejemplo Completo de Uso

### Crear Nueva Mascota

```javascript
import PetRegistration from '../components/PetRegistration';

const MyScreen = () => {
  const handleSavePet = async (petData) => {
    try {
      // 1. Crear mascota
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUserId,
          name: petData.name,
          breed: petData.breed,
          size: petData.size,
          // ... otros campos
        }),
      });
      
      const newPet = await response.json();
      
      // 2. Subir foto si existe
      if (petData.photo) {
        const imageFile = {
          uri: petData.photo,
          type: 'image/jpeg',
          fileName: `pet_${newPet.id}.jpg`,
        };
        
        await uploadPetProfileImage(newPet.id, imageFile);
      }
      
      Toast.show({
        type: 'success',
        text1: 'Mascota registrada',
        text2: `${petData.name} fue agregado exitosamente`,
      });
      
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo registrar la mascota',
      });
    }
  };
  
  return (
    <PetRegistration 
      onSave={handleSavePet}
      onCancel={() => navigation.goBack()}
    />
  );
};
```

### Editar Mascota Existente

```javascript
const EditPetScreen = ({ route }) => {
  const { petId } = route.params;
  const [petData, setPetData] = useState(null);
  
  useEffect(() => {
    // Cargar datos de la mascota
    fetchPetData(petId);
  }, [petId]);
  
  const fetchPetData = async (id) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);
    const data = await response.json();
    setPetData(data);
  };
  
  const handleUpdatePet = async (updatedData) => {
    // Actualizar mascota
    await fetch(`${API_BASE_URL}/pets/${petId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    
    Toast.show({
      type: 'success',
      text1: 'Mascota actualizada',
    });
  };
  
  if (!petData) return <ActivityIndicator />;
  
  return (
    <PetRegistration 
      petId={petId}
      initialData={petData}
      onSave={handleUpdatePet}
      onCancel={() => navigation.goBack()}
    />
  );
};
```

## 🎯 Próximos Pasos

### Mejoras Sugeridas

1. **Múltiples Fotos**
   - Galería de fotos de la mascota
   - Carrusel de imágenes
   - Foto principal + fotos adicionales

2. **Tomar Foto con Cámara**
   ```javascript
   await ImagePicker.launchCameraAsync()
   ```

3. **Eliminar Foto**
   - Botón para eliminar la foto actual
   - Volver al placeholder

4. **Validación**
   - Verificar que la imagen sea válida
   - Límite de tamaño
   - Tipos de archivo permitidos

## 🔒 Seguridad

- ✅ Permisos de galería solicitados automáticamente
- ✅ Validación de tipo de archivo en backend
- ✅ Límite de tamaño (5MB)
- ✅ URLs seguras de Cloudinary (HTTPS)

## 📚 Recursos

- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- Documentación del backend: `backend/CLOUDINARY_SETUP.md`
