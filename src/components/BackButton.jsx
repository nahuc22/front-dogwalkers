import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ style, destination }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (destination) {
      navigation.navigate(destination); // Navega a la ruta proporcionada
    } else {
      navigation.goBack(); // Vuelve a la pantalla anterior si no se pasa `destination`
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} style={[style]}>
        <MaterialIcons name="arrow-back" size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BackButton;