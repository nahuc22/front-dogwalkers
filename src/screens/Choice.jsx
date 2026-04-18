import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import Label from '../components/Label';

export default function Choice({ navigation }) {
  const handleWalkerChoice = () => {
    // Navegar al login como paseador
    navigation.navigate('Login', { userType: 'walker' });
  };

  const handleOwnerChoice = () => {
    // Navegar al login como usuario/dueño
    navigation.navigate('Login', { userType: 'owner' });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={scale(20)} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Label text="Selecciona una opción" style={styles.title} bold />

        {/* Walker Option */}
        <View style={styles.optionContainer}>
          <Label text="Continuar como paseador/ cuidador" style={styles.optionTitle} bold />
          <Label 
            text="Podrás trabajar paseando mascotas o cuidando mascotas de forma regular, con horarios flexibles y jornadas adaptativas a tus necesidades."
            style={styles.optionDescription}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleWalkerChoice}
            activeOpacity={0.8}
          >
            <Label text="Quiero ser paseador" style={styles.buttonText} bold />
          </TouchableOpacity>
        </View>

        {/* Owner Option */}
        <View style={styles.optionContainer}>
          <Label text="Continuar como usuario de mascotas" style={styles.optionTitle} bold />
          <Label 
            text="Encontrarás múltiples trabajadores dispuestos a pasear y cuidar a tus mascotas de forma personalizada, flexible y adaptativa."
            style={styles.optionDescription}
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOwnerChoice}
            activeOpacity={0.8}
          >
            <Label text="Quiero ser usuario" style={styles.buttonText} bold />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Label 
            text="By signing in, I agree with Terms of Use\nand Privacy Policy"
            style={styles.footerText}
          />
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
    paddingHorizontal: scale(20),
    paddingTop: scale(50),
    paddingBottom: scale(30),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    marginBottom: scale(20),
  },
  title: {
    fontSize: scale(24),
    color: '#000',
    marginBottom: scale(10),
  },
  optionContainer: {
    marginBottom: scale(20),
  },
  optionTitle: {
    fontSize: scale(15),
    color: '#050505ff',
    marginBottom: scale(10),
  },
  optionDescription: {
    fontSize: scale(13.5),
    color: '#666',
    lineHeight: scale(20),
    marginBottom: scale(16),
  },
  button: {
    backgroundColor: '#FF7A59',
    borderRadius: scale(12),
    paddingVertical: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: scale(16),
  },
  footer: {
    marginTop: scale(30),
    alignItems: 'center',
  },
  footerText: {
    fontSize: scale(12),
    color: '#999',
    textAlign: 'center',
    lineHeight: scale(18),
  },
  footerLink: {
    color: '#000',
    fontWeight: '600',
  },
});
