import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { appColors, shadow } from '../utils/appColors';
import { scale } from 'react-native-size-matters';
import Label from './Label.jsx';

function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  InputStyle,
  IconRight,
  IconLeft,
}) {
  return (
    <View style={styles.container}>
      {IconLeft && <IconLeft />}
      <View style={{ padding: scale(8) }}>
        <Label text={placeholder} style={{ fontSize: scale(12), color: appColors.gray , marginTop: scale(5), marginBottom: scale(-6)}} bold />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor={appColors.placeHolderColor}
          style={[styles.input]}
        />
      </View>
      {IconRight && <IconRight />}
    </View>
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    margin: scale(5),
    height: scale(50),
    alignItems: 'center',
    backgroundColor: appColors.lightGray,
    borderRadius: scale(14),
    ...shadow,
  },
  input: {
    height: scale(35),
    width: scale(275),
    fontSize: scale(15),
    marginBottom: scale(1),
  },
});
