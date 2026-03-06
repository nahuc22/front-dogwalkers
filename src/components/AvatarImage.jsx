import * as React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
} from 'react-native';
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de props
import { appColors } from '../utils/appColors';

const defaultSize = 64;

const AvatarImage = ({
    size = defaultSize,
    source,
    style,
    ...rest
}) => {
    // Validación en tiempo de ejecución para asegurar que `size` sea un número
    if (typeof size !== 'number') {
        console.error(
            `Invalid prop 'size' supplied to AvatarImage. Expected a number, but received: ${size}`
        );
        size = defaultSize; // Establece un valor predeterminado si `size` no es numérico
    }

    const { backgroundColor = appColors.primary } = StyleSheet.flatten(style) || {};

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
                style,
            ]}
            {...rest}
        >
            {typeof source === 'function' && source({ size })}
            {typeof source !== 'function' && (
                <Image
                    source={source}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                />
            )}
        </View>
    );
};

// Validación de PropTypes sin `isRequired`
AvatarImage.propTypes = {
    size: PropTypes.number,
    source: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            uri: PropTypes.string,
        }),
    ]).isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

AvatarImage.displayName = 'Avatar.Image';

export default AvatarImage;
