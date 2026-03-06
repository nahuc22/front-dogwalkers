import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const CustomHeader = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <View style={[styles.header, darkMode ? styles.headerDark : styles.headerLight]}>
      <Text style={darkMode ? styles.titleDark : styles.titleLight}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
  },
  headerDark: {
    backgroundColor: '#000',
  },
  headerLight: {
    backgroundColor: '#fff',
  },
  titleDark: {
    color: '#fff',
    fontSize: 20,
  },
  titleLight: {
    color: '#000',
    fontSize: 20,
  },
});

export default CustomHeader;