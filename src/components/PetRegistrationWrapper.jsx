import React from 'react';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import PetRegistration from './PetRegistration';
import { createPet, updatePet } from '../services/petService';
import { uploadPetProfileImage } from '../services/imageService';

/**
 * Wrapper para PetRegistration que maneja:
 * - Conversión de datos backend <-> frontend
 * - Lógica de guardado (crear/actualizar)
 * - Manejo de imágenes
 */
export default function PetRegistrationWrapper(props) {
  const userId = useSelector((state) => state.user.userId);
  
  // Obtener datos de la mascota desde los parámetros de navegación
  const { petId, initialData } = props.route?.params || {};
  
  // Convertir datos del formato frontend al formato backend
  const frontendData = initialData ? mapBackendToFrontend(initialData) : null;

  const handleSavePet = async (petData) => {
    try {
      console.log('Guardando mascota:', petData);
      console.log('petId existente:', petId);
      
      // Mapear campos del frontend al backend
      const backendPetData = {
        name: petData.name,
        breed: petData.breed,
        type: 'perro', // Por defecto, puedes agregar selector en el futuro
        specifications: buildSpecifications(petData),
      };

      // Agregar campos opcionales solo si tienen valor
      if (petData.age) {
        backendPetData.age = petData.age;
      }
      
      if (petData.size) {
        backendPetData.size = mapSizeToBackend(petData.size);
      }
      
      if (petData.isNeutered !== undefined) {
        backendPetData.isCastrated = petData.isNeutered;
      }
      
      backendPetData.getsAlongWithOthers = true; // Por defecto
      
      if (petData.medicalInfo && petData.medicalInfo.trim() !== '') {
        backendPetData.medicalCondition = petData.medicalInfo;
      }

      console.log('Datos a enviar al backend:', JSON.stringify(backendPetData, null, 2));

      let savedPet;
      
      if (petId) {
        // Actualizar mascota existente
        console.log('Actualizando mascota existente con ID:', petId);
        savedPet = await updatePet(userId, petId, backendPetData);
        console.log('Mascota actualizada:', savedPet);
      } else {
        // Crear nueva mascota
        console.log('Creando nueva mascota');
        savedPet = await createPet(userId, backendPetData);
        console.log('Mascota creada:', savedPet);
      }

      // Manejar foto de mascota
      await handlePetPhoto(petData, petId, savedPet, userId);

      Toast.show({
        type: 'success',
        text1: petId ? 'Mascota actualizada' : 'Mascota registrada',
        text2: petId ? `${petData.name} fue actualizado exitosamente` : `${petData.name} fue agregado exitosamente`,
      });

      props.navigation.goBack();
    } catch (error) {
      console.error('Error al guardar mascota:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo registrar la mascota',
      });
    }
  };

  return (
    <PetRegistration 
      onSave={handleSavePet}
      onCancel={() => props.navigation.goBack()}
      initialData={frontendData}
      petId={petId}
    />
  );
}

// ============= Funciones de conversión =============

/**
 * Mapear datos del backend al formato del frontend
 */
function mapBackendToFrontend(backendData) {
  if (!backendData) return null;
  
  // Parsear specifications para extraer los campos
  const specs = backendData.specifications || '';
  const breedMatch = specs.match(/Breed: ([^,]+)/);
  const genderMatch = specs.match(/Gender: ([^,]+)/);
  const colorMatch = specs.match(/Color: ([^,]+)/);
  const weightMatch = specs.match(/Weight: ([^k]+)/);
  const vaccinatedMatch = specs.match(/Vaccinated: ([^,]+)/);
  const specialNeedsMatch = specs.match(/Special Needs: (.+)/);
  
  return {
    name: backendData.name,
    breed: breedMatch ? breedMatch[1].trim() : '',
    size: mapSizeToFrontend(backendData.size),
    age: backendData.age,
    weight: weightMatch ? parseFloat(weightMatch[1].trim()) : null,
    gender: genderMatch ? genderMatch[1].trim().toLowerCase() : 'male',
    color: colorMatch ? colorMatch[1].trim() : '',
    isVaccinated: vaccinatedMatch ? vaccinatedMatch[1].trim() === 'Yes' : false,
    isNeutered: backendData.isCastrated || false,
    medicalInfo: backendData.medicalCondition || '',
    specialNeeds: specialNeedsMatch ? specialNeedsMatch[1].trim() : '',
    profileImage: backendData.profileImage || null,
  };
}

/**
 * Construir string de specifications para el backend
 */
function buildSpecifications(petData) {
  return `Breed: ${petData.breed || 'Unknown'}, Gender: ${petData.gender || 'Unknown'}, Color: ${petData.color || 'Unknown'}, Weight: ${petData.weight || 'Unknown'}kg, Vaccinated: ${petData.isVaccinated ? 'Yes' : 'No'}, Special Needs: ${petData.specialNeeds || 'None'}`;
}

/**
 * Mapear tamaño del backend al frontend
 */
function mapSizeToFrontend(size) {
  const sizeMap = {
    'pequeño': 'small',
    'mediano': 'medium',
    'grande': 'large',
  };
  return sizeMap[size] || 'medium';
}

/**
 * Mapear tamaño del frontend al backend
 */
function mapSizeToBackend(size) {
  const sizeMap = {
    'small': 'pequeño',
    'medium': 'mediano',
    'large': 'grande',
  };
  return sizeMap[size] || 'mediano';
}

/**
 * Manejar subida/eliminación de foto de mascota
 */
async function handlePetPhoto(petData, petId, savedPet, userId) {
  if (petData.photo === null && petId) {
    // Si se eliminó la foto, actualizar en backend
    try {
      await updatePet(userId, petId, { profileImage: '' });
      console.log('Foto de mascota eliminada');
    } catch (error) {
      console.error('Error al eliminar foto:', error);
    }
  } else if (petData.photo && !petData.photo.startsWith('http')) {
    // Si hay foto nueva, subirla
    try {
      const petIdToUse = petId || savedPet.id;
      const imageFile = {
        uri: petData.photo,
        type: 'image/jpeg',
        fileName: `pet_${petIdToUse}_${Date.now()}.jpg`,
      };

      await uploadPetProfileImage(petIdToUse, imageFile);
      console.log('Imagen de mascota subida');
    } catch (imageError) {
      console.error('Error al subir imagen:', imageError);
      // No fallar si la imagen no se sube
    }
  }
}
