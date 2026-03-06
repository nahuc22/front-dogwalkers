import React, { useState } from 'react';
import {StyleSheet , View, Text, Button , FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native';
import Label from '../components/Label.jsx';
import CustomButton from '../components/CustomButton.jsx';
import Container from '../components/Container.jsx';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { nearYou } from '../utils/MockData.js';
import { appColors , shadow  } from '../utils/appColors.js';
import { MaterialIcons } from '@expo/vector-icons'
import SearchField from '../components/SearchField.jsx';
import NearYouCard from '../components/NearYouCard.jsx';

export default function HomeScreen({ setIsLoggedIn }) {
  const navigator = useNavigation();

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const navigateToSchedule = ( item )=> {
    navigator.navigate('Schedule', { item });
  };

  const navigateToBookWalk = () => {
    navigator.navigate('BookWalk');
  };

  const _renderHeader = () => {
    return (<View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginTop: scale(20)}}>
      <View>
        <Label text="Home" bold style={{  fontSize: scale(34) }}/>
        <Label text="Explore dog walkers" style={{ fontSize: scale(17), color: appColors.gray}}/>
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

  return (
    <Container style={styles.scrollContainer} isScrollable>
      {_renderHeader()}
      <View style={{ paddingVertical: scale(20)}}>
      <SearchField placeholder="Tucumán, Argentina"/>
      </View>
      <View style={{paddingVertical:scale(20)}}>
      <HeadingLabel/>
      <FlatList
      horizontal
      data={nearYou}
      ItemSeparatorComponent={() => <View style={{padding: scale(20)}}></View>}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigateToSchedule(item)}>
          <NearYouCard item={item} />
        </TouchableOpacity>
      )}
      />
      </View>
      <View style={{paddingVertical:scale(20)}}>
      <HeadingLabel  label={"Suggested"}/>
      <FlatList
      horizontal
      data={nearYou?.reverse()}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View style={{padding: scale(20)}}></View>}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => <NearYouCard item={item} key={index}/>}
      />
      </View>
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