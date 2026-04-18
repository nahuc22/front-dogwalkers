import { API_BASE_URL } from '../config/apiConfig';

/**
 * Sube una imagen de perfil de usuario a Cloudinary
 * @param {number} userId - ID del usuario
 * @param {string} role - Rol del usuario ('owner' o 'walker')
 * @param {object} imageFile - Objeto con la información de la imagen
 * @returns {Promise<object>} - Respuesta con imageUrl y publicId
 */
export const uploadUserProfileImage = async (userId, role, imageFile) => {
  try {
    const formData = new FormData();
    
    // Agregar la imagen al FormData
    formData.append('image', {
      uri: imageFile.uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.fileName || `profile_${userId}.jpg`,
    });
    
    // Agregar el rol
    formData.append('role', role);

    const response = await fetch(
      `${API_BASE_URL}/images/users/${userId}/profile-image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en uploadUserProfileImage:', error);
    throw error;
  }
};

/**
 * Sube una imagen de portada de walker a Cloudinary
 * @param {number} userId - ID del usuario walker
 * @param {object} imageFile - Objeto con la información de la imagen
 * @returns {Promise<object>} - Respuesta con imageUrl y publicId
 */
export const uploadWalkerCoverImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    
    // Agregar la imagen al FormData
    formData.append('image', {
      uri: imageFile.uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.fileName || `cover_${userId}.jpg`,
    });

    const response = await fetch(
      `${API_BASE_URL}/images/walkers/${userId}/cover-image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir la imagen de portada');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en uploadWalkerCoverImage:', error);
    throw error;
  }
};

/**
 * Sube una imagen de perfil de mascota a Cloudinary
 * @param {number} petId - ID de la mascota
 * @param {object} imageFile - Objeto con la información de la imagen
 * @returns {Promise<object>} - Respuesta con imageUrl y publicId
 */
export const uploadPetProfileImage = async (petId, imageFile) => {
  try {
    const formData = new FormData();
    
    formData.append('image', {
      uri: imageFile.uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.fileName || `pet_${petId}.jpg`,
    });

    const response = await fetch(
      `${API_BASE_URL}/images/pets/${petId}/profile-image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en uploadPetProfileImage:', error);
    throw error;
  }
};

/**
 * Elimina una imagen de perfil de usuario
 * @param {number} userId - ID del usuario
 * @param {string} role - Rol del usuario ('owner' o 'walker')
 * @param {string} publicId - Public ID de Cloudinary
 * @returns {Promise<object>} - Respuesta de confirmación
 */
export const deleteUserProfileImage = async (userId, role, publicId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/users/${userId}/profile-image`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, publicId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la imagen');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en deleteUserProfileImage:', error);
    throw error;
  }
};

/**
 * Elimina una imagen de perfil de mascota
 * @param {number} petId - ID de la mascota
 * @param {string} publicId - Public ID de Cloudinary
 * @returns {Promise<object>} - Respuesta de confirmación
 */
export const deletePetProfileImage = async (petId, publicId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/pets/${petId}/profile-image`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la imagen');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en deletePetProfileImage:', error);
    throw error;
  }
};
