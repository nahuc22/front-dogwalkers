import React, { useState, useEffect } from 'react';
import { ImageBackground, Pressable, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import Label from '../../components/Label';
import EditButton from '../../components/EditButton';
import { appColors } from '../../utils/appColors';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import MiniMap from '../../components/MiniMap';
import Reviews from '../../components/Reviews';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/actions/users/userAction';
import Toast from 'react-native-toast-message';
import { uploadWalkerCoverImage } from '../../services/imageService';

/**
 * Pantalla de perfil de Walker (paseador)
 * Muestra información del walker y permite editar si es el propio perfil
 */
export default function WalkerProfileScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { item } = route.params;
    
    // Obtener datos del usuario logueado
    const user = useSelector((state) => state.user);
    const { userId, role } = user;
    
    // Extraer datos del walker
    const walkerData = item?.walkerData || item;
    
    // Verificar si el walker está viendo su propio perfil
    const walkerUserId = walkerData?.userId || item?.userId;
    const isOwnProfile = role === 'walker' && walkerUserId === userId;
    
    const [activeTab, setActiveTab] = useState("About");
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Estados editables
    const [editedPrice, setEditedPrice] = useState(walkerData?.price || item?.price || '5');
    const [editedDescription, setEditedDescription] = useState(walkerData?.description || 'Sin descripción profesional');
    const [editedAge, setEditedAge] = useState(walkerData?.age || item?.age || '27');
    const [editedExperience, setEditedExperience] = useState(walkerData?.experience || item?.experience || '11 Months');
    const [editedCoverImage, setEditedCoverImage] = useState(walkerData?.coverImage || walkerData?.profileImage || null);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    
    // Detectar cambios
    useEffect(() => {
        if (!isEditing) {
            setHasChanges(false);
            return;
        }
        
        const priceChanged = editedPrice !== (walkerData?.price || item?.price || '5');
        const descChanged = editedDescription !== (walkerData?.description || 'Sin descripción profesional');
        const ageChanged = editedAge !== (walkerData?.age || item?.age || '27');
        const expChanged = editedExperience !== (walkerData?.experience || item?.experience || '11 Months');
        const coverChanged = editedCoverImage !== (walkerData?.coverImage || null);
        
        setHasChanges(priceChanged || descChanged || ageChanged || expChanged || coverChanged);
    }, [isEditing, editedPrice, editedDescription, editedAge, editedExperience, editedCoverImage, walkerData, item]);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleSelectCoverImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitamos permisos para acceder a tus fotos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                
                setEditedCoverImage(selectedImage.uri);
                setIsUploadingCover(true);
                
                try {
                    const imageFile = {
                        uri: selectedImage.uri,
                        type: 'image/jpeg',
                        name: `cover_${userId}_${Date.now()}.jpg`,
                    };

                    const response = await uploadWalkerCoverImage(userId, imageFile);
                    setEditedCoverImage(response.imageUrl);
                    
                    Toast.show({
                        type: 'success',
                        text1: 'Imagen cargada',
                        text2: 'Recuerda guardar los cambios',
                    });
                } catch (error) {
                    console.error('Error uploading cover image:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'No se pudo subir la imagen',
                    });
                    setEditedCoverImage(walkerData?.coverImage || null);
                } finally {
                    setIsUploadingCover(false);
                }
            }
        } catch (error) {
            console.error('Error selecting cover image:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo seleccionar la imagen',
            });
        }
    };

    const handleSaveProfile = async () => {
        try {
            const profileData = {
                price: editedPrice,
                description: editedDescription,
                age: editedAge,
                experience: editedExperience,
                coverImage: editedCoverImage,
            };
            
            await dispatch(updateProfile({
                userId,
                role: 'walker',
                profileData
            })).unwrap();
            
            setIsEditing(false);
            setHasChanges(false);
            
            Toast.show({
                type: 'success',
                text1: 'Perfil actualizado',
                text2: 'Tu tarifa y descripción se guardaron correctamente',
            });
        } catch (error) {
            console.error('Error al guardar perfil:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron guardar los cambios',
            });
        }
    };

    const handleCancelEdit = () => {
        setEditedPrice(walkerData?.price || item?.price || '5');
        setEditedDescription(walkerData?.description || 'Sin descripción profesional');
        setEditedAge(walkerData?.age || item?.age || '27');
        setEditedExperience(walkerData?.experience || item?.experience || '11 Months');
        setEditedCoverImage(walkerData?.coverImage || null);
        setIsEditing(false);
        setHasChanges(false);
    };

    const Card = ({ hideBorder, label, subLabel, showDollarSign }) => {
        return (
            <View style={{ paddingHorizontal: scale(10), borderLeftWidth: scale(hideBorder ? 0 : 0.7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Label style={{ fontSize: scale(13) }} text={showDollarSign ? `$${label}` : label}/>
                <Label style={{ fontSize: scale(13), paddingHorizontal: scale(5), color: appColors.gray }} text={subLabel ? subLabel : "hr"} />
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
                            <Label text="Age" style={{ fontSize: scale(13), color: appColors.gray }} />
                            {isEditing && isOwnProfile ? (
                                <TextInput
                                    style={styles.smallInput}
                                    value={editedAge}
                                    onChangeText={setEditedAge}
                                    placeholder="Ej: 27"
                                    placeholderTextColor="#999"
                                />
                            ) : (
                                <Label text={`${editedAge}`} style={{ paddingVertical: scale(5), fontSize: scale(17) }} bold />
                            )}
                        </View>
                        <View style={{ marginLeft: scale(20), flex: 1 }}>
                            <Label text="Experience" style={{ fontSize: scale(13), color: appColors.gray }} />
                            {isEditing && isOwnProfile ? (
                                <TextInput
                                    style={styles.smallInput}
                                    value={editedExperience}
                                    onChangeText={setEditedExperience}
                                    placeholder="Ej: 2 años"
                                    placeholderTextColor="#999"
                                />
                            ) : (
                                <Label text={editedExperience} style={{ paddingVertical: scale(5), fontSize: scale(17) }} bold />
                            )}
                        </View>
                    </View>
                    <View>
                        {isEditing && isOwnProfile ? (
                            <TextInput
                                style={styles.descriptionInput}
                                value={editedDescription}
                                onChangeText={setEditedDescription}
                                placeholder="Describe tus servicios como paseador..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                        ) : (
                            <>
                                <Label
                                    text={editedDescription}
                                    style={{ paddingVertical: scale(5), fontSize: scale(13), color: appColors.gray }}
                                    numberOfLines={expanded ? undefined : 3}
                                />
                                {(editedDescription && editedDescription.length > 125) && (
                                    <TouchableOpacity onPress={toggleExpand}>
                                        <Text style={{ fontSize: 13, color: appColors.primary }}>
                                            {expanded ? "Show less" : "Read more"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        {!isOwnProfile && (
                            <CustomButton 
                                label="Agendar" 
                                style={{ marginTop: scale(10) }} 
                            />
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
            {isOwnProfile && (
                <EditButton
                    isEditing={isEditing}
                    hasChanges={hasChanges}
                    onPress={async () => {
                        if (isEditing) {
                            if (hasChanges) {
                                await handleSaveProfile();
                            } else {
                                handleCancelEdit();
                            }
                        } else {
                            setIsEditing(true);
                        }
                    }}
                />
            )}
            
            {editedCoverImage || item.img ? (
                <ImageBackground
                    resizeMode="cover"
                    source={editedCoverImage ? { uri: editedCoverImage } : item.img}
                    style={styles.imageBackground}
                >
                    <BackButton style={styles.backButton} />
                    
                    {isEditing && isOwnProfile && (
                        <TouchableOpacity 
                            style={styles.changeCoverButton}
                            onPress={handleSelectCoverImage}
                            disabled={isUploadingCover}
                        >
                            {isUploadingCover ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <MaterialIcons name="photo-camera" size={scale(24)} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    )}
                </ImageBackground>
            ) : (
                <View style={styles.imageBackground}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColors.lightGray }}>
                        <MaterialIcons name="person" size={scale(80)} color={appColors.gray} />
                    </View>
                    <BackButton style={styles.backButton} />
                    
                    {isEditing && isOwnProfile && (
                        <TouchableOpacity 
                            style={styles.changeCoverButton}
                            onPress={handleSelectCoverImage}
                            disabled={isUploadingCover}
                        >
                            {isUploadingCover ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <MaterialIcons name="photo-camera" size={scale(24)} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    )}
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
                                    {isEditing && isOwnProfile ? (
                                        <View style={{ paddingHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                                            <Label style={{ fontSize: scale(13), marginRight: scale(5) }} text="$" />
                                            <TextInput
                                                style={styles.priceInput}
                                                value={editedPrice}
                                                onChangeText={setEditedPrice}
                                                keyboardType="numeric"
                                                placeholder="5"
                                                placeholderTextColor="#999"
                                            />
                                            <Label style={{ fontSize: scale(13), paddingHorizontal: scale(5), color: appColors.gray }} text="/hr" />
                                        </View>
                                    ) : (
                                        <Card hideBorder label={parseInt(editedPrice) || editedPrice} showDollarSign={true} />
                                    )}
                                    <Card label={item.distance} subLabel={"km"}/>
                                    <Card label={item.rating} subLabel={"⭐"} />
                                    <Card label={"450"} subLabel={"Walks"} />
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
    priceInput: {
        fontSize: scale(13),
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#FF7A59',
        paddingVertical: scale(2),
        paddingHorizontal: scale(8),
        minWidth: scale(50),
        textAlign: 'center',
    },
    descriptionInput: {
        fontSize: scale(13),
        color: '#000',
        borderWidth: 1,
        borderColor: '#FF7A59',
        borderRadius: scale(8),
        padding: scale(12),
        marginTop: scale(5),
        marginBottom: scale(10),
        minHeight: scale(100),
        textAlign: 'left',
        backgroundColor: '#FAFAFA',
    },
    smallInput: {
        fontSize: scale(17),
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#FF7A59',
        paddingVertical: scale(5),
        paddingHorizontal: scale(4),
    },
    changeCoverButton: {
        position: 'absolute',
        bottom: scale(20),
        right: scale(20),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: scale(30),
        width: scale(60),
        height: scale(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
});
