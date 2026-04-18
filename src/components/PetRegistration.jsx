import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { uploadPetProfileImage } from '../services/imageService';
import Label from './Label';
import { appColors, shadow } from '../utils/appColors';
import ToggleButton from './ToggleButton';

export default function PetRegistration({ onSave, onCancel, initialData = null, petId: initialPetId = null }) {
  // Determinar si es modo creación o edición
  const isCreationMode = !initialData;
  
  // Estado de edición (solo para modo edición de mascota existente)
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para campos editables
  const [dogName, setDogName] = useState(initialData?.name || '');
  const [breed, setBreed] = useState(initialData?.breed || '');
  const [size, setSize] = useState(initialData?.size || 'medium');
  const [age, setAge] = useState(initialData?.age?.toString() || '');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [gender, setGender] = useState(initialData?.gender || 'male');
  const [coatColor, setCoatColor] = useState(initialData?.color || '');
  const [isVaccinated, setIsVaccinated] = useState(initialData?.isVaccinated || false);
  const [isNeutered, setIsNeutered] = useState(initialData?.isNeutered || false);
  const [medicalInfo, setMedicalInfo] = useState(initialData?.medicalInfo || '');
  const [specialNeeds, setSpecialNeeds] = useState(initialData?.specialNeeds || '');
  const [profilePhoto, setProfilePhoto] = useState(initialData?.profileImage || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [petId, setPetId] = useState(initialPetId);
  
  // Estado para detectar cambios
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    const petData = {
      name: dogName,
      breed,
      size,
      age: age ? parseInt(age) : null,
      weight: weight ? parseFloat(weight) : null,
      gender,
      color: coatColor,
      isVaccinated,
      isNeutered,
      medicalInfo,
      specialNeeds,
      photo: profilePhoto,
    };
    onSave(petData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (initialData) {
      // Si hay datos iniciales, revertir cambios
      setDogName(initialData?.name || '');
      setBreed(initialData?.breed || '');
      setSize(initialData?.size || 'medium');
      setAge(initialData?.age?.toString() || '');
      setWeight(initialData?.weight?.toString() || '');
      setGender(initialData?.gender || 'male');
      setCoatColor(initialData?.color || '');
      setIsVaccinated(initialData?.isVaccinated || false);
      setIsNeutered(initialData?.isNeutered || false);
      setMedicalInfo(initialData?.medicalInfo || '');
      setSpecialNeeds(initialData?.specialNeeds || '');
      setProfilePhoto(initialData?.profileImage || null);
      setIsEditing(false);
      setHasChanges(false);
    } else {
      // Si no hay datos, es cancelar creación
      onCancel();
    }
  };

  // Detectar cambios en los campos de la mascota
  useEffect(() => {
    if (!isEditing || isCreationMode) {
      setHasChanges(false);
      return;
    }

    const hasPetChanges = 
      dogName !== (initialData?.name || '') ||
      breed !== (initialData?.breed || '') ||
      size !== (initialData?.size || 'medium') ||
      age !== (initialData?.age?.toString() || '') ||
      weight !== (initialData?.weight?.toString() || '') ||
      gender !== (initialData?.gender || 'male') ||
      coatColor !== (initialData?.color || '') ||
      isVaccinated !== (initialData?.isVaccinated || false) ||
      isNeutered !== (initialData?.isNeutered || false) ||
      medicalInfo !== (initialData?.medicalInfo || '') ||
      specialNeeds !== (initialData?.specialNeeds || '') ||
      profilePhoto !== (initialData?.profileImage || null);

    setHasChanges(hasPetChanges);
  }, [isEditing, isCreationMode, dogName, breed, size, age, weight, gender, coatColor, isVaccinated, isNeutered, medicalInfo, specialNeeds, profilePhoto, initialData]);

  const handlePhotoUpload = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu galería para agregar la foto de tu mascota',
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
        setProfilePhoto(selectedImage.uri);
        
        // Si ya tenemos petId, subir a Cloudinary
        if (petId) {
          setIsUploadingImage(true);
          
          try {
            const imageFile = {
              uri: selectedImage.uri,
              type: 'image/jpeg',
              fileName: `pet_${petId}_${Date.now()}.jpg`,
            };

            const response = await uploadPetProfileImage(petId, imageFile);
            
            // Actualizar con la URL de Cloudinary
            setProfilePhoto(response.imageUrl);
            
            Toast.show({
              type: 'success',
              text1: 'Imagen subida',
              text2: 'La foto de tu mascota se actualizó correctamente',
            });
          } catch (error) {
            console.error('Error al subir imagen:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: error.message || 'No se pudo subir la imagen',
            });
            // Mantener el preview local
          } finally {
            setIsUploadingImage(false);
          }
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

  return (
    <View style={styles.container}>
      {/* Botón flotante de edición/guardado (solo si NO es modo creación) */}
      {!isCreationMode && (
        <TouchableOpacity 
          style={styles.floatingEditButton}
          onPress={() => {
            if (isEditing) {
              if (hasChanges) {
                handleSave();
              } else {
                handleCancel();
              }
            } else {
              setIsEditing(true);
            }
          }}
        >
          <MaterialIcons 
            name={isEditing ? (hasChanges ? "check" : "close") : "edit"} 
            size={scale(20)} 
            color={isEditing ? (hasChanges ? "#4CAF50" : "#FF5252") : "#FF7A59"} 
          />
        </TouchableOpacity>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={scale(24)} color="#333" />
          </TouchableOpacity>
          <Label 
            text={isCreationMode ? "Pet Registration" : "Pet Profile"} 
            style={styles.headerTitle} 
            bold 
          />
        </View>

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            <View style={styles.photoContainer}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="paw" size={scale(40)} color="#999" />
                </View>
              )}
            </View>
            {(isEditing || isCreationMode) && (
              <>
                <TouchableOpacity 
                  style={styles.editIconContainer}
                  onPress={handlePhotoUpload}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color="#FF7A59" />
                  ) : (
                    <MaterialIcons name="camera-alt" size={scale(16)} color="#666" />
                  )}
                </TouchableOpacity>
                {profilePhoto && (
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
                            onPress: () => setProfilePhoto(null)
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
          
          {/* Nombre de la mascota */}
          <Label 
            text={dogName || 'New Pet'} 
            style={styles.petName} 
            bold 
          />
          {breed && (
            <Label 
              text={breed} 
              style={styles.petBreed} 
            />
          )}
        </View>

        {/* Essential Details */}
        <View style={styles.section}>
          <Label text="Essential Details" style={styles.sectionTitle} bold />
          
          <View style={styles.inputContainer}>
            <Label text="DOG NAME *" style={styles.inputLabel} bold />
            <TextInput
              style={[styles.input, !(isEditing || isCreationMode) && styles.inputDisabled]}
              placeholder="Enter name"
              placeholderTextColor="#999"
              value={dogName}
              onChangeText={setDogName}
              editable={isEditing || isCreationMode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Label text="BREED *" style={styles.inputLabel} bold />
            <TextInput
              style={[styles.input, !(isEditing || isCreationMode) && styles.inputDisabled]}
              placeholder="e.g. Labrador Retriever"
              placeholderTextColor="#999"
              value={breed}
              onChangeText={setBreed}
              editable={isEditing || isCreationMode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Label text="SIZE *" style={styles.inputLabel} bold />
            <View style={[styles.sizeSelector, !(isEditing || isCreationMode) && styles.selectorDisabled]} pointerEvents={(isEditing || isCreationMode) ? 'auto' : 'none'}>
              <TouchableOpacity
                style={[styles.sizeButton, size === 'small' && styles.sizeButtonActive]}
                onPress={() => setSize('small')}
              >
                <Label 
                  text="Small" 
                  style={[styles.sizeButtonText, size === 'small' && styles.sizeButtonTextActive]} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeButton, size === 'medium' && styles.sizeButtonActive]}
                onPress={() => setSize('medium')}
              >
                <Label 
                  text="Medium" 
                  style={[styles.sizeButtonText, size === 'medium' && styles.sizeButtonTextActive]} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeButton, size === 'large' && styles.sizeButtonActive]}
                onPress={() => setSize('large')}
              >
                <Label 
                  text="Large" 
                  style={[styles.sizeButtonText, size === 'large' && styles.sizeButtonTextActive]} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Physical Attributes */}
        <View style={styles.section}>
          <Label text="Physical Attributes" style={styles.sectionTitle} bold />
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Label text="AGE (YEARS)" style={styles.inputLabel} bold />
              <TextInput
                style={[styles.input, !(isEditing || isCreationMode) && styles.inputDisabled]}
                placeholder="5"
                placeholderTextColor="#999"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                editable={isEditing || isCreationMode}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Label text="WEIGHT (KG)" style={styles.inputLabel} bold />
              <TextInput
                style={[styles.input, !(isEditing || isCreationMode) && styles.inputDisabled]}
                placeholder="12"
                placeholderTextColor="#999"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                editable={isEditing || isCreationMode}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Label text="GENDER" style={styles.inputLabel} bold />
            <View style={[styles.genderSelector, !(isEditing || isCreationMode) && styles.selectorDisabled]} pointerEvents={(isEditing || isCreationMode) ? 'auto' : 'none'}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                onPress={() => setGender('male')}
              >
                <Label 
                  text="Male" 
                  style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextActive]} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                onPress={() => setGender('female')}
              >
                <Label 
                  text="Female" 
                  style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextActive]} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Label text="COAT COLOR" style={styles.inputLabel} bold />
            <TextInput
              style={[styles.input, !(isEditing || isCreationMode) && styles.inputDisabled]}
              placeholder="e.g. Golden, Brindle"
              placeholderTextColor="#999"
              value={coatColor}
              onChangeText={setCoatColor}
              editable={isEditing || isCreationMode}
            />
          </View>
        </View>

        {/* Health & Safety */}
        <View style={styles.section}>
          <Label text="Health & Safety" style={styles.sectionTitle} bold />
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleIcon}>
              <Ionicons name="medical" size={scale(20)} color="#FF7A59" />
            </View>
            <Label text="Is Vaccinated" style={styles.toggleLabel} />
            <View style={[styles.toggleSwitch, !(isEditing || isCreationMode) && styles.selectorDisabled]} pointerEvents={(isEditing || isCreationMode) ? 'auto' : 'none'}>
              <ToggleButton 
                value={isVaccinated} 
                onValueChange={setIsVaccinated}
                leftLabel="Yes"
                rightLabel="No"
              />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleIcon}>
              <Ionicons name="cut" size={scale(20)} color="#FF7A59" />
            </View>
            <Label text="Is Neutered/Sterilized" style={styles.toggleLabel} />
            <View style={[styles.toggleSwitch, !(isEditing || isCreationMode) && styles.selectorDisabled]} pointerEvents={(isEditing || isCreationMode) ? 'auto' : 'none'}>
              <ToggleButton 
                value={isNeutered} 
                onValueChange={setIsNeutered}
                leftLabel="Yes"
                rightLabel="No"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Label text="MEDICAL INFO / ALLERGIES" style={styles.inputLabel} bold />
            <TextInput
              style={[styles.input, styles.textArea, !(isEditing || isCreationMode) && styles.inputDisabled]}
              placeholder="List any allergies or medical conditions"
              placeholderTextColor="#999"
              value={medicalInfo}
              onChangeText={setMedicalInfo}
              multiline
              numberOfLines={3}
              editable={isEditing || isCreationMode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Label text="SPECIAL NEEDS" style={styles.inputLabel} bold />
            <TextInput
              style={[styles.input, styles.textArea, !(isEditing || isCreationMode) && styles.inputDisabled]}
              placeholder="Describe any behavioral or physical special needs"
              placeholderTextColor="#999"
              value={specialNeeds}
              onChangeText={setSpecialNeeds}
              multiline
              numberOfLines={3}
              editable={isEditing || isCreationMode}
            />
          </View>
        </View>

        {/* Botón de guardar (solo en modo creación) */}
        {isCreationMode && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Label text="Save Pet Profile" style={styles.saveButtonText} bold />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingEditButton: {
    position: 'absolute',
    top: scale(50),
    right: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(25),
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: scale(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: scale(50),
    paddingBottom: scale(20),
  },
  backButton: {
    marginRight: scale(12),
  },
  headerTitle: {
    fontSize: scale(20),
    color: '#333',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: scale(30),
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: scale(12),
  },
  photoContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: scale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  photoLabel: {
    fontSize: scale(14),
    color: '#666',
  },
  petName: {
    fontSize: scale(22),
    color: '#333',
    marginTop: scale(8),
  },
  petBreed: {
    fontSize: scale(16),
    color: '#666',
    marginTop: scale(4),
  },
  valueText: {
    fontSize: scale(15),
    color: '#333',
    paddingVertical: scale(12),
    paddingHorizontal: scale(4),
  },
  section: {
    paddingHorizontal: scale(20),
    marginBottom: scale(25),
  },
  sectionTitle: {
    fontSize: scale(16),
    color: '#333',
    marginBottom: scale(15),
  },
  inputContainer: {
    marginBottom: scale(16),
  },
  inputLabel: {
    fontSize: scale(11),
    color: '#666',
    marginBottom: scale(8),
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: scale(8),
    paddingHorizontal: scale(15),
    paddingVertical: scale(12),
    fontSize: scale(15),
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputDisabled: {
    backgroundColor: '#FAFAFA',
    color: '#666',
  },
  selectorDisabled: {
    opacity: 0.6,
  },
  textArea: {
    height: scale(80),
    textAlignVertical: 'top',
    paddingTop: scale(12),
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: scale(10),
  },
  sizeButton: {
    flex: 1,
    paddingVertical: scale(10),
    borderRadius: scale(8),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: '#FF7A59',
    borderColor: '#FF7A59',
  },
  sizeButtonActiveSelected: {
    backgroundColor: '#FF7A59',
    borderColor: '#FF7A59',
  },
  sizeButtonInactive: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
  },
  sizeButtonText: {
    fontSize: scale(14),
    color: '#666',
  },
  sizeButtonTextActive: {
    color: '#FFF',
  },
  sizeButtonTextInactive: {
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    gap: scale(12),
  },
  halfWidth: {
    flex: 1,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: scale(12),
  },
  genderButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  genderButtonText: {
    fontSize: scale(14),
    color: '#666',
  },
  genderButtonTextActive: {
    color: '#FFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    paddingVertical: scale(8),
  },
  toggleIcon: {
    marginRight: scale(12),
  },
  toggleLabel: {
    flex: 1,
    fontSize: scale(14),
    color: '#333',
  },
  toggleSwitch: {
    width: scale(140),
  },
  saveButton: {
    marginHorizontal: scale(20),
    backgroundColor: '#FF7A59',
    borderRadius: scale(12),
    paddingVertical: scale(16),
    alignItems: 'center',
    marginTop: scale(20),
    marginBottom: scale(10),
    ...shadow,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: scale(16),
  },
});
