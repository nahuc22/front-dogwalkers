import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';

/**
 * Componente reutilizable de botón de edición
 * @param {boolean} isEditing - Estado de edición
 * @param {boolean} hasChanges - Si hay cambios pendientes
 * @param {function} onPress - Función a ejecutar al presionar
 * @param {object} style - Estilos adicionales
 */
export default function EditButton({ isEditing, hasChanges, onPress, style }) {
  return (
    <TouchableOpacity 
      style={[styles.editButton, style]}
      onPress={onPress}
    >
      <MaterialIcons 
        name={isEditing ? (hasChanges ? "check" : "close") : "edit"} 
        size={scale(24)} 
        color={isEditing ? (hasChanges ? "#4CAF50" : "#FF5252") : "#FF7A59"} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    top: scale(50),
    right: scale(20),
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: scale(25),
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
