import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Label from '../components/Label';
import { appColors } from '../utils/appColors';

export default function Profile({ setIsLoggedIn }) {
  const navigation = useNavigation();

  const userProfile = {
    name: 'Cristian Downey',
    location: 'San miguel de Tucumán',
    rating: 4.4,
    experience: '8 meses',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit, accumsan fermentum class convallis tincidunt porttitor tempus magna, aliquam montes feugiat luctus pellentesque libero.',
    profileImage: require('../../assets/users/img-1.png'),
    pets: [
      { name: 'Tobi', type: 'Reina' }
    ],
    paymentMethod: 'Efectivo',
    history: [
      {
        id: 1,
        name: 'Juan Bazterrica',
        time: '2 Hrs',
        status: 'Paseo',
        date: '10/03/2026',
        image: require('../../assets/users/img-2.png')
      },
      {
        id: 2,
        name: 'Ana SantaMaria',
        time: '4 Hrs',
        status: 'Alojamiento',
        date: '05/03/2026',
        image: require('../../assets/users/img-3.png')
      },
      {
        id: 3,
        name: 'Manuel Rivas',
        time: '1 Hrs',
        status: 'Paseo',
        date: '01/03/2026',
        image: require('../../assets/users/img-4.png')
      }
    ]
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={userProfile.profileImage}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={scale(16)} color="#666" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.nameContainer}>
            <Label text={userProfile.name} style={styles.userName} bold />
            <MaterialIcons name="edit" size={scale(18)} color="#666" style={styles.editNameIcon} />
          </View>
          
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={scale(16)} color="#999" />
            <Label text={userProfile.location} style={styles.locationText} />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.ratingContainer}>
              <Label text={userProfile.rating.toString()} style={styles.ratingText} bold />
              <MaterialIcons name="star" size={scale(16)} color="#FFB84D" />
            </View>
            <View style={styles.divider} />
            <Label text={userProfile.experience} style={styles.experienceText} />
          </View>

          <Label text={userProfile.description} style={styles.descriptionText} />
          <TouchableOpacity style={styles.editDescriptionIcon}>
            <MaterialIcons name="edit" size={scale(16)} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Mascotas Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="pets" size={scale(20)} color="#FF7A59" />
            <Label text="Mascotas" style={styles.sectionTitle} bold />
          </View>
          <View style={styles.sectionContent}>
            <Label text={`${userProfile.pets[0].name} | ${userProfile.pets[0].type}`} style={styles.sectionText} />
            <TouchableOpacity>
              <MaterialIcons name="edit" size={scale(18)} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pagos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="payment" size={scale(20)} color="#FF7A59" />
            <Label text="Pagos" style={styles.sectionTitle} bold />
          </View>
          <View style={[styles.sectionContent, styles.paymentContent]}>
            <Label text={userProfile.paymentMethod} style={styles.sectionText} />
            <TouchableOpacity>
              <MaterialIcons name="edit" size={scale(18)} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial Section */}
        <View style={styles.historialSection}>
          <Label text="Historial" style={styles.historialTitle} bold />
          
          {userProfile.history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Image 
                source={item.image}
                style={styles.historyImage}
              />
              <View style={styles.historyInfo}>
                <Label text={item.name} style={styles.historyName} bold />
                <Label 
                  text={`${item.time} | ${item.status}`} 
                  style={styles.historyDetails} 
                />
                <Label text={item.date} style={styles.historyDate} />
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Label text="Contactar" style={styles.contactButtonText} bold />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(30),
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: scale(50),
    paddingBottom: scale(10),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: scale(10),
    marginBottom: scale(20),
    position: 'relative',
  },
  profileImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: '#E0E0E0',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#FFF',
    borderRadius: scale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  userName: {
    fontSize: scale(22),
    color: '#000',
  },
  editNameIcon: {
    marginLeft: scale(8),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  locationText: {
    fontSize: scale(14),
    color: '#999',
    marginLeft: scale(4),
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: scale(14),
    color: '#000',
    marginRight: scale(4),
  },
  divider: {
    width: 1,
    height: scale(14),
    backgroundColor: '#CCC',
    marginHorizontal: scale(12),
  },
  experienceText: {
    fontSize: scale(14),
    color: '#000',
  },
  descriptionText: {
    fontSize: scale(13),
    color: '#999',
    textAlign: 'center',
    lineHeight: scale(20),
    paddingHorizontal: scale(10),
  },
  editDescriptionIcon: {
    marginTop: scale(8),
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(20),
    marginBottom: scale(12),
    borderRadius: scale(12),
    padding: scale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: scale(14),
    color: '#000',
    marginLeft: scale(8),
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentContent: {
    borderTopWidth: 1,
    borderTopColor: '#4A9FFF',
    paddingTop: scale(12),
  },
  sectionText: {
    fontSize: scale(14),
    color: '#000',
  },
  historialSection: {
    paddingHorizontal: scale(20),
    marginTop: scale(10),
  },
  historialTitle: {
    fontSize: scale(16),
    color: '#000',
    marginBottom: scale(16),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(12),
  },
  historyImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#E0E0E0',
  },
  historyInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  historyName: {
    fontSize: scale(14),
    color: '#000',
    marginBottom: scale(2),
  },
  historyDetails: {
    fontSize: scale(12),
    color: '#666',
    marginBottom: scale(2),
  },
  historyDate: {
    fontSize: scale(11),
    color: '#999',
  },
  contactButton: {
    backgroundColor: '#FF7A59',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(20),
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: scale(12),
  },
});
