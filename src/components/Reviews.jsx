import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Si usas FontAwesome para las estrellas
import { appColors } from '../utils/appColors'; // Ajusta la ruta según tu proyecto
import { scale } from 'react-native-size-matters';
const reviewsData = [
    {
        id: '1',
        userName: 'Juan Pérez',
        rating: 4,
        comment: 'Excelente servicio, mi perro siempre está feliz después de cada visita.',
        date: '10 de Octubre, 2024',
        userImage: 'https://i1.sndcdn.com/avatars-000149470266-qebg7e-t240x240.jpg'
    },
    {
        id: '2',
        userName: 'Maria López',
        rating: 5,
        comment: 'Gran atención y cuidado, altamente recomendable!',
        date: '8 de Octubre, 2024',
        userImage: 'https://i1.sndcdn.com/avatars-000149470266-qebg7e-t240x240.jpg'
    },
    // Agrega más reviews si es necesario
];

const Reviews = () => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= rating ? 'star' : 'star-o'}
                    size={scale(16)}
                    color={appColors.primary}
                />
            );
        }
        return stars;
    };

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewContainer}>
            <Image source={{ uri: item.userImage }} style={styles.userImage} />
            <View style={styles.reviewContent}>
                <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
                </View>
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            data={reviewsData}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: scale(15),
    },
    reviewContainer: {
        flexDirection: 'row',
        marginBottom: scale(15),
        borderBottomWidth: scale(0.5),
        color: appColors.primaryTwo,
        padding: scale(3),
    },
    userImage: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(25),
        marginRight: scale(10),
    },
    reviewContent: {
        flex: 1,
    },
    userNameContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
    },
    userName: {
        fontSize: scale(15),
        fontWeight: 'bold',
        color: appColors.darkGray,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    comment: {
        fontSize: scale(13),
        color: appColors.gray,
        marginVertical: scale(5),
    },
    date: {
        fontSize: scale(11),
        color: appColors.lightGray,
    },
});

export default Reviews;