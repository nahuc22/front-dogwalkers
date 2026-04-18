import { API_BASE_URL } from '../config/apiConfig';

/**
 * Obtener todos los walkers
 * @param {string} location - Ubicación para filtrar walkers cercanos (opcional)
 * @param {number} limit - Número máximo de resultados (default: 10)
 * @returns {Promise<Array>} Lista de walkers
 */
export const getAllWalkers = async (location, limit = 10) => {
  try {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/walkers?${params}`, {
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
    console.error('Error fetching walkers:', error);
    throw error;
  }
};

/**
 * Obtener walker por ID
 * @param {number} walkerId - ID del walker
 * @returns {Promise<Object>} Datos del walker
 */
export const getWalkerById = async (walkerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/walkers/${walkerId}`, {
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
    console.error('Error fetching walker by ID:', error);
    throw error;
  }
};

/**
 * Buscar walkers por nombre o ubicación
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} Lista de walkers que coinciden
 */
export const searchWalkers = async (searchTerm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/walkers/search?q=${encodeURIComponent(searchTerm)}`, {
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
    console.error('Error searching walkers:', error);
    throw error;
  }
};

/**
 * Obtener walkers cercanos (alias de getAllWalkers con ubicación)
 * @param {string} userLocation - Ubicación del usuario
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array>} Lista de walkers cercanos
 */
export const getNearbyWalkers = async (userLocation, limit = 10) => {
  return getAllWalkers(userLocation, limit);
};
