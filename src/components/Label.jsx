import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { appColors } from '../utils/appColors'

function Label({ text , style, bold, numberOfLines, ellipsizeMode , onPress}) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Text
                    style={[styles.label, style, bold && styles.bold]}
                    numberOfLines={numberOfLines}
                    ellipsizeMode={ellipsizeMode}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
    return (
        <Text
            style={[styles.label, style, bold && styles.bold]}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
        >
            {text}
        </Text>
    );
}

const styles = StyleSheet.create({
    label:{
        fontSize:scale(14),
        color:appColors.black,
        fontFamily: 'Poppins'
    },
    light:{ 
        color:appColors.black
    },
    dark:{ 
        color:appColors.white
    },
    bold:{
        fontFamily: 'Poppins-Bold'
    }
})


export default  Label