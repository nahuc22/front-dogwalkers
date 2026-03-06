import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { appColors } from '../utils/appColors';

const MiniMap = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vista de mapa no disponible en Web</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: appColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  text: {
    color: appColors.gray,
    fontSize: 14,
  },
});

export default MiniMap;
