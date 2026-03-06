import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Label from '../components/Label';
import CustomInput from '../components/CustomInput';
import ToggleButton from '../components/ToggleButton';
import Counter from '../components/Counter';
import OptionSelector from '../components/OptionSelector';

export default function RegisterOwner({ navigation, route }) {
  const scrollViewRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos del usuario
    fullName: '',
    phone: '',
    email: '',
    
    // Datos de mascotas (array para soportar múltiples)
    pets: [
      {
        name: '',
        age: 1,
        size: 'pequeño',
        type: 'perro',
        isCastrated: null,
        getsAlongWithOthers: null,
        medicalCondition: '',
        specifications: '',
      }
    ],
  });

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updatePetData = (index, field, value) => {
    const updatedPets = [...formData.pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setFormData({ ...formData, pets: updatedPets });
  };

  const addPet = () => {
    setFormData({
      ...formData,
      pets: [
        ...formData.pets,
        {
          name: '',
          age: 1,
          size: 'pequeño',
          type: 'perro',
          isCastrated: null,
          getsAlongWithOthers: null,
          medicalCondition: '',
          specifications: '',
        }
      ]
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validar datos del paso 1
      setCurrentStep(2);
    } else {
      // Enviar registro
      handleRegister();
    }
  };

  // Scroll al inicio cuando cambia el paso
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [currentStep]);

  const handleRegister = () => {
    console.log('Registrando:', formData);
    // Aquí iría la lógica de registro con Redux
    navigation.navigate('TabCreator');
  };

  const sizeOptions = [
    { label: 'Pequeño', value: 'pequeño' },
    { label: 'Mediano', value: 'mediano' },
    { label: 'Grande', value: 'grande' },
  ];

  const typeOptions = [
    { label: 'Perro', value: 'perro' },
    { label: 'Gato', value: 'gato' },
    { label: 'Otro', value: 'otro' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Label text={`${currentStep}/2`} style={styles.progressText} />
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
          </View>
        </View>

        {/* Step 1: Datos personales y primera mascota */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Label text="Regístrate" style={styles.title} bold />
            <Label 
              text="Ingresa tus datos y los de tu mascota para completar el perfil" 
              style={styles.subtitle} 
            />

            {/* Tus datos */}
            <View style={styles.section}>
              <Label text="Tus datos" style={styles.sectionTitle} bold />
              
              <CustomInput
                placeholder="Nombre y apellido"
                value={formData.fullName}
                onChangeText={(value) => updateFormData('fullName', value)}
                style={styles.input}
              />

              <CustomInput
                placeholder="Número telefónico"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                style={styles.input}
              />

              <CustomInput
                placeholder="Correo o mail"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Datos de tu mascota */}
            <View style={styles.section}>
              <Label text="Datos de tu mascota" style={styles.sectionTitle} bold />
              
              <CustomInput
                placeholder="Nombre de tu mascota"
                value={formData.pets[0].name}
                onChangeText={(value) => updatePetData(0, 'name', value)}
                style={styles.input}
              />

              {/* Años de edad */}
              <View style={styles.fieldContainer}>
                <Label text="Años de edad" style={styles.fieldLabel} bold />
                <Counter
                  value={formData.pets[0].age}
                  onValueChange={(value) => updatePetData(0, 'age', value)}
                  min={0}
                  max={30}
                />
              </View>

              {/* Tamaño */}
              <OptionSelector
                label="Tamaño"
                options={sizeOptions}
                value={formData.pets[0].size}
                onValueChange={(value) => updatePetData(0, 'size', value)}
              />

              {/* Tipo de mascota */}
              <OptionSelector
                label="Tipo de mascota"
                options={typeOptions}
                value={formData.pets[0].type}
                onValueChange={(value) => updatePetData(0, 'type', value)}
              />
            </View>
          </View>
        )}

        {/* Step 2: Detalles de las mascotas */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Label text="Datos de tu mascota" style={styles.title} bold />

            {formData.pets.map((pet, index) => (
              <View key={index} style={styles.petSection}>
                {index > 0 && (
                  <Label 
                    text={`Mascota ${index + 1}`} 
                    style={styles.petNumber} 
                    bold 
                  />
                )}

                {/* ¿Está castrado/esterilizado? */}
                <View style={styles.fieldContainer}>
                  <Label 
                    text="¿Está castrado/ esterilizado?" 
                    style={styles.fieldLabel} 
                    bold 
                  />
                  <ToggleButton
                    value={pet.isCastrated}
                    onValueChange={(value) => updatePetData(index, 'isCastrated', value)}
                  />
                </View>

                {/* ¿Se lleva bien con otros animales? */}
                <View style={styles.fieldContainer}>
                  <Label 
                    text="¿Se lleva bien con otros animales?" 
                    style={styles.fieldLabel} 
                    bold 
                  />
                  <ToggleButton
                    value={pet.getsAlongWithOthers}
                    onValueChange={(value) => updatePetData(index, 'getsAlongWithOthers', value)}
                  />
                </View>

                {/* Condición médica */}
                <View style={styles.fieldContainer}>
                  <Label text="Condición médica" style={styles.fieldLabel} bold />
                  <Label 
                    text="Rellenar en caso de que su mascota presente algún cuadro médico a notificar" 
                    style={styles.fieldDescription} 
                  />
                  <TextInput
                    style={styles.textArea}
                    placeholder=""
                    value={pet.medicalCondition}
                    onChangeText={(value) => updatePetData(index, 'medicalCondition', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Especificaciones */}
                <View style={styles.fieldContainer}>
                  <Label text="Especificaciones" style={styles.fieldLabel} bold />
                  <Label 
                    text="Coloque una breve descripción de su mascota, su comportamiento, si padece alguna condición, etc." 
                    style={styles.fieldDescription} 
                  />
                  <TextInput
                    style={styles.textArea}
                    placeholder=""
                    value={pet.specifications}
                    onChangeText={(value) => updatePetData(index, 'specifications', value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            ))}

            {/* Agregar otra mascota */}
            <TouchableOpacity style={styles.addPetButton} onPress={addPet}>
              <Ionicons name="add" size={scale(18)} color="#FF7A59" />
              <Label text="Agregar otra mascota" style={styles.addPetText} bold />
            </TouchableOpacity>
          </View>
        )}

        {/* Botón Siguiente */}
        <TouchableOpacity 
          style={styles.nextButtonContainer}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF7A59', '#FFB84D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButton}
          >
            <Label text="Siguiente" style={styles.nextButtonText} bold />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: scale(50),
    paddingBottom: scale(30),
  },
  progressContainer: {
    marginBottom: scale(20),
  },
  progressText: {
    fontSize: scale(14),
    color: '#666',
    marginBottom: scale(8),
  },
  progressBar: {
    height: scale(4),
    backgroundColor: '#E0E0E0',
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7A59',
  },
  stepContainer: {
    marginBottom: scale(20),
  },
  title: {
    fontSize: scale(28),
    color: '#000',
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(14),
    color: '#666',
    marginBottom: scale(24),
    lineHeight: scale(20),
  },
  section: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: scale(16),
    color: '#000',
    marginBottom: scale(16),
  },
  input: {
    marginBottom: scale(12),
  },
  fieldContainer: {
    marginBottom: scale(20),
  },
  fieldLabel: {
    fontSize: scale(14),
    color: '#000',
    marginBottom: scale(10),
  },
  fieldDescription: {
    fontSize: scale(12),
    color: '#999',
    marginBottom: scale(10),
    lineHeight: scale(16),
  },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(14),
    fontSize: scale(14),
    color: '#000',
    minHeight: scale(80),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  petSection: {
    marginBottom: scale(24),
  },
  petNumber: {
    fontSize: scale(16),
    color: '#000',
    marginBottom: scale(16),
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(14),
    paddingHorizontal: scale(20),
    borderRadius: scale(25),
    borderWidth: 1.5,
    borderColor: '#FF7A59',
    backgroundColor: '#FFF',
    marginBottom: scale(20),
    gap: scale(8),
  },
  addPetText: {
    fontSize: scale(14),
    color: '#FF7A59',
  },
  nextButtonContainer: {
    marginTop: scale(10),
  },
  nextButton: {
    paddingVertical: scale(16),
    borderRadius: scale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: scale(16),
    color: '#FFF',
  },
});
