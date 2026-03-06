import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import Label from './Label';

export default function OptionSelector({ options, value, onValueChange, label }) {
  return (
    <View style={styles.container}>
      {label && <Label text={label} style={styles.label} bold />}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              value === option.value && styles.optionActive,
            ]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <Label
              text={option.label}
              style={[
                styles.optionText,
                value === option.value && styles.optionTextActive,
              ]}
              bold={value === option.value}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(16),
  },
  label: {
    fontSize: scale(14),
    color: '#000',
    marginBottom: scale(10),
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: scale(10),
  },
  option: {
    flex: 1,
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(25),
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    backgroundColor: '#FF7A59',
    borderColor: '#FF7A59',
  },
  optionText: {
    fontSize: scale(13),
    color: '#666',
  },
  optionTextActive: {
    color: '#FFF',
  },
});
