import { API_BASE_URL } from '../config/apiConfig';

/**
 * Obtener todos los perros disponibles (para walkers)
 * @param {string} location - Ubicación para filtrar perros cercanos (opcional)
 * @param {number} limit - Número máximo de resultados (default: 20)
 * @returns {Promise<Array>} Lista de perros con información del owner
 */
export const getAllPets = async (location, limit = 20) => {
  try {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/pets?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

/**
 * Crear una nueva mascota
 * @param {number} userId - ID del usuario owner
 * @param {object} petData - Datos de la mascota
 * @returns {Promise<object>} - Mascota creada con su ID
 */
export const createPet = async (userId, petData) => {
  try {
    console.log('Llamando a API:', `${API_BASE_URL}/owners/${userId}/pets`);
    console.log('Con datos:', JSON.stringify(petData, null, 2));
    
    const response = await fetch(
      `${API_BASE_URL}/owners/${userId}/pets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      }
    );

    const responseText = await response.text();
    console.log('Respuesta del servidor:', responseText);

    if (!response.ok) {
      let errorMessage = 'Error al crear la mascota';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error('Error del backend:', errorData);
      } catch (e) {
        console.error('Respuesta no es JSON:', responseText);
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('Error en createPet:', error);
    throw error;
  }
};

/**
 * Obtener todas las mascotas de un owner
 * @param {number} userId - ID del usuario owner
 * @returns {Promise<array>} - Lista de mascotas
 */
export const getPetsByOwner = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/owners/${userId}/pets`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener las mascotas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getPetsByOwner:', error);
    throw error;
  }
};

/**
 * Actualizar una mascota
 * @param {number} userId - ID del usuario owner
 * @param {number} petId - ID de la mascota
 * @param {object} petData - Datos a actualizar
 * @returns {Promise<object>} - Mascota actualizada
 */
export const updatePet = async (userId, petId, petData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/owners/${userId}/pets/${petId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar la mascota');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en updatePet:', error);
    throw error;
  }
};

/**
 * Eliminar una mascota
 * @param {number} userId - ID del usuario owner
 * @param {number} petId - ID de la mascota
 * @returns {Promise<object>} - Confirmación de eliminación
 */
export const deletePet = async (userId, petId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/owners/${userId}/pets/${petId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la mascota');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en deletePet:', error);
    throw error;
  }
};
