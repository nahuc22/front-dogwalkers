import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { scale } from 'react-native-size-matters';
import { appColors } from '../utils/appColors';
import TouchableRipple from 'react-native-touch-ripple';
import Label from './Label';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomButton({ iconLeft, label, style, onPress, labelStyle, colors = [appColors.primary, appColors.primaryTwo], borderColor , rippleColor = appColors.white }) {
    return (
        <LinearGradient
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 0.5, y: 0.9 }}
            colors={colors}
            style={[
                styles.gradient,
                borderColor && { borderWidth: 1, borderColor },
                style,
            ]}
        >
            <TouchableRipple rippleColor={rippleColor} onPress={onPress} rippleDuration={800} style={[styles.container]}>
                {iconLeft && (
                    <View style={{ paddingHorizontal: scale(10) }}>
                        {iconLeft}
                    </View>
                )}
                <Label text={`${label}`} style={[styles.label, labelStyle]} />
            </TouchableRipple>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        height: scale(50),
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        height: scale(60),
        flexDirection: 'row',
        borderRadius: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    label: {
        fontSize: scale(16),
        fontWeight: '500',
        color: appColors.white,
    },
});