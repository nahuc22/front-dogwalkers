import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import Label from './Label';

export default function ToggleButton({ value, onValueChange, leftLabel = 'Sí', rightLabel = 'No' }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value === true && styles.buttonActive]}
        onPress={() => onValueChange(true)}
        activeOpacity={0.8}
      >
        <Label 
          text={leftLabel} 
          style={[styles.buttonText, value === true && styles.buttonTextActive]} 
          bold={value === true}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, value === false && styles.buttonActive]}
        onPress={() => onValueChange(false)}
        activeOpacity={0.8}
      >
        <Label 
          text={rightLabel} 
          style={[styles.buttonText, value === false && styles.buttonTextActive]} 
          bold={value === false}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: scale(12),
  },
  button: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(25),
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF7A59',
    borderColor: '#FF7A59',
  },
  buttonText: {
    fontSize: scale(14),
    color: '#666',
  },
  buttonTextActive: {
    color: '#FFF',
  },
});
