/**
 * Funciones de mapeo de datos para normalizar respuestas del backend
 * y preparar datos para componentes de UI
 */

/**
 * Mapea un walker a formato de tarjeta para NearYouCard
 * @param {Object} walker - Datos del walker desde el backend
 * @returns {Object} Datos formateados para tarjeta
 */
export const mapWalkerToCard = (walker) => ({
  id: walker.id.toString(),
  name: `${walker.name} ${walker.lastname || ''}`.trim(),
  img: walker.profileImage ? { uri: walker.profileImage } : null,
  distance: '5', // TODO: calcular distancia real con geolocalización
  price: walker.price || '5',
  rating: walker.rating || '0.0',
  walkerData: walker,
});

/**
 * Mapea un pet a formato de tarjeta para NearYouCard
 * @param {Object} pet - Datos del pet desde el backend
 * @returns {Object} Datos formateados para tarjeta
 */
export const mapPetToCard = (pet) => ({
  id: pet.id.toString(),
  name: pet.name,
  img: pet.profileImage ? { uri: pet.profileImage } : null,
  distance: '5', // TODO: calcular distancia real
  price: '0',
  rating: '0.0',
  petData: pet,
  ownerName: `${pet.ownerName} ${pet.ownerLastname || ''}`.trim(),
});

/**
 * Mapea lista de usuarios según el rol del usuario logueado
 * @param {Array} users - Lista de usuarios/pets desde el backend
 * @param {string} role - Rol del usuario logueado ('owner' o 'walker')
 * @returns {Array} Lista de datos formateados para tarjetas
 */
export const mapUsersToCards = (users, role) => {
  if (!Array.isArray(users)) return [];
  
  return users.map(item => 
    role === 'owner' ? mapWalkerToCard(item) : mapPetToCard(item)
  );
};

/**
 * Detecta si un item es un perfil de pet o walker
 * @param {Object} item - Item con walkerData o petData
 * @returns {boolean} true si es pet, false si es walker
 */
export const isPetProfile = (item) => {
  return !!item?.petData;
};

/**
 * Obtiene los datos correctos según el tipo de perfil
 * @param {Object} item - Item con walkerData o petData
 * @returns {Object} Datos del perfil (pet o walker)
 */
export const getProfileData = (item) => {
  return isPetProfile(item) ? item.petData : item.walkerData;
};
