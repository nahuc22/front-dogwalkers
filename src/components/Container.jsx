import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { appColors } from '../utils/appColors';

function Container({ children, isScrollable, style }) {
    return (
        <View style={styles.container}>
            {
                isScrollable ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.innerView, style]}>
                            {children}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={[styles.innerView, style]}>
                        {children}
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flex: 1,
    },
    light: {
        backgroundColor: appColors.white,
    },
    dark: {
        backgroundColor: appColors.black,
    },
});

export default Container;
