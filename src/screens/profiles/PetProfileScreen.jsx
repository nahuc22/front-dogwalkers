import React, { useState } from 'react';
import { ImageBackground, Pressable, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import Label from '../../components/Label';
import { appColors } from '../../utils/appColors';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import MiniMap from '../../components/MiniMap';
import Reviews from '../../components/Reviews';
import { useRoute } from '@react-navigation/native';

/**
 * Pantalla de perfil de Mascota
 * Muestra información del pet y datos del dueño
 */
export default function PetProfileScreen() {
    const route = useRoute();
    const { item } = route.params;
    
    // Obtener datos del usuario logueado
    const user = useSelector((state) => state.user);
    const { role } = user;
    
    // Extraer datos del pet
    const petData = item?.petData || item;
    
    const [activeTab, setActiveTab] = useState("About");
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const Card = ({ hideBorder, label, subLabel }) => {
        return (
            <View style={{ paddingHorizontal: scale(10), borderLeftWidth: scale(hideBorder ? 0 : 0.7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Label style={{ fontSize: scale(13) }} text={label}/>
                <Label style={{ fontSize: scale(13), paddingHorizontal: scale(5), color: appColors.gray }} text={subLabel || ""} />
            </View>
        );
    };

    const Badge = ({ label, isActive, onPress }) => {
        return (
            <Pressable onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', borderRadius: scale(14), backgroundColor: isActive ? appColors.black : appColors.lightGray, padding: scale(12), height: scale(44), width: scale(99) }}>
                <Label style={{ fontSize: scale(13), color: appColors.white }} text={label} bold></Label>
            </Pressable>
        );
    };

    const Tabs = ({ activeTab, setActiveTab }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(5), marginBottom: scale(10) }}>
                <Badge isActive={activeTab === "About"} label={"About"} onPress={() => setActiveTab("About")} />
                <Badge isActive={activeTab === "Location"} label={"Location"} onPress={() => setActiveTab("Location")} />
                <Badge isActive={activeTab === "Reviews"} label={"Reviews"} onPress={() => setActiveTab("Reviews")} />
            </View>
        );
    };

    const renderContent = () => {
        if (activeTab === "About") {
            return (
                <View>
                    <View style={{ flexDirection: 'row', paddingVertical: scale(10) }}>
                        <View style={{ flex: 1 }}>
                            <Label text="Edad" style={{ fontSize: scale(13), color: appColors.gray }} />
                            <Label 
                                text={`${petData?.age || '3'} años`} 
                                style={{ paddingVertical: scale(5), fontSize: scale(17) }} 
                                bold 
                            />
                        </View>
                        <View style={{ marginLeft: scale(20), flex: 1 }}>
                            <Label text="Raza" style={{ fontSize: scale(13), color: appColors.gray }} />
                            <Label 
                                text={petData?.breed || 'Raza desconocida'} 
                                style={{ paddingVertical: scale(5), fontSize: scale(17) }} 
                                bold 
                            />
                        </View>
                    </View>
                    <View>
                        <Label
                            text={petData?.specifications || petData?.medicalCondition || 'Sin información adicional'}
                            style={{ paddingVertical: scale(5), fontSize: scale(13), color: appColors.gray }}
                            numberOfLines={expanded ? undefined : 3}
                        />
                        {((petData?.specifications || petData?.medicalCondition || '').length > 125) && (
                            <TouchableOpacity onPress={toggleExpand}>
                                <Text style={{ fontSize: 13, color: appColors.primary }}>
                                    {expanded ? "Show less" : "Read more"}
                                </Text>
                            </TouchableOpacity>
                        )}
                        
                        {/* Botón para contactar al dueño */}
                        <CustomButton 
                            label="Contactar Dueño" 
                            style={{ marginTop: scale(10) }} 
                        />
                        
                        {/* Información del dueño */}
                        {item.ownerName && (
                            <View style={{ marginTop: scale(10), padding: scale(10), backgroundColor: appColors.lightGray, borderRadius: scale(8) }}>
                                <Label text="Dueño" style={{ fontSize: scale(12), color: appColors.gray }} />
                                <Label text={item.ownerName} style={{ fontSize: scale(15), marginTop: scale(5) }} bold />
                                {petData?.ownerLocation && (
                                    <Label text={petData.ownerLocation} style={{ fontSize: scale(12), color: appColors.gray, marginTop: scale(2) }} />
                                )}
                            </View>
                        )}
                    </View>
                </View>
            );
        } else if (activeTab === "Location") {
            return <MiniMap />;
        } else if (activeTab === "Reviews") {
            return <Reviews />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {item.img || petData?.profileImage ? (
                <ImageBackground
                    resizeMode="cover"
                    source={petData?.profileImage ? { uri: petData.profileImage } : item.img}
                    style={styles.imageBackground}
                >
                    <BackButton style={styles.backButton} />
                </ImageBackground>
            ) : (
                <View style={styles.imageBackground}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.lightGray }}>
                        <MaterialIcons name="pets" size={scale(80)} color={appColors.gray} />
                    </View>
                    <BackButton style={styles.backButton} />
                </View>
            )}
            <View style={styles.content}>
                <FlatList
                    data={[{ key: 'content' }]}  
                    renderItem={() => (
                        <View>
                            <View style={styles.header}>
                                <Label text={item.name} style={styles.headerText} bold />
                                <View style={styles.cardsContainer}>
                                    <Card hideBorder label={item.distance} subLabel="km"/>
                                    <Card label={petData?.size || 'Mediano'} />
                                    <Card label={petData?.type || 'Perro'} />
                                </View>
                            </View>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            {renderContent()}
                        </View>
                    )}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.white,
    },
    imageBackground: {
        width: scale(350),
        height: scale(450),
    },
    backButton: {
        marginTop: scale(20),
        padding: scale(10),
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(20),
        backgroundColor: appColors.white,
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        marginTop: -50,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: scale(20),
    },
    header: {
        paddingVertical: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: appColors.gray,
        borderBottomWidth: 1,
        marginTop: scale(5)
    },
    headerText: {
        fontSize: scale(28),
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
