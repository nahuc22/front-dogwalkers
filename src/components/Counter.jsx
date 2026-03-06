import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import Label from './Label';

export default function Counter({ value, onValueChange, min = 0, max = 30 }) {
  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value <= min && styles.buttonDisabled]}
        onPress={handleDecrement}
        disabled={value <= min}
        activeOpacity={0.7}
      >
        <Ionicons name="remove" size={scale(20)} color={value <= min ? '#CCC' : '#FF7A59'} />
      </TouchableOpacity>
      
      <View style={styles.valueContainer}>
        <Label text={value.toString()} style={styles.valueText} bold />
      </View>
      
      <TouchableOpacity
        style={[styles.button, value >= max && styles.buttonDisabled]}
        onPress={handleIncrement}
        disabled={value >= max}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={scale(20)} color={value >= max ? '#CCC' : '#FF7A59'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(15),
  },
  button: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    backgroundColor: '#FFE8E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  valueContainer: {
    minWidth: scale(40),
    alignItems: 'center',
  },
  valueText: {
    fontSize: scale(18),
    color: '#000',
  },
});
