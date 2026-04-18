import React, { useState, useEffect } from 'react';
import {StyleSheet , View, Text, Button , FlatList, ActivityIndicator} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Label from '../components/Label.jsx';
import CustomButton from '../components/CustomButton.jsx';
import Container from '../components/Container.jsx';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { appColors , shadow  } from '../utils/appColors.js';
import { MaterialIcons } from '@expo/vector-icons'
import SearchField from '../components/SearchField.jsx';
import NearYouCard from '../components/NearYouCard.jsx';
import { fetchUsersList } from '../redux/slices/usersListSlice';
import Toast from 'react-native-toast-message';
import { mapUsersToCards } from '../utils/dataMappers';

export default function HomeScreen({ setIsLoggedIn }) {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  
  const profile = useSelector((state) => state.user.profile);
  const role = useSelector((state) => state.user.role);
  const { users, loading, error } = useSelector((state) => state.usersList);
  
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (role) {
      console.log('🔍 Home - Fetching users with role:', role);
      console.log('📍 Home - Location:', profile?.location || 'No location yet');
      dispatch(fetchUsersList({ 
        role, 
        location: profile?.location || 'Argentina',
        limit: 20 
      }));
    }
  }, [role, dispatch]);

  // Log para ver qué datos llegan y marcar que terminó la carga inicial
  useEffect(() => {
    console.log('📦 Home - Users data:', users);
    console.log('👤 Home - User role:', role);
    console.log('📊 Home - Mapped users count:', mappedUsers.length);
    
    // Marcar que ya no es carga inicial cuando llegan datos
    if (users.length > 0 && initialLoad) {
      setInitialLoad(false);
    }
  }, [users, role]);

  // Mapear usuarios/perros según el rol usando función centralizada
  const mappedUsers = mapUsersToCards(users, role).filter(item => {
    // Filtrar al usuario logueado solo si es owner viendo walkers
    if (role === 'owner') {
      return item.walkerData?.userId !== profile?.id;
    }
    // Para walkers viendo perros, no filtrar (no pueden ver sus propios perros aquí)
    return true;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchUsersList({ 
      role, 
      location: profile?.location || 'Argentina',
      limit: 20 
    })).finally(() => setRefreshing(false));
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const navigateToBookWalk = () => {
    navigator.navigate('BookWalk');
  };

  const navigateToProfile = (item) => {
    // Tanto owners (viendo walkers) como walkers (viendo perros) van a WalkerProfile
    // El componente WalkerProfile detecta automáticamente si es un pet o walker
    navigator.navigate('WalkerProfile', { item });
  };

  const _renderHeader = () => {
    return (<View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(20)}}>
      <View>
        <Label text="Home" bold style={{  fontSize: scale(34)}}/>
        <Label 
          text={role === 'owner' ? 'Explore dog walkers' : 'Explore dogs'} 
          style={{ fontSize: scale(17), color: appColors.gray}}
        />
      </View>
      <CustomButton iconLeft={<MaterialIcons name="add" color={appColors.white}  size={scale(12)}/>} onPress={navigateToBookWalk} label={"Book a walk"}  
      style={{width: scale(104), fontSize:(10), paddingHorizontal:scale(5)}}
      labelStyle={{fontSize:scale(11), marginRight: scale(10), marginTop: scale(2.5)}}
      />
    </View>
    )
  }

  const HeadingLabel = ({label, subLabel}) => {
    return <View style={{ flexDirection: 'row' , justifyContent: 'space-between' , alignItems: 'center'}}>
      <Label text={label? label: "Near you"} style={{ fontSize: scale(34) }} bold/>
      <Label text={subLabel? subLabel: "View all"} style={{ textDecorationLine: 'underline' , fontSize: scale(15)}}/>
    </View>
  }

  // Mostrar loading solo en carga inicial o cuando está cargando
  if (loading || (initialLoad && mappedUsers.length === 0)) {
    return (
      <Container style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={appColors.primary} />
        <Label 
          text={`Cargando ${role === 'owner' ? 'paseadores' : 'perros'}...`} 
          style={{ marginTop: scale(10), color: appColors.gray }} 
        />
      </Container>
    );
  }

  return (
    <Container style={styles.scrollContainer} isScrollable>
      {_renderHeader()}
      <View style={{ paddingVertical: scale(20)}}>
        <SearchField placeholder={profile?.location || "Tucumán, Argentina"}/>
      </View>
      
      {mappedUsers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: scale(40) }}>
          <MaterialIcons name="person-search" size={scale(60)} color={appColors.gray} />
          <Label 
            text={`No hay ${role === 'owner' ? 'paseadores' : 'perros'} disponibles`} 
            style={{ marginTop: scale(10), color: appColors.gray }} 
          />
          <CustomButton 
            label="Recargar" 
            onPress={handleRefresh}
            style={{ marginTop: scale(20), width: scale(120) }}
          />
        </View>
      ) : (
        <>
          <View style={{paddingVertical:scale(20)}}>
            <HeadingLabel/>
            <FlatList
              horizontal
              data={mappedUsers.slice(0, 10)}
              ItemSeparatorComponent={() => <View style={{padding: scale(20)}}></View>}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigateToProfile(item)}>
                  <NearYouCard item={item} />
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={{paddingVertical:scale(20)}}>
            <HeadingLabel label={"Suggested"}/>
            <FlatList
              horizontal
              data={mappedUsers.slice(5, 15)}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={{padding: scale(20)}}></View>}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => navigateToProfile(item)} key={index}>
                  <NearYouCard item={item} />
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: appColors.primary,
    alignItems: 'center',
    borderBottomWidth: 12,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    padding: 20,
    margin: 20,
    textAlign:'center'
  },
  TitleText: {
      fontSize: 25,
      // padding: 20,
      marginVertical: 20,
    },
  scrollContainer: {
    flex: 1,
    paddingHorizontal:10
  },
  
});