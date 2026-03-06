import { Platform } from 'react-native';

export const appColors = {
    primary: '#FE904B',
    primaryTwo: '#FB724C',
    secondary: '#fff',
    white: '#fff',
    // black:'#000',
    lightBlue: "rgba(87, 161, 251, 0.79)",
    black:"rgba(0,0,0,0.79)",
    gray: '#AEAEB2', // Color gris para bordes en modo claro
    darkGray: '#333333',
    lightGray: '#F0F0F0', // Gris oscuro para mejor contraste en modo oscuro
    placeHolderColor: '#A1A1A1'
};

export const shadow = Platform.select({
    web: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    },
    default: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});
