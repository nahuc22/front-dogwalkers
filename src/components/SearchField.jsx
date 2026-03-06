import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { appColors } from '../utils/appColors';

export default function SearchField({ placeholder }) {
  return (
    <View
      style={{
        borderRadius: scale(10),
        backgroundColor: appColors.lightGray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'red',
        height: scale(43),             // Ajusta la altura según lo necesario
        alignItems: 'center',          // Centra los elementos verticalmente
        paddingHorizontal: scale(10),  // Añade padding horizontal
        paddingVertical: scale(5),     // Añade padding vertical para evitar que el texto se corte
      }}
    >
      <MaterialIcons
        name="place"
        size={scale(20)}
        color={appColors.placeHolderColor}
        style={{
          marginRight: scale(5),
        }}
      />
      <TextInput
        style={{
          flex: 1,
          fontSize: scale(15),
          textAlignVertical: 'center',  // Centra el texto verticalmente
          paddingVertical: scale(0),    // Elimina padding vertical adicional
        }}
        placeholderTextColor={appColors.gray}
        placeholder={placeholder}
      />
      <MaterialIcons
        name="tune"
        size={scale(20)}
        color={appColors.placeHolderColor}
        style={{
          marginLeft: scale(5),
        }}
      />
    </View>
  );
}
