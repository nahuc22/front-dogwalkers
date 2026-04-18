import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/user/userSlice';
import { updateProfile } from '../redux/actions/users/userAction';
import * as ImagePicker from 'expo-image-picker';
import { uploadUserProfileImage } from '../services/imageService';
import { getPetsByOwner, deletePet } from '../services/petService';
import Toast from 'react-native-toast-message';
import Label from '../components/Label';
import EditButton from '../components/EditButton';
import { appColors } from '../utils/appColors';

export default function Profile({ setIsLoggedIn }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Obtener datos del usuario desde Redux
  const user = useSelector((state) => state.user);
  const { profile, role, userId } = user;
  
  // Estado para modo edición
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para campos editables
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [editedLastname, setEditedLastname] = useState(profile?.lastname || '');
  const [editedLocation, setEditedLocation] = useState(profile?.location || '');
  const [editedDescription, setEditedDescription] = useState(profile?.description || '');
  const [editedProfileImage, setEditedProfileImage] = useState(profile?.profileImage || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Estados para autocompletado de ubicación
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estado para mascotas
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  
  // Estado para detectar cambios
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar mascotas al montar el componente
  useEffect(() => {
    loadPets();
  }, [userId]);
  
  // Recargar mascotas cuando se vuelve a la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPets();
      // Asegurar que el perfil siempre inicie en modo visualización
      setIsEditing(false);
      setHasChanges(false);
    });
    return unsubscribe;
  }, [navigation, userId]);

  // Detectar cambios en los campos del perfil
  useEffect(() => {
    if (!isEditing) {
      setHasChanges(false);
      return;
    }

    // Para walkers, no incluir descripción en la detección de cambios
    const descriptionChanged = role === 'owner' 
      ? editedDescription !== (profile?.description || '')
      : false;

    const hasProfileChanges = 
      editedName !== (profile?.name || '') ||
      editedLastname !== (profile?.lastname || '') ||
      editedLocation !== (profile?.location || '') ||
      descriptionChanged ||
      editedProfileImage !== (profile?.profileImage || '');

    setHasChanges(hasProfileChanges);
  }, [isEditing, editedName, editedLastname, editedLocation, editedDescription, editedProfileImage, profile, role]);

  // Debounce para búsqueda de ubicación
  useEffect(() => {
    if (!isEditing) return;
    
    const timer = setTimeout(() => {
      if (editedLocation.length >= 3) {
        searchLocation(editedLocation);
      }
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(timer);
  }, [editedLocation, isEditing]);
  
  // Función para cargar mascotas
  const loadPets = async () => {
    if (role !== 'owner') return; // Solo owners tienen mascotas
    
    try {
      setLoadingPets(true);
      const petsData = await getPetsByOwner(userId);
      setPets(petsData || []);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
    } finally {
      setLoadingPets(false);
    }
  };

  // Función para eliminar mascota
  const handleDeletePet = (petId, petName) => {
    Alert.alert(
      'Eliminar mascota',
      `¿Estás seguro de que quieres eliminar a ${petName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(userId, petId);
              
              Toast.show({
                type: 'success',
                text1: 'Mascota eliminada',
                text2: `${petName} fue eliminado exitosamente`,
              });
              
              // Recargar lista de mascotas
              loadPets();
            } catch (error) {
              console.error('Error al eliminar mascota:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'No se pudo eliminar la mascota',
              });
            }
          },
        },
      ]
    );
  };

  // Función para seleccionar y subir imagen de perfil
  const handlePickImage = async () => {
    try {
      // Solicitar permisos primero
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu galería para cambiar la foto de perfil',
          [{ text: 'OK' }]
        );
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Mostrar preview inmediato
        setEditedProfileImage(selectedImage.uri);
        
        // Subir imagen a Cloudinary
        setIsUploadingImage(true);
        
        try {
          const imageFile = {
            uri: selectedImage.uri,
            type: 'image/jpeg',
            name: `profile_${userId}_${Date.now()}.jpg`,
          };

          const response = await uploadUserProfileImage(userId, role, imageFile);
          
          // Actualizar con la URL de Cloudinary
          setEditedProfileImage(response.imageUrl);
          
          Toast.show({
            type: 'success',
            text1: 'Imagen subida',
            text2: 'Tu foto de perfil se actualizó correctamente',
          });
        } catch (error) {
          console.error('Error al subir imagen:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || 'No se pudo subir la imagen',
          });
          // Revertir al valor anterior
          setEditedProfileImage(profile?.profileImage || '');
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo seleccionar la imagen',
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsLoggedIn(false);
    // El cambio de isLoggedIn a false hará que AppNavigator redirija automáticamente
    // No necesitamos navegar manualmente porque el estado global maneja la navegación
  };

  // Función para buscar ubicaciones con Nominatim
  const searchLocation = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Nominatim API - OpenStreetMap (gratis, sin API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ar&limit=5`,
        {
          headers: {
            'User-Agent': 'DogWalkersApp/1.0' // Nominatim requiere User-Agent
          }
        }
      );
      const data = await response.json();
      
      setLocationSuggestions(data.map(item => ({
        name: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando ubicación:', error);
    }
  };

  const handleLocationChange = (text) => {
    setEditedLocation(text);
    if (text.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location) => {
    setEditedLocation(location.name);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSaveProfile = async () => {
    // Preparar datos para enviar (solo campos editados)
    const profileData = {
      name: editedName,
      lastname: editedLastname,
      location: editedLocation,
    };

    // Solo incluir descripción para owners (walkers la editan en Schedule)
    if (role === 'owner') {
      profileData.description = editedDescription;
    }

    // Agregar profileImage si se cambió
    if (editedProfileImage !== profile?.profileImage) {
      profileData.profileImage = editedProfileImage || '';
    }

    try {
      await dispatch(updateProfile({
        userId,
        role,
        profileData
      })).unwrap();
      
      setIsEditing(false);
      setShowSuggestions(false);
      setLocationSuggestions([]);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      // El error ya se muestra en el Toast desde la action
    }
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    // Restaurar valores originales
    setEditedName(profile?.name || '');
    setEditedLastname(profile?.lastname || '');
    setEditedLocation(profile?.location || '');
    setEditedDescription(profile?.description || '');
    setEditedProfileImage(profile?.profileImage || '');
    
    // Resetear estados
    setIsEditing(false);
    setHasChanges(false);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  // Datos del perfil con fallbacks
  const userProfile = {
    name: profile?.name || 'Usuario',
    lastname: profile?.lastname || '',
    location: profile?.location || 'Sin ubicación',
    rating: role === 'walker' ? (parseFloat(profile?.rating) || 0) : null,
    experience: profile?.experience || 'Nuevo',
    description: profile?.description || 'Sin descripción',
    profileImage: isEditing 
      ? (editedProfileImage ? { uri: editedProfileImage } : null)
      : (profile?.profileImage ? { uri: profile.profileImage } : null),
    pets: [], // TODO: Cargar mascotas desde el backend
    paymentMethod: 'Efectivo', // TODO: Implementar métodos de pago
    history: [] // TODO: Cargar historial desde el backend
  };

  return (
    <View style={styles.container}>
      {/* Botón de edición arriba a la derecha */}
      <EditButton
        isEditing={isEditing}
        hasChanges={hasChanges}
        onPress={() => {
          if (isEditing) {
            if (hasChanges) {
              handleSaveProfile();
            } else {
              handleCancelEdit();
            }
          } else {
            setIsEditing(true);
          }
        }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          {userProfile.profileImage ? (
            <Image 
              source={userProfile.profileImage}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <MaterialIcons name="person" size={scale(60)} color="#AAA" />
            </View>
          )}
          {isEditing && (
            <>
              <TouchableOpacity 
                style={styles.editIconContainer}
                onPress={handlePickImage}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <ActivityIndicator size="small" color="#FF7A59" />
                ) : (
                  <MaterialIcons name="camera-alt" size={scale(16)} color="#666" />
                )}
              </TouchableOpacity>
              {editedProfileImage && (
                <TouchableOpacity 
                  style={styles.deleteIconContainer}
                  onPress={() => {
                    Alert.alert(
                      'Eliminar foto',
                      '¿Estás seguro de que quieres eliminar la foto de perfil?',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        { 
                          text: 'Eliminar', 
                          style: 'destructive',
                          onPress: () => setEditedProfileImage('')
                        }
                      ]
                    );
                  }}
                >
                  <MaterialIcons name="close" size={scale(16)} color="#FF5252" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.nameContainer}>
            {isEditing ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Nombre"
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={styles.nameInput}
                  value={editedLastname}
                  onChangeText={setEditedLastname}
                  placeholder="Apellido"
                  placeholderTextColor="#999"
                />
              </View>
            ) : (
              <Label text={`${userProfile.name} ${userProfile.lastname}`.trim()} style={styles.userName} bold />
            )}
          </View>
          
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={scale(16)} color="#999" />
            {isEditing ? (
              <View style={styles.locationEditWrapper}>
                <TextInput
                  style={styles.locationInput}
                  value={editedLocation}
                  onChangeText={handleLocationChange}
                  placeholder="Buscar ubicación..."
                  placeholderTextColor="#999"
                  onFocus={() => editedLocation.length >= 3 && setShowSuggestions(true)}
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ScrollView 
                    style={styles.suggestionsContainer}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {locationSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectLocation(suggestion)}
                      >
                        <MaterialIcons name="location-on" size={scale(14)} color="#FF7A59" />
                        <Label text={suggestion.name} style={styles.suggestionText} numberOfLines={2} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            ) : (
              <Label text={userProfile.location} style={styles.locationText} />
            )}
          </View>

          {role === 'walker' && (
            <View style={styles.statsContainer}>
              <View style={styles.ratingContainer}>
                <Label text={userProfile.rating.toFixed(1)} style={styles.ratingText} bold />
                <MaterialIcons name="star" size={scale(16)} color="#FFB84D" />
              </View>
              <View style={styles.divider} />
              <Label text={userProfile.experience} style={styles.experienceText} />
            </View>
          )}

          {/* Descripción personal - Solo para owners */}
          {role === 'owner' && (
            <>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Descripción personal"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <Label text={userProfile.description} style={styles.descriptionText} />
              )}
            </>
          )}
          
          {/* Nota para walkers */}
          {role === 'walker' && !isEditing && (<Label/>)}
        </View>

        {/* Mascotas Section - Solo para ownmers */}
        {role === 'owner' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="pets" size={scale(20)} color="#FF7A59" />
              <Label text="Mascotas" style={styles.sectionTitle} bold />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('PetRegistration')}
              >
                <MaterialIcons name="add" size={scale(20)} color="#FF7A59" />
              </TouchableOpacity>
            </View>
          
          {loadingPets ? (
            <View style={styles.sectionContent}>
              <ActivityIndicator size="small" color="#FF7A59" />
            </View>
          ) : pets.length > 0 ? (
            pets.map((pet) => (
              <View key={pet.id} style={styles.sectionContent}>
                <View style={styles.petInfo}>
                  {pet.profileImage ? (
                    <Image 
                      source={{ uri: pet.profileImage }} 
                      style={styles.petImage}
                    />
                  ) : (
                    <View style={[styles.petImage, styles.petImagePlaceholder]}>
                      <Ionicons name="paw" size={scale(20)} color="#999" />
                    </View>
                  )}
                  <View style={styles.petDetails}>
                    <Label text={pet.name} style={styles.petName} bold />
                    <Label 
                      text={`${pet.breed || pet.type || 'Sin raza'} • ${pet.size || 'Tamaño no especificado'}`} 
                      style={styles.petType} 
                    />
                  </View>
                </View>
                {isEditing && (
                  <View style={styles.petActions}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PetRegistration', { 
                        petId: pet.id, 
                        initialData: pet 
                      })}
                      style={styles.petActionButton}
                    >
                      <MaterialIcons name="edit" size={scale(18)} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePet(pet.id, pet.name)}
                      style={styles.petActionButton}
                    >
                      <MaterialIcons name="delete" size={scale(18)} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.sectionContent}>
              <Label text="No tienes mascotas registradas" style={[styles.sectionText, { color: '#999' }]} />
            </View>
          )}
          </View>
        )}

        {/* Pagos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="payment" size={scale(20)} color="#FF7A59" />
            <Label text="Pagos" style={styles.sectionTitle} bold />
          </View>
          <View style={[styles.sectionContent, styles.paymentContent]}>
            <Label text={userProfile.paymentMethod} style={styles.sectionText} />
            <TouchableOpacity>
              <MaterialIcons name="edit" size={scale(18)} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial Section */}
        <View style={styles.historialSection}>
          <Label text="Historial" style={styles.historialTitle} bold />
          
          {userProfile.history.length > 0 ? (
            userProfile.history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <Image 
                  source={item.image}
                  style={styles.historyImage}
                />
                <View style={styles.historyInfo}>
                  <Label text={item.name} style={styles.historyName} bold />
                  <Label 
                    text={`${item.time} | ${item.status}`} 
                    style={styles.historyDetails} 
                  />
                  <Label text={item.date} style={styles.historyDate} />
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Label text="Contactar" style={styles.contactButtonText} bold />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Label text="No hay historial disponible" style={styles.emptyHistoryText} />
            </View>
          )}
        </View>

        {/* Walker Profile Button (solo para walkers) */}
        {role === 'walker' && (
          <View style={styles.walkerProfileContainer}>
            <TouchableOpacity 
              style={styles.walkerProfileButton} 
              onPress={() => {
                // Navegar a la vista pública del perfil del walker
                const walkerData = {
                  id: profile?.id || userId,
                  name: profile?.name || 'Paseador',
                  lastname: profile?.lastname || '',
                  img: profile?.profileImage ? { uri: profile.profileImage } : require('../../assets/near-you/img-1.png'),
                  rating: profile?.rating || '0.0',
                  distance: '0', // El walker está viendo su propio perfil
                  price: '5', // TODO: Obtener precio real
                  walkerData: profile
                };
                navigation.navigate('WalkerProfile', { item: walkerData });
              }}
            >
              <MaterialIcons name="person-outline" size={scale(20)} color="#4CAF50" />
              <Label text="Ver mi perfil de paseador" style={styles.walkerProfileText} bold />
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={scale(20)} color="#FF7A59" />
            <Label text="Cerrar sesión" style={styles.logoutText} bold />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(30),
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: scale(50),
    paddingBottom: scale(10),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: scale(50),
    marginBottom: scale(20),
    position: 'relative',
  },
  profileImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#E0E0E0',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#FFF',
    borderRadius: scale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 0,
    right: '35%',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  userName: {
    fontSize: scale(22),
    color: '#000',
  },
  editNameIcon: {
    marginLeft: scale(8),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
    width: '100%',
    position: 'relative',
  },
  locationText: {
    fontSize: scale(14),
    color: '#999',
    marginLeft: scale(4),
    textAlign: 'center',
    flexShrink: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: scale(14),
    color: '#000',
    marginRight: scale(4),
  },
  divider: {
    width: 1,
    height: scale(14),
    backgroundColor: '#CCC',
    marginHorizontal: scale(12),
  },
  experienceText: {
    fontSize: scale(14),
    color: '#000',
  },
  descriptionText: {
    fontSize: scale(13),
    color: '#999',
    textAlign: 'center',
    lineHeight: scale(20),
    paddingHorizontal: scale(10),
    marginTop: scale(3),
  },
  editDescriptionIcon: {
    marginTop: scale(8),
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(20),
    marginBottom: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: scale(14),
    color: '#000',
    marginLeft: scale(8),
    flex: 1,
  },
  addButton: {
    padding: scale(4),
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentContent: {
    borderTopWidth: 1,
    borderTopColor: '#4A9FFF',
    paddingTop: scale(12),
  },
  sectionText: {
    fontSize: scale(14),
    color: '#000',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  petImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(12),
    backgroundColor: '#E0E0E0',
  },
  petImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: scale(14),
    color: '#000',
    marginBottom: scale(2),
  },
  petType: {
    fontSize: scale(12),
    color: '#666',
  },
  petActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  petActionButton: {
    padding: scale(4),
  },
  historialSection: {
    paddingHorizontal: scale(20),
    marginTop: scale(10),
  },
  historialTitle: {
    fontSize: scale(16),
    color: '#000',
    marginBottom: scale(16),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(12),
  },
  historyImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#E0E0E0',
  },
  historyInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  historyName: {
    fontSize: scale(14),
    color: '#000',
    marginBottom: scale(2),
  },
  historyDetails: {
    fontSize: scale(12),
    color: '#666',
    marginBottom: scale(2),
  },
  historyDate: {
    fontSize: scale(11),
    color: '#999',
  },
  contactButton: {
    backgroundColor: '#FF7A59',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(20),
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: scale(12),
  },
  walkerProfileContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(10),
    alignItems: 'center',
  },
  walkerProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: scale(30),
    paddingVertical: scale(12),
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  walkerProfileText: {
    color: '#4CAF50',
    fontSize: scale(14),
  },
  logoutContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: scale(30),
    paddingVertical: scale(12),
    borderRadius: scale(25),
    borderWidth: 1,
    borderColor: '#FF7A59',
    gap: scale(8),
  },
  logoutText: {
    color: '#FF7A59',
    fontSize: scale(14),
  },
  emptyHistoryContainer: {
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: scale(14),
    color: '#999',
  },
  nameInput: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#FF7A59',
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
    minWidth: scale(120),
    flex: 1,
    textAlign: 'center',
  },
  descriptionInput: {
    fontSize: scale(13),
    color: '#000',
    borderWidth: 1,
    borderColor: '#FF7A59',
    borderRadius: scale(8),
    padding: scale(12),
    marginTop: scale(11),
    minHeight: scale(80),
    textAlign: 'left',
  },
  nameEditContainer: {
    flexDirection: 'row',
    gap: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: scale(300),
  },
  locationEditWrapper: {
    flex: 1,
    marginLeft: scale(4),
    position: 'relative',
  },
  locationInput: {
    fontSize: scale(14),
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#FF7A59',
    paddingVertical: scale(4),
    paddingHorizontal: scale(8),
  },
  suggestionsContainer: {
    position: 'absolute',
    top: scale(32),
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: scale(200),
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: scale(8),
  },
  suggestionText: {
    fontSize: scale(12),
    color: '#333',
    flex: 1,
  },
});
