import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { isPetProfile } from '../utils/dataMappers';
import WalkerProfileScreen from './profiles/WalkerProfileScreen';
import PetProfileScreen from './profiles/PetProfileScreen';

/**
 * Router de perfiles - Redirige al componente correcto según el tipo
 * Mantiene compatibilidad con la navegación existente
 */
export default function WalkerProfile() {
    const route = useRoute();
    const { item } = route.params;
    
    // Detectar si es un perro o un walker
    const isPet = isPetProfile(item);
    
    // Log para debugging
    useEffect(() => {
        console.log('🔀 WalkerProfile Router - Tipo:', isPet ? 'Pet' : 'Walker');
    }, [isPet]);
    
    // Renderizar el componente correcto según el tipo
    if (isPet) {
        return <PetProfileScreen />;
    }
    
    return <WalkerProfileScreen />;
}
